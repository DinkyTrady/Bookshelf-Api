import config from '../config';

Bun.serve({
  hostname: config.hostname,
  port: config.port,
  fetch: () => Response.json('Hello', 200),
  error(error) {
    Response.json(
      { message: error.message, cause: error.cause },
      parseInt(error.code || '500', 10),
    );
  },
});

console.log(`Server started on http://${config.hostname}:${config.port}`);
