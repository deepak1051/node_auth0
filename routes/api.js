const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/auth/callback', async (req, res) => {
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

    const resp = await sendEmail(
      email,
      'Your Authentication Token',
      `Your token: ${token}`
    );

    console.log('resp');
    res.json({ message: 'Email sent successfully!' });
    // res.json({ message: 'Token sent to email!' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
