import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text(''));
app.get('/user/:id', (c) => c.text(c.req.param('id')));
app.post('/user', (c) => c.text(''));

const config = {
  fetch: app.fetch as never,
  port: 3000,
};

console.log('Hono server listening on port 3000');

export default config;
