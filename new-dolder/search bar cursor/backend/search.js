const { Client } = require('@elastic/elasticsearch');
const products = require('./products');

const esClient = new Client({ node: 'http://localhost:9200' });
const INDEX = 'products';

async function setupIndex() {
  // Delete and recreate index for fresh data
  try { await esClient.indices.delete({ index: INDEX }); } catch {}
  await esClient.indices.create({
    index: INDEX,
    body: {
      mappings: {
        properties: {
          name: { type: 'text' },
          category: { type: 'keyword' },
          price: { type: 'float' },
          description: { type: 'text' }
        }
      }
    }
  });
  // Bulk index products
  const body = products.flatMap(doc => [{ index: { _index: INDEX } }, doc]);
  await esClient.bulk({ refresh: true, body });
}

async function searchProducts({ query, category, minPrice, maxPrice }) {
  const must = [];
  if (query) {
    must.push({ multi_match: { query, fields: ['name', 'description'] } });
  }
  if (category) {
    must.push({ term: { category } });
  }
  if (minPrice || maxPrice) {
    const range = {};
    if (minPrice) range.gte = minPrice;
    if (maxPrice) range.lte = maxPrice;
    must.push({ range: { price: range } });
  }
  const result = await esClient.search({
    index: INDEX,
    body: {
      query: { bool: { must } }
    }
  });
  return result.hits.hits.map(hit => hit._source);
}

module.exports = { setupIndex, searchProducts }; 