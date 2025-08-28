const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const { setupIndex, searchProducts } = require('./search');

setupIndex();

app.use(cors());
app.use(express.json());

// Placeholder for search endpoint
app.get('/', (req, res) => {
  res.send('Marketplace backend running');
});

app.get('/search', async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  try {
    const results = await searchProducts({
      query: q,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 