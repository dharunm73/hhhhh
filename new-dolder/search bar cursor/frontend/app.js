document.getElementById('searchForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const q = document.getElementById('searchInput').value;
  const category = document.getElementById('categoryFilter').value;
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;

  let url = 'http://localhost:3001/search?';
  if (q) url += `q=${encodeURIComponent(q)}&`;
  if (category) url += `category=${encodeURIComponent(category)}&`;
  if (minPrice) url += `minPrice=${encodeURIComponent(minPrice)}&`;
  if (maxPrice) url += `maxPrice=${encodeURIComponent(maxPrice)}&`;

  const res = await fetch(url);
  const products = await res.json();
  renderResults(products);
});

function renderResults(products) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  if (!products.length) {
    resultsDiv.innerHTML = '<p>No products found.</p>';
    return;
  }
  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${product.category}</h6>
          <p class="card-text">${product.description}</p>
          <p class="card-text fw-bold">$${product.price}</p>
        </div>
      </div>
    `;
    resultsDiv.appendChild(col);
  });
} 