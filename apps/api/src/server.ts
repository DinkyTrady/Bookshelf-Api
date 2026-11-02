import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import routes from './routes.js';
import { HTTPException } from 'hono/http-exception';
import { config } from '../../../packages/shared/src/configs/global.js';

const app = new Hono({ strict: false });
app.use(logger());
app.use('*', cors());

app.get('/', (c) => c.text('hello'));
app.route('/api', routes);

app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return c.json({ status: false, message: e.message }, e.status);
  }

  return c.json({ status: false, message: 'Internal server error' }, 500);
});

app.notFound((c) => {
  return c.json({ status: false, message: `Not found path with ${c.req.url}` }, 404);
});

Bun.serve({
  fetch: app.fetch,
  port: config.port,
  hostname: config.hostname,
});
