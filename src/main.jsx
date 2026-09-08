import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowUpRight, BadgeCheck, Bell, CalendarDays, ChevronDown,
  CircleHelp, Clock3, CloudSun, Coins, Ellipsis, Filter, IndianRupee, LayoutDashboard,
  Leaf, ListFilter, LocateFixed, MapPin, Menu, MessageCircle, PackageCheck,
  Plus, Search, Settings, ShieldCheck, ShoppingBasket, Sparkles, Truck, Users,
  X,
} from 'lucide-react';
import './styles.css';

const initialListings = [
  { id: 1, crop: 'Tomatoes', variety: 'Hybrid • Grade A', farmer: 'Lakshmi Narayan', village: 'Mandya', distance: 42, quantity: 850, unit: 'kg', price: 28, market: 34, harvest: '18 Sep 2024', color: 'tomato', emoji: '🍅', status: 'Live' },
  { id: 2, crop: 'Ragi', variety: 'Organic • Cleaned', farmer: 'Ramesh Gowda', village: 'Mysuru', distance: 138, quantity: 1200, unit: 'kg', price: 62, market: 74, harvest: '22 Sep 2024', color: 'ragi', emoji: '🌾', status: 'Live' },
  { id: 3, crop: 'Alphonso Mangoes', variety: 'Premium • A2', farmer: 'Savitha Prasad', village: 'Kolar', distance: 58, quantity: 400, unit: 'kg', price: 115, market: 146, harvest: '26 Sep 2024', color: 'mango', emoji: '🥭', status: 'Live' },
  { id: 4, crop: 'Coriander', variety: 'Fresh bunches', farmer: 'Kiran S.', village: 'Chikkaballapur', distance: 66, quantity: 300, unit: 'kg', price: 42, market: 51, harvest: '17 Sep 2024', color: 'green', emoji: '🌿', status: 'Live' },
];

const initialOrders = [
  { id: 'DF-1048', crop: 'Ragi', qty: 200, buyer: 'Green Basket Foods', farmer: 'Ramesh Gowda', total: 12400, status: 'Accepted', date: 'Today', route: 'Mysuru → Bengaluru', progress: 28 },
  { id: 'DF-1039', crop: 'Tomatoes', qty: 100, buyer: 'FreshCart Kitchens', farmer: 'Lakshmi Narayan', total: 2800, status: 'In Transit', date: 'Yesterday', route: 'Mandya → Bengaluru', progress: 72 },
];

const navItems = [
  ['overview', 'Overview', LayoutDashboard],
  ['marketplace', 'Marketplace', ShoppingBasket],
  ['my-listings', 'My listings', Leaf],
  ['orders', 'Orders & logistics', Truck],
  ['transparency', 'Price transparency', Coins],
  ['admin', 'Admin dashboard', Users],
];

function App() {
  const [role, setRole] = useState('buyer');
  const [active, setActive] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listings, setListings] = useState(initialListings);
  const [orders, setOrders] = useState(initialOrders);
  const [offerListing, setOfferListing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All crops');

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const visibleListings = useMemo(() => listings.filter(item =>
    (filter === 'All crops' || item.crop === filter) &&
    `${item.crop} ${item.variety} ${item.village}`.toLowerCase().includes(search.toLowerCase())
  ), [listings, search, filter]);

  const acceptOffer = () => {
    setOfferListing(null);
    setOrders([{
      id: 'DF-1052', crop: 'Tomatoes', qty: 150, buyer: 'You', farmer: 'Lakshmi Narayan',
      total: 4200, status: 'Accepted', date: 'Just now', route: 'Mandya → Bengaluru', progress: 18,
    }, ...orders]);
    notify('Offer accepted — order DF-1052 is ready for pickup');
    setActive('orders');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Leaf size={18} fill="currentColor" /></div><span>direct<span>farm</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(([id, label, Icon]) => (
            <button className={`nav-item ${active === id ? 'active' : ''}`} key={id} onClick={() => { setActive(id); setMobileOpen(false); }}>
              <Icon size={18} /><span>{label}</span>{id === 'orders' && <b className="nav-badge">2</b>}
            </button>
          ))}
          <button className="nav-item" onClick={() => notify('Analytics are being prepared for your account')}><Sparkles size={18} /><span>Smart matching</span><span className="pro-pill">BETA</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="weather"><CloudSun size={20} /><div><strong>28° clear</strong><small>Bengaluru, Karnataka</small></div></div>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
          <button className="profile-mini"><div className="avatar avatar-gold">AK</div><div><strong>Arjun Kumar</strong><small>{role === 'buyer' ? 'Buyer account' : 'Farmer account'}</small></div><ChevronDown size={15} /></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{navItems.find(n => n[0] === active)?.[1] || 'Overview'}</strong></div>
          <div className="top-actions">
            <div className="role-switch"><button className={role === 'buyer' ? 'selected' : ''} onClick={() => setRole('buyer')}>Buyer</button><button className={role === 'farmer' ? 'selected' : ''} onClick={() => setRole('farmer')}>Farmer</button></div>
            <button className="icon-btn"><CircleHelp size={18} /></button><button className="icon-btn notification"><Bell size={18} /><i /></button>
          </div>
        </header>

        <div className="page-content">
          {active === 'overview' && <Overview role={role} orders={orders} listings={listings} onNavigate={setActive} onAdd={() => setShowAdd(true)} />}
          {active === 'marketplace' && <Marketplace listings={visibleListings} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onOffer={setOfferListing} />}
          {active === 'my-listings' && <MyListings listings={listings} onAdd={() => setShowAdd(true)} notify={notify} />}
          {active === 'orders' && <Orders orders={orders} setOrders={setOrders} notify={notify} />}
          {active === 'transparency' && <Transparency />}
          {active === 'admin' && <Admin listings={listings} orders={orders} />}
        </div>
      </main>
      {offerListing && <OfferModal listing={offerListing} onClose={() => setOfferListing(null)} onSubmit={acceptOffer} notify={notify} />}
      {showAdd && <AddListing onClose={() => setShowAdd(false)} onAdd={(item) => { setListings([item, ...listings]); setShowAdd(false); notify('Your produce is now live in the marketplace'); }} />}
      {toast && <div className="toast"><BadgeCheck size={18} />{toast}</div>}
    </div>
  );
}

function Overview({ role, orders, listings, onNavigate, onAdd }) {
  return <div className="fade-in">
    <div className="welcome-row"><div><p className="eyebrow">TUESDAY, 17 SEPTEMBER 2024</p><h1>Good morning, Arjun <span>✦</span></h1><p className="subheading">Here’s what’s happening across your farm network.</p></div><button className="primary-btn" onClick={role === 'farmer' ? onAdd : () => onNavigate('marketplace')}><Plus size={17} />{role === 'farmer' ? 'List produce' : 'Find produce'}</button></div>
    <div className="stat-grid">
      <Stat title="Active listings" value={listings.length} detail="+2 this week" trend="up" icon={Leaf} />
      <Stat title="Orders in progress" value={orders.length} detail="₹ 17,200 total value" icon={PackageCheck} />
      <Stat title="You’ve saved" value="₹ 4,860" detail="vs. traditional trade" trend="up" icon={Coins} />
      <Stat title="Network reach" value="148 km" detail="Across 12 farmers" icon={LocateFixed} />
    </div>
    <div className="section-heading"><div><h2>Active orders</h2><p>Track your produce from offer to doorstep.</p></div><button className="text-btn" onClick={() => onNavigate('orders')}>View all orders <ArrowUpRight size={15} /></button></div>
    <div className="order-grid">{orders.slice(0, 2).map(order => <OrderCard key={order.id} order={order} />)}</div>
    <div className="lower-grid">
      <div className="panel market-panel"><div className="panel-heading"><div><h2>Today’s market pulse</h2><p>Live reference prices across Karnataka</p></div><span className="live-dot">Live</span></div><div className="pulse-chart"><div className="chart-label"><strong>Tomatoes</strong><span>₹ 34/kg <em>+8.2%</em></span></div><div className="bars tomato-bars">{[35, 48, 42, 60, 48, 73, 65, 87, 77, 96, 82, 100].map((h,i)=><i style={{height:`${h}%`}} key={i} />)}</div><div className="chart-axis"><span>10 Sep</span><span>Today</span></div></div><div className="market-row"><span>Ragi <small>Mandya</small></span><strong>₹ 74/kg <em>+3.4%</em></strong></div><div className="market-row"><span>Mangoes <small>Kolar</small></span><strong>₹ 146/kg <em className="down">-2.1%</em></strong></div></div>
      <div className="panel match-panel"><div className="panel-heading"><div><h2>Smart matches</h2><p>Buyers looking for your produce</p></div><Sparkles size={19} className="sparkle" /></div><div className="match-person"><div className="avatar avatar-blue">GB</div><div><strong>Green Basket Foods</strong><small>Needs 200 kg of Ragi</small></div><span>98%</span></div><div className="match-person"><div className="avatar avatar-purple">FC</div><div><strong>FreshCart Kitchens</strong><small>Needs 100 kg of Tomatoes</small></div><span>91%</span></div><button className="outline-btn full" onClick={() => onNavigate('marketplace')}>Explore matches <ArrowUpRight size={15} /></button></div>
    </div>
  </div>;
}

function Stat({ title, value, detail, trend, icon: Icon }) { return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className="stat-icon"><Icon size={16} /></div></div><strong className="stat-value">{value}</strong><div className="stat-detail">{trend && <ArrowUpRight size={14} />} {detail}</div></div>; }

function Marketplace({ listings, search, setSearch, filter, setFilter, onOffer }) {
  return <div className="fade-in"><div className="page-title"><div><p className="eyebrow">DIRECT MARKETPLACE</p><h1>Fresh from the source</h1><p className="subheading">Browse produce directly from verified farmers around Bengaluru.</p></div><div className="location-pill"><MapPin size={15} /> Within 150 km <ChevronDown size={14} /></div></div>
    <div className="market-toolbar"><div className="search-box"><Search size={17} /><input placeholder="Search crops, varieties or locations..." value={search} onChange={e => setSearch(e.target.value)} /></div><select value={filter} onChange={e => setFilter(e.target.value)}><option>All crops</option><option>Tomatoes</option><option>Ragi</option><option>Alphonso Mangoes</option><option>Coriander</option></select><button className="filter-btn"><Filter size={16} /> Filters <span>2</span></button></div>
    <div className="market-meta"><span><strong>{listings.length * 4 + 7}</strong> results near you</span><button className="sort-btn">Sort: Recommended <ChevronDown size={14} /></button></div>
    <div className="listing-grid">{listings.map(item => <ListingCard key={item.id} listing={item} onOffer={() => onOffer(item)} />)}</div>
  </div>;
}

function ListingCard({ listing, onOffer }) { return <div className="listing-card"><div className={`produce-image ${listing.color}`}><span>{listing.emoji}</span><small><BadgeCheck size={12} /> Verified farm</small></div><div className="listing-body"><div className="listing-heading"><div><h3>{listing.crop}</h3><p>{listing.variety}</p></div><button className="more-btn"><Ellipsis size={18} /></button></div><div className="farmer-line"><div className="avatar avatar-small avatar-green">{listing.farmer.split(' ').map(x => x[0]).slice(0,2).join('')}</div><span>{listing.farmer}<small><MapPin size={11} /> {listing.village} · {listing.distance} km</small></span></div><div className="listing-details"><div><small>Available</small><strong>{listing.quantity.toLocaleString()} {listing.unit}</strong></div><div><small>Harvest date</small><strong>{listing.harvest}</strong></div></div><div className="price-line"><div><small>Direct price</small><strong><IndianRupee size={16} />{listing.price}<span>/kg</span></strong></div><span className="save-tag">Save ₹{listing.market - listing.price}/kg</span><button className="offer-btn" onClick={onOffer}>Make offer</button></div></div></div>; }

function MyListings({ listings, onAdd, notify }) { return <div className="fade-in"><div className="page-title"><div><p className="eyebrow">FARMER WORKSPACE</p><h1>My listings</h1><p className="subheading">Manage what you’re growing and earning.</p></div><button className="primary-btn" onClick={onAdd}><Plus size={17} /> List new produce</button></div><div className="panel table-panel"><div className="table-heading"><div><h2>Live produce</h2><p>All your active marketplace listings</p></div><button className="filter-btn"><ListFilter size={16} /> Filter</button></div><div className="listing-table"><div className="tr th"><span>Produce</span><span>Availability</span><span>Price / kg</span><span>Interest</span><span>Status</span><span /></div>{listings.map((l, i) => <div className="tr" key={l.id}><span className="table-produce"><span className={`mini-produce ${l.color}`}>{l.emoji}</span><strong>{l.crop}<small>{l.variety}</small></strong></span><span>{l.quantity.toLocaleString()} kg<small>Harvest {l.harvest}</small></span><span><strong>₹{l.price}</strong><small>Market ₹{l.market}</small></span><span><strong>{[12, 8, 5, 3][i] || 2} buyers</strong><small>Last viewed 2h ago</small></span><span><b className="status-pill green-pill"><i /> Live</b></span><span><button className="more-btn" onClick={() => notify('Listing actions are available in the next release')}><Ellipsis size={18} /></button></span></div>)}</div></div></div>; }

function Orders({ orders, setOrders, notify }) { const progress = ['Accepted', 'Pickup', 'In Transit', 'Delivered']; return <div className="fade-in"><div className="page-title"><div><p className="eyebrow">FULFILMENT CENTER</p><h1>Orders & logistics</h1><p className="subheading">Every delivery, one clear view.</p></div><button className="outline-btn"><DownloadIcon /> Export orders</button></div><div className="order-tabs"><button className="active">All orders <span>{orders.length}</span></button><button>Awaiting action <span>1</span></button><button>Completed</button></div><div className="orders-list">{orders.map(order => <div className="order-detail-card" key={order.id}><div className="order-detail-top"><div className="order-id"><span className="mini-produce tomato">🍅</span><div><strong>{order.crop} <span>× {order.qty} kg</span></strong><small>{order.id} · Placed {order.date}</small></div></div><b className={`status-pill ${order.status === 'In Transit' ? 'blue-pill' : 'amber-pill'}`}><i /> {order.status}</b></div><div className="order-route"><div className="route-line"><MapPin size={16} /><span>{order.route.split(' → ')[0]}</span><div className="route-bar"><i style={{ width: `${order.progress}%` }} /></div><Truck size={17} /><span>{order.route.split(' → ')[1]}</span></div><div className="route-info"><span><CalendarDays size={14} /> Est. delivery: <strong>{order.status === 'In Transit' ? 'Tomorrow, 10:30 AM' : '20 Sep, 2:00 PM'}</strong></span><span><IndianRupee size={14} /> Order value: <strong>₹{order.total.toLocaleString()}</strong></span></div></div><div className="order-bottom"><span>Buyer: <strong>{order.buyer}</strong></span><span>Farmer: <strong>{order.farmer}</strong></span><button className="text-btn" onClick={() => { const next = progress[(progress.indexOf(order.status) + 1) % progress.length]; setOrders(orders.map(o => o.id === order.id ? {...o, status: next, progress: Math.min(100, order.progress + 28)} : o)); notify(`Order ${order.id} moved to ${next}`); }}>Update status <ArrowUpRight size={14} /></button></div></div>)}</div></div>; }

function DownloadIcon() { return <ArrowDownRight size={16} />; }

function OrderCard({ order }) { return <div className="order-card"><div className="order-card-top"><div className="order-icon"><Truck size={19} /></div><div><strong>{order.crop} <span>× {order.qty} kg</span></strong><small>{order.id} · {order.route}</small></div><b className={`status-pill ${order.status === 'In Transit' ? 'blue-pill' : 'amber-pill'}`}><i /> {order.status}</b></div><div className="steps">{['Offer', 'Accepted', 'Pickup', 'In Transit', 'Delivered'].map((step, i) => <div className={`step ${i < (order.status === 'In Transit' ? 4 : 2) ? 'done' : ''} ${step === order.status ? 'current' : ''}`} key={step}><i>{i < (order.status === 'In Transit' ? 4 : 2) ? '✓' : i + 1}</i><span>{step}</span></div>)}</div><div className="order-card-foot"><span><Clock3 size={14} /> Updated 2 hours ago</span><strong>₹{order.total.toLocaleString()}</strong></div></div>; }

function Transparency() { return <div className="fade-in"><div className="page-title"><div><p className="eyebrow">THE DIRECTFARM DIFFERENCE</p><h1>Price transparency</h1><p className="subheading">See where every rupee goes — and what you keep.</p></div><div className="period-pill">Last 30 days <ChevronDown size={14} /></div></div><div className="hero-saving"><div><span className="saving-icon"><Coins size={23} /></span><p>Total saved by your network</p><h2>₹2,84,600</h2><span className="saving-trend"><ArrowUpRight size={14} /> 18.6% vs. last month</span></div><div className="saving-quote">“When the chain gets shorter,<br /><strong>the value gets fairer.</strong>”</div></div><div className="compare-grid"><div className="panel compare-panel"><div className="panel-heading"><div><h2>Tomatoes · 100 kg</h2><p>Mandya → Bengaluru</p></div><span className="verified-label"><ShieldCheck size={15} /> Verified data</span></div><div className="compare-bars"><div className="compare-row"><span>Traditional chain</span><strong>₹2,800 <small>to farmer</small></strong><div className="compare-track"><i className="traditional" /></div></div><div className="compare-row"><span>DirectFarm</span><strong>₹3,400 <small>to farmer</small></strong><div className="compare-track"><i className="direct" /></div></div></div><div className="compare-result"><span><ArrowUpRight size={16} /> Farmer earns <strong>21% more</strong></span><span>Buyer saves <strong>₹600</strong></span></div></div><div className="panel breakdown-panel"><div className="panel-heading"><div><h2>Where your money goes</h2><p>Every ₹100 paid by the buyer</p></div></div><div className="donut-wrap"><div className="donut"><div><strong>₹100</strong><small>buyer pays</small></div></div><div className="legend"><span><i className="legend-farmer" />Farmer <strong>₹72</strong></span><span><i className="legend-logistics" />Logistics <strong>₹12</strong></span><span><i className="legend-platform" />DirectFarm <strong>₹6</strong></span><span><i className="legend-chain" />Avoided chain cost <strong>₹10</strong></span></div></div></div></div><div className="impact-row"><div><BadgeCheck size={20} /><span><strong>1,240</strong> farmers paid fairly</span></div><div><Leaf size={20} /><span><strong>36 tonnes</strong> sourced direct</span></div><div><Truck size={20} /><span><strong>₹18.4L</strong> value retained locally</span></div></div></div>; }

function Admin({ listings, orders }) { return <div className="fade-in"><div className="page-title"><div><p className="eyebrow">OPERATIONS CONSOLE</p><h1>Admin dashboard</h1><p className="subheading">Monitor the DirectFarm network at a glance.</p></div><span className="verified-label"><ShieldCheck size={15} /> System healthy</span></div><div className="stat-grid"><Stat title="Registered users" value="2,486" detail="+12.4% this month" trend="up" icon={Users} /><Stat title="Active listings" value={listings.length + 184} detail="Across 8 districts" icon={Leaf} /><Stat title="Orders this month" value="642" detail="94% fulfilled on time" trend="up" icon={PackageCheck} /><Stat title="GMV processed" value="₹18.4L" detail="+21.8% vs. last month" trend="up" icon={Coins} /></div><div className="lower-grid"><div className="panel table-panel"><div className="table-heading"><div><h2>Recent users</h2><p>Latest accounts on the platform</p></div><button className="text-btn">View all <ArrowUpRight size={14} /></button></div><div className="listing-table"><div className="tr th"><span>User</span><span>Type</span><span>Location</span><span>Joined</span></div>{[['Lakshmi Narayan','Farmer','Mandya','Today'],['Green Basket Foods','Buyer','Bengaluru','Yesterday'],['Savitha Prasad','Farmer','Kolar','16 Sep']].map((user, i) => <div className="tr admin-user" key={user[0]}><span className="table-produce"><span className={`avatar avatar-small ${i === 1 ? 'avatar-blue' : 'avatar-green'}`}>{user[0].split(' ').map(x => x[0]).slice(0,2).join('')}</span><strong>{user[0]}<small>Verified account</small></strong></span><span>{user[1]}</span><span>{user[2]}</span><span>{user[3]}</span></div>)}</div></div><div className="panel match-panel"><div className="panel-heading"><div><h2>Platform activity</h2><p>Live network health</p></div><span className="live-dot">Live</span></div><div className="market-row"><span>Open offers</span><strong>38</strong></div><div className="market-row"><span>In transit <small>today</small></span><strong>{orders.filter(o => o.status === 'In Transit').length + 14}</strong></div><div className="market-row"><span>Disputes resolved</span><strong>98.2%</strong></div><div className="market-row"><span>Avg. match time</span><strong>4.6 min</strong></div></div></div></div>; }

function OfferModal({ listing, onClose, onSubmit, notify }) { const [qty, setQty] = useState(150); const [price, setPrice] = useState(listing.price); return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><p className="eyebrow">MAKE AN OFFER</p><h2>{listing.crop} from {listing.farmer}</h2><p className="modal-sub">You’re making a direct offer. The farmer will respond within 24 hours.</p><div className="offer-summary"><span className={`mini-produce ${listing.color}`}>{listing.emoji}</span><div><strong>{listing.variety}</strong><small><MapPin size={12} /> {listing.village} · {listing.distance} km away</small></div><span className="offer-market">Market ref.<strong>₹{listing.market}/kg</strong></span></div><div className="form-row"><label>Quantity (kg)<input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" max={listing.quantity} /></label><label>Your price / kg<input type="number" value={price} onChange={e => setPrice(e.target.value)} /></label></div><div className="logistics-note"><Truck size={17} /><span><strong>Estimated logistics</strong><small>{listing.distance} km · ₹{Math.round(listing.distance * 11).toLocaleString()} transport cost</small></span><span className="estimate-total">₹{(qty * 11 + qty * price).toLocaleString()}<small>estimated total</small></span></div><button className="primary-btn full" onClick={() => { onSubmit(); notify(`Offer of ₹${price}/kg sent to ${listing.farmer}`); }}>Send offer <ArrowUpRight size={16} /></button></div></div>; }

function AddListing({ onClose, onAdd }) { const [crop, setCrop] = useState(''); const [price, setPrice] = useState(''); const [quantity, setQuantity] = useState(''); return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><p className="eyebrow">NEW MARKETPLACE LISTING</p><h2>List your produce</h2><p className="modal-sub">Reach verified buyers across Bengaluru and Karnataka.</p><div className="form-grid"><label>Crop name<input placeholder="e.g. Tomatoes" value={crop} onChange={e => setCrop(e.target.value)} /></label><label>Variety / quality<select><option>Grade A • Premium</option><option>Organic • Certified</option><option>Standard grade</option></select></label><label>Available quantity (kg)<input type="number" placeholder="e.g. 500" value={quantity} onChange={e => setQuantity(e.target.value)} /></label><label>Your price / kg<input type="number" placeholder="e.g. 28" value={price} onChange={e => setPrice(e.target.value)} /></label><label>Harvest date<input type="date" defaultValue="2024-09-22" /></label><label>Pickup location<input placeholder="e.g. Mandya" defaultValue="Mandya" /></label></div><div className="recommendation"><Sparkles size={17} /><span><strong>Smart recommendation</strong><small>Based on current Mandya demand, a fair price is <b>₹30–34/kg</b></small></span></div><button className="primary-btn full" disabled={!crop || !price || !quantity} onClick={() => onAdd({ id: Date.now(), crop, variety: 'Grade A • Premium', farmer: 'Arjun Kumar', village: 'Mandya', distance: 44, quantity: Number(quantity), unit: 'kg', price: Number(price), market: Number(price) + 6, harvest: '22 Sep 2024', color: 'green', emoji: '🌱', status: 'Live' })}>Publish listing <ArrowUpRight size={16} /></button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
