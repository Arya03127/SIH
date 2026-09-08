const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function transportCostPerKg(distanceKm) {
  return 1.5 + distanceKm * 0.2;
}

function estimateDistanceKm(locA, locB) {
  if (!locA || !locB) return 25;
  const a = locA.trim().toLowerCase();
  const b = locB.trim().toLowerCase();
  if (a === b) return 8;
  return 35;
}

function profitComparison({ quantityKg, directPricePerKg, mandiPricePerKg, farmerLocation, buyerLocation }) {
  const distance = estimateDistanceKm(farmerLocation, buyerLocation);
  const transport = transportCostPerKg(distance);

  const directNetPerKg = Number(directPricePerKg) - transport;
  const traditionalNetPerKg = Number(mandiPricePerKg);

  return {
    distanceKm: distance,
    transportCostPerKg: Number(transport.toFixed(2)),
    directNetPerKg: Number(directNetPerKg.toFixed(2)),
    traditionalNetPerKg: Number(traditionalNetPerKg.toFixed(2)),
    directTotal: Number((directNetPerKg * quantityKg).toFixed(2)),
    traditionalTotal: Number((traditionalNetPerKg * quantityKg).toFixed(2)),
    gainVsTraditional: Number(((directNetPerKg - traditionalNetPerKg) * quantityKg).toFixed(2))
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, f.name AS farmer_name, f.location AS farmer_location
       FROM products p
       JOIN farmers f ON f.id = p.farmer_id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { farmerId, name, quantityKg, expectedPricePerKg, harvestDate, location } = req.body;
  if (!farmerId || !name || !quantityKg || expectedPricePerKg == null || !harvestDate || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (farmer_id, name, quantity_kg, expected_price_per_kg, harvest_date, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [farmerId, name, quantityKg, expectedPricePerKg, harvestDate, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/buyers', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buyers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { productId, buyerId, quantityKg, agreedPricePerKg } = req.body;
  if (!productId || !buyerId || !quantityKg || agreedPricePerKg == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (product_id, buyer_id, quantity_kg, agreed_price_per_kg)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, buyerId, quantityKg, agreedPricePerKg]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, p.name AS product_name, b.name AS buyer_name
       FROM orders o
       JOIN products p ON p.id = o.product_id
       JOIN buyers b ON b.id = o.buyer_id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profit-estimate', async (req, res) => {
  const { productId, buyerId, mandiPricePerKg } = req.body;
  if (!productId || !buyerId || mandiPricePerKg == null) {
    return res.status(400).json({ error: 'productId, buyerId, mandiPricePerKg are required' });
  }

  try {
    const query = await pool.query(
      `SELECT p.id, p.name, p.quantity_kg, p.expected_price_per_kg, p.location AS product_location,
              f.name AS farmer_name, f.location AS farmer_location,
              b.name AS buyer_name, b.location AS buyer_location
       FROM products p
       JOIN farmers f ON f.id = p.farmer_id
       JOIN buyers b ON b.id = $2
       WHERE p.id = $1`,
      [productId, buyerId]
    );

    if (query.rowCount === 0) {
      return res.status(404).json({ error: 'Product or buyer not found' });
    }

    const row = query.rows[0];
    const comp = profitComparison({
      quantityKg: Number(row.quantity_kg),
      directPricePerKg: Number(row.expected_price_per_kg),
      mandiPricePerKg: Number(mandiPricePerKg),
      farmerLocation: row.farmer_location,
      buyerLocation: row.buyer_location
    });

    res.json({
      productId: row.id,
      productName: row.name,
      farmerName: row.farmer_name,
      buyerName: row.buyer_name,
      quantityKg: Number(row.quantity_kg),
      expectedPricePerKg: Number(row.expected_price_per_kg),
      mandiPricePerKg: Number(mandiPricePerKg),
      ...comp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function bootstrap() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schemaSql);

  await pool.query(`INSERT INTO farmers (name, location)
                    VALUES ('Ravi Patil', 'Nashik'), ('Sita Devi', 'Pune')
                    ON CONFLICT DO NOTHING`);

  await pool.query(`INSERT INTO buyers (name, location)
                    VALUES ('FreshMart Retail', 'Mumbai'), ('Local Kirana Group', 'Pune')
                    ON CONFLICT DO NOTHING`);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap backend:', err);
  process.exit(1);
});
