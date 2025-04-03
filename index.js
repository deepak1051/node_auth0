require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendEmail = require('./utils/sendEmail');
const path = require('node:path');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/auth/callback', async (req, res) => {
  const { token, email } = req.body;

  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const userInfo = response.data;
    if (userInfo.email !== email) throw new Error('Invalid email');

    // const emailOptions = {
    //   from: process.env.SMTP_USER,
    //   to: email,
    //   subject: 'Auth0 Token',
    //   text: `Your token: ${token}`,
    // };

    // await transporter.sendMail(emailOptions);

    const resp = await sendEmail(
      email,
      'Your Authentication Token',
      `Your token: ${token}`
    );

    console.log('resp');
    res.json({ message: 'Email sent successfully!' });
    // res.json({ message: 'Token sent to email!' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server running on port 5000'));
