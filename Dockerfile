FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install && bun add hono@4.7.11

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
