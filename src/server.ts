import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { config } from './config.js';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import routes from './routes.js';
import { HTTPException } from 'hono/http-exception';

const app = new Hono({ strict: false });
app.use(logger());
app.use(prettyJSON());
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

serve(
  {
    fetch: app.fetch,
    port: config.port,
    hostname: config.hostname,
  },
  (options) => {
    console.log(`Server running on ${config.protocol}://${config.hostname}:${options.port}`);
  },
);
