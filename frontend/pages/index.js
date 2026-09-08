import { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [newProduct, setNewProduct] = useState({
    farmerId: 1,
    name: '',
    quantityKg: '',
    expectedPricePerKg: '',
    harvestDate: '',
    location: ''
  });

  const [newOrder, setNewOrder] = useState({
    productId: '',
    buyerId: '',
    quantityKg: '',
    agreedPricePerKg: ''
  });

  const [estimateInput, setEstimateInput] = useState({
    productId: '',
    buyerId: '',
    mandiPricePerKg: ''
  });
  const [estimate, setEstimate] = useState(null);

  async function fetchAll() {
    const [p, b, o] = await Promise.all([
      fetch(`${API_BASE}/api/products`).then((r) => r.json()),
      fetch(`${API_BASE}/api/buyers`).then((r) => r.json()),
      fetch(`${API_BASE}/api/orders`).then((r) => r.json())
    ]);
    setProducts(p);
    setBuyers(b);
    setOrders(o);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === String(estimateInput.productId)),
    [products, estimateInput.productId]
  );

  async function addProduct(e) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: Number(newProduct.farmerId),
        name: newProduct.name,
        quantityKg: Number(newProduct.quantityKg),
        expectedPricePerKg: Number(newProduct.expectedPricePerKg),
        harvestDate: newProduct.harvestDate,
        location: newProduct.location
      })
    });
    setNewProduct({ farmerId: 1, name: '', quantityKg: '', expectedPricePerKg: '', harvestDate: '', location: '' });
    await fetchAll();
  }

  async function addOrder(e) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: Number(newOrder.productId),
        buyerId: Number(newOrder.buyerId),
        quantityKg: Number(newOrder.quantityKg),
        agreedPricePerKg: Number(newOrder.agreedPricePerKg)
      })
    });
    setNewOrder({ productId: '', buyerId: '', quantityKg: '', agreedPricePerKg: '' });
    await fetchAll();
  }

  async function runEstimate(e) {
    e.preventDefault();
    const result = await fetch(`${API_BASE}/api/profit-estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: Number(estimateInput.productId),
        buyerId: Number(estimateInput.buyerId),
        mandiPricePerKg: Number(estimateInput.mandiPricePerKg)
      })
    }).then((r) => r.json());
    setEstimate(result);
  }

  return (
    <div className="container">
      <h1>SIH26033 - Farmer Direct Market Platform</h1>
      <p>
        Compare <span className="badge">Traditional: Farmer → Agent → Wholesaler → Retailer → Consumer</span>{' '}
        vs <span className="badge">Direct: Farmer → Platform → Buyer</span>
      </p>

      <div className="grid">
        <div className="card">
          <h2>Farmer: List Product</h2>
          <form onSubmit={addProduct}>
            <label>Farmer</label>
            <select value={newProduct.farmerId} onChange={(e) => setNewProduct({ ...newProduct, farmerId: e.target.value })}>
              <option value={1}>Ravi Patil (Nashik)</option>
              <option value={2}>Sita Devi (Pune)</option>
            </select>
            <label>Product Name</label>
            <input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <label>Quantity (kg)</label>
            <input required type="number" min="1" value={newProduct.quantityKg} onChange={(e) => setNewProduct({ ...newProduct, quantityKg: e.target.value })} />
            <label>Expected Price (₹/kg)</label>
            <input required type="number" min="0" value={newProduct.expectedPricePerKg} onChange={(e) => setNewProduct({ ...newProduct, expectedPricePerKg: e.target.value })} />
            <label>Harvest Date</label>
            <input required type="date" value={newProduct.harvestDate} onChange={(e) => setNewProduct({ ...newProduct, harvestDate: e.target.value })} />
            <label>Pickup Location</label>
            <input required value={newProduct.location} onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })} />
            <button type="submit">Add Product</button>
          </form>
        </div>

        <div className="card">
          <h2>Buyer: Place Order</h2>
          <form onSubmit={addOrder}>
            <label>Product</label>
            <select required value={newOrder.productId} onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} - {p.quantity_kg} kg @ ₹{p.expected_price_per_kg}/kg</option>
              ))}
            </select>
            <label>Buyer</label>
            <select required value={newOrder.buyerId} onChange={(e) => setNewOrder({ ...newOrder, buyerId: e.target.value })}>
              <option value="">Select Buyer</option>
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
              ))}
            </select>
            <label>Quantity (kg)</label>
            <input required type="number" min="1" value={newOrder.quantityKg} onChange={(e) => setNewOrder({ ...newOrder, quantityKg: e.target.value })} />
            <label>Agreed Price (₹/kg)</label>
            <input required type="number" min="0" value={newOrder.agreedPricePerKg} onChange={(e) => setNewOrder({ ...newOrder, agreedPricePerKg: e.target.value })} />
            <button type="submit">Place Order</button>
          </form>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h2>Smart Profit Estimator (Killer Feature)</h2>
          <form onSubmit={runEstimate}>
            <label>Product</label>
            <select required value={estimateInput.productId} onChange={(e) => setEstimateInput({ ...estimateInput, productId: e.target.value })}>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.farmer_name})</option>
              ))}
            </select>

            <label>Buyer</label>
            <select required value={estimateInput.buyerId} onChange={(e) => setEstimateInput({ ...estimateInput, buyerId: e.target.value })}>
              <option value="">Select Buyer</option>
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
              ))}
            </select>

            <label>Current Local Market Price (₹/kg)</label>
            <input required type="number" min="0" value={estimateInput.mandiPricePerKg} onChange={(e) => setEstimateInput({ ...estimateInput, mandiPricePerKg: e.target.value })} />
            <button type="submit">Calculate Farmer Net Profit</button>
          </form>

          {estimate && !estimate.error && (
            <div>
              <p><strong>If sold via platform:</strong> ₹{estimate.directNetPerKg}/kg net to farmer</p>
              <p><strong>Local market benchmark:</strong> ₹{estimate.traditionalNetPerKg}/kg net</p>
              <p><strong>Estimated transport:</strong> ₹{estimate.transportCostPerKg}/kg ({estimate.distanceKm} km)</p>
              <p><strong>Total direct earning:</strong> ₹{estimate.directTotal}</p>
              <p><strong>Total traditional earning:</strong> ₹{estimate.traditionalTotal}</p>
              <p><strong>Gain/Loss vs traditional:</strong> ₹{estimate.gainVsTraditional}</p>
            </div>
          )}

          {estimate?.error && <p style={{ color: 'red' }}>{estimate.error}</p>}
          {selectedProduct && (
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              Selected crop: {selectedProduct.name}, Quantity: {selectedProduct.quantity_kg} kg, Expected: ₹{selectedProduct.expected_price_per_kg}/kg
            </p>
          )}
        </div>

        <div className="card">
          <h2>Orders & Logistics Tracking</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Price/kg</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.product_name}</td>
                  <td>{o.buyer_name}</td>
                  <td>{o.quantity_kg}</td>
                  <td>₹{o.agreed_price_per_kg}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Live Product Market</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Farmer</th>
              <th>Qty (kg)</th>
              <th>Expected Price/kg</th>
              <th>Harvest Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.farmer_name}</td>
                <td>{p.quantity_kg}</td>
                <td>₹{p.expected_price_per_kg}</td>
                <td>{String(p.harvest_date).slice(0, 10)}</td>
                <td>{p.location}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6">No products listed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
