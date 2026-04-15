const express = require('express');
const app = express();
const port = 4000;

app.use(express.json()); // Middleware to parse JSON bodies

let products = [
  { id: 1, name: 'Phone', price: 200 },
  { id: 2, name: 'Laptop', price: 999 },
  { id: 3, name: 'Headphones', price: 79 },
  { id: 4, name: 'Keyboard', price: 45 },
  { id: 5, name: 'Mouse', price: 25 },
  { id: 6, name: 'Monitor', price: 299 },
  { id: 7, name: 'Tablet', price: 399 },
  { id: 8, name: 'Smartwatch', price: 149 },
  { id: 9, name: 'Charger', price: 19 },
  { id: 10, name: 'Speaker', price: 89 }
];

// Get all products in home route and products route
app.get('/', (req, res) => {
  res.json(products);
});

app.get('/products', (req, res) => {
  res.json(products);
});

// Search products by name
app.get('/products/search', (req, res) => {
  const query = req.query.q;
    if (!query) return res.status(400).send('Query parameter "q" is required');
    const results = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    res.json(results);
});

// Get a product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

// Create a new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).send('Name and price are required');
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product by ID
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
    const { name, price } = req.body;
    product.name = name;
    product.price = price;
    res.json(product);
});

// Delete a product by ID
app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) return res.status(404).send('Product not found');
  products.splice(productIndex, 1);  // 1 means remove one item at the found index
  res.json({ message: 'Product deleted' });
});


// Route not found handler
app.use((req, res) => {
  res.status(404).send('Route not found');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
