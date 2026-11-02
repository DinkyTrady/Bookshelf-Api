import { Books, BooksData, BooksUpdate } from './books.js';
import { HTTPException } from 'hono/http-exception';
import { createFactory } from 'hono/factory';
import { validator } from 'hono/validator';

const books: Books[] = [];
const { createHandlers } = createFactory();
let tmpId = books.length === 0 ? 1 : books.length;

export const addBooksHandler = createHandlers(
  validator('json', (val: BooksData) => {
    const body = val;
    if (!body) {
      throw new HTTPException(400, { message: 'Invalid request data' });
    }

    if (!body.readPage || typeof body.readPage !== 'number') {
      throw new HTTPException(400, { message: 'read page must be number' });
    }

    return body;
  }),
  (c) => {
    const body = c.req.valid('json');
    if (!body) {
      throw new HTTPException(400, { message: 'Field incomplete' });
    }

    if (body.readPage > body.pageCount) {
      throw new HTTPException(400, {
        message: "read page can't be higher than page count",
      });
    }

    const id = tmpId++;
    const insertedAt = Date.now().toString();
    const updatedAt = '-';
    const newBooks = {
      id,
      ...body,
      insertedAt,
      updatedAt,
    };

    books.push(newBooks);

    const theBook = getId(id);
    return c.json({ success: true, message: 'success create add new books', data: [theBook] }, 201);
  },
);

export const getAllHandler = createHandlers((c) => {
  const { name, reading, finished } = c.req.query();

  let filteredBooks = books.map((v) => v);
  if (name) {
    filteredBooks = books.filter((b) => b.name.includes(name.toLowerCase()));
  }

  if (reading) {
    const isRead = finished == '1' || finished == 'true';
    filteredBooks = books.filter((b) => b.reading === isRead);
  }

  if (finished) {
    const isFinish = finished == '1' || finished == 'true';
    filteredBooks = books.filter((b) => b.finished === isFinish);
  }

  return c.json({ success: true, message: 'Success get all books', data: filteredBooks }, 200);
});

export const getIdHandler = createHandlers(
  validator('param', (val) => {
    const b = val['id'];
    if (!b || isNaN(parseInt(b, 10))) {
      throw new HTTPException(400, { message: 'ID is not an number' });
    }

    return parseInt(b, 10);
  }),
  (c) => {
    const id = c.req.valid('param');

    const data = getId(id);
    return c.json({ status: true, message: 'Succcess get books', data }, 200);
  },
);

export const editHandler = createHandlers(
  validator('json', (val: BooksUpdate) => {
    const body = val;
    if (!body) {
      throw new HTTPException(400, { message: 'Invalid request data' });
    }

    return body;
  }),
  validator('param', (val) => {
    const b = val['id'];
    if (!b || isNaN(parseInt(b, 10))) {
      throw new HTTPException(400, { message: 'ID is not an number' });
    }

    return parseInt(b, 10);
  }),
  (c) => {
    const body = c.req.valid('json');
    const id = c.req.valid('param');

    const bookId = books.findIndex((v) => v.id === id);
    const existBook = books[bookId];

    if (!body) {
      throw new HTTPException(400, { message: 'Field incomplete' });
    }

    if (!existBook) {
      throw new HTTPException(404, { message: `book with ID: ${bookId}, not exist` });
    }

    const readPage = body.readPage ? body.readPage : existBook.readPage;
    const pageCount = body.pageCount ? body.pageCount : existBook.pageCount;

    if (readPage > pageCount) {
      throw new HTTPException(400, {
        message: "read page can't be higher than page count",
      });
    }

    const updateBook = {
      ...existBook,
      ...body,
      updatedAt: Date.now().toString(),
    } as Books;

    books[bookId] = updateBook;

    return c.json({ success: true, message: 'Success update book data', data: [books[bookId]] }, 200);
  },
);

export const deleteHandler = createHandlers(
  validator('param', (val) => {
    const id = val['id'];
    if (!id || isNaN(parseInt(id, 10))) {
      throw new HTTPException(400, { message: 'ID is not an number' });
    }

    return parseInt(id, 10);
  }),
  (c) => {
    const id = c.req.valid('param');

    const bookId = books.findIndex((v) => v.id === id);
    if (bookId < 0) {
      console.log(bookId);
      throw new HTTPException(404, { message: `Not found book with ID ${id}` });
    }

    books.splice(bookId, 1);

    return c.json({ success: true, message: `Success remove book with ID: ${id}` }, 200);
  },
);

const getId = (id: number) => {
  const theBook = books.find((v) => v.id === id);
  if (!theBook) {
    throw new HTTPException(404, {
      message: `books with ID: ${id} not found!`,
    });
  }

  return theBook;
};
