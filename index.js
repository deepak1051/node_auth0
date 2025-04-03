require('dotenv').config();
const express = require('express');
const cors = require('cors');

const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./routes/api'));

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '/client/dist')));

  // app.get('*', (req, res) =>
  //   res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  // );

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server running on port 5000'));
