const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/check', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const url = `https://wa.me/${phone}`;
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const body = response.data;
    if (body.includes('not on WhatsApp') || body.includes('is not available')) {
      return res.json({ banned: true, reason: 'Number is not on WhatsApp' });
    } else {
      return res.json({ banned: false, reason: 'Number is active' });
    }

  } catch (error) {
    return res.json({ banned: true, reason: 'Could not reach number' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MR DRACULA backend running on port ${PORT}`);
});
