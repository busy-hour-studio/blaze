import express from 'express';
import { PORT_ALLOCATION } from '../config';

const app = express();

app.get('/', (req, res) => {
  res.send('');
});

app.get('/user/:id', (req, res) => {
  res.send(req.params.id);
});

app.post('/user', (req, res) => {
  res.send('');
});

app.listen(PORT_ALLOCATION.EXPRESS, () => {
  console.log(`Express server listening on port ${PORT_ALLOCATION.EXPRESS}`);
});
