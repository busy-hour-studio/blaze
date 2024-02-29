import express from 'express';

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

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
