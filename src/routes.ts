import { Hono } from 'hono';
import { addBooksHandler, deleteHandler, editHandler, getAllHandler, getIdHandler } from './handler.js';

const routes = new Hono().basePath('/books');

routes.get('/', ...getAllHandler);
routes.post('/', ...addBooksHandler);
routes.get('/:id', ...getIdHandler);
routes.patch('/:id', ...editHandler);
routes.delete('/:id', ...deleteHandler);

export default routes;
