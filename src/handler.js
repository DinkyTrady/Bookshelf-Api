const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        // eslint-disable-next-line max-len
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = [
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  ];

  books.push(newBooks);

  const isSucces = books.filter((book) => book.id === id);

  if (isSucces) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Gagal menambahkan buku',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  if (!name) {
    const BooksName = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    const response = h.response({
      status: 'success',
      data: BooksName.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    });

    response.code(200);
    return response;
  }

  if (!reading) {
    const BooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );
    const response = h.response({
      status: 'success',
      data: BooksReading.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    });

    response.code(200);
    return response;
  }

  if (!finished) {
    const BooksFinished = books.filter((book) => book.finished === finished);
    const response = h.response({
      status: 'success',
      data: {
        books: BooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBooksByIdHandler = (req, h) => {
  const { id } = req.params;
  const book = books.filter((books) => books.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: book,
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(500);
  return response;
};

const editBooksByIdHandler = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const index = books.findIndex((books) => books.id === id);
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        // eslint-disable-next-line
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (books[index] !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.conde(404);
  return response;
};

const deleteBooksByIdHandler = (req, h) => {
  const { id } = req.params;
  const index = books.findIndex((books) => books.id === id);

  if (books[index] !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
