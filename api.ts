import express from 'express';
const app = express();
const port = 3000;

app.get('/chat', (req, res) => {
  res.send('Hello from TinyLlama!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
