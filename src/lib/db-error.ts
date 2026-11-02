import { LibsqlError } from "@libsql/client";

type HttpStatus = 400 | 404 | 409 | 413 | 422 | 500 | 503;

export type DBErrorMapping = {
  status: HttpStatus;
  code: string;
  message: string;
  field?: string;
};

export function extractLibsqlError(err: unknown): LibsqlError | null {
  let current: unknown = err;
  while (current && typeof current === "object") {
    if (
      current instanceof LibsqlError ||
      (current as Error).name === "LibsqlError" ||
      ("code" in current &&
        typeof (current as { code?: unknown }).code === "string" &&
        ("rawCode" in current || "extendedCode" in current))
    ) {
      return current as LibsqlError;
    }
    if ("cause" in current && current.cause) {
      current = current.cause;
    } else {
      break;
    }
  }
  return null;
}

function constraintTarget(message: string): string | undefined {
  const m = message.match(/constraint failed:\s*([^\n,]+)/i);
  if (!m?.[1]) return undefined;
  return m[1].trim().split(".").pop();
}

export function mapDbError(err: unknown): DBErrorMapping | null {
  const libsqlErr = extractLibsqlError(err);
  if (!libsqlErr) return null;

  const code = libsqlErr.code;
  const extended = libsqlErr.extendedCode ?? code;
  const msg = libsqlErr.message || "";

  // 1. Foreign key and Restrict triggers (e.g. deleting parent with active children)
  if (
    extended === "SQLITE_CONSTRAINT_TRIGGER" ||
    extended === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
    msg.includes("FOREIGN KEY constraint failed") ||
    msg.includes("RESTRICT constraint failed")
  ) {
    return {
      status: 409,
      code: "FK_CONSTRAINT",
      message:
        "Operation references a record that does not exist, or one still in use",
    };
  }

  // 2. Unique and Primary Key violations
  if (
    extended === "SQLITE_CONSTRAINT_UNIQUE" ||
    extended === "SQLITE_CONSTRAINT_PRIMARYKEY" ||
    msg.includes("UNIQUE constraint failed") ||
    msg.includes("PRIMARY KEY constraint failed")
  ) {
    const field = constraintTarget(msg);
    return {
      status: 409,
      code: "Duplicate",
      field,
      message: field ? `${field} already exists` : "Value already exists",
    };
  }

  // 3. Not Null constraints
  if (
    extended === "SQLITE_CONSTRAINT_NOTNULL" ||
    msg.includes("NOT NULL constraint failed")
  ) {
    const field = constraintTarget(msg);
    return {
      status: 422,
      code: "REQUIRED",
      field,
      message: field ? `${field} is required` : "Missing required field",
    };
  }

  // 4. Check constraints
  if (
    extended === "SQLITE_CONSTRAINT_CHECK" ||
    msg.includes("CHECK constraint failed")
  ) {
    return {
      status: 422,
      code: "CHECK",
      message: "Value violates a check constraint",
    };
  }

  // 5. Database Concurrency & Locks
  if (
    code === "SQLITE_BUSY" ||
    code === "SQLITE_LOCKED" ||
    extended.startsWith("SQLITE_BUSY")
  ) {
    return {
      status: 503,
      code: "DB_BUSY",
      message: "Database is busy, try again",
    };
  }

  // 6. Upstream / Network / Connection
  if (code === "SERVER_ERROR") {
    return {
      status: 503,
      code: "UPSTREAM_DB_ERROR",
      message: "Upstream database service error",
    };
  }
  if (code === "CLIENT_CLOSED" || code === "TRANSACTION_CLOSED") {
    return {
      status: 500,
      code: "DB_CLIENT_CLOSED",
      message: "Database connection closed",
    };
  }
  if (code === "RESPONSE_TOO_LARGE") {
    return {
      status: 413,
      code: "PAYLOAD_TOO_LARGE",
      message: "Database response exceeded size limit",
    };
  }

  return null;
}
