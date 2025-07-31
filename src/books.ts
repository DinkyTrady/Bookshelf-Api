export type Books = {
  id: number;
  name: string;
  releaseDate: string;
  author: string;
  summary: string;
  genre: string[];
  publisher: string;
  pageCount: number;
  readPage: number;
  finished: boolean;
  reading: boolean;
  insertedAt: string;
  updatedAt: string;
};

export type BooksData = Omit<Books, 'id' | 'insertedAt' | 'updatedAt'>;
export type BooksUpdate = Partial<BooksData>;
