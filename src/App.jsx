import { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/functional/Header';
import InventoryMetrics from './components/functional/InventoryMetrics';
import ProductForm from './components/functional/ProductForm';
import ProductList from './components/functional/ProductList';
import AuditLogger from './components/class/AuditLogger';
import useDebounce from './hooks/useDebounce';
import { CATEGORIES, STATUSES, SEED_PRODUCTS, getStockStatus } from './utils/stock';

const PRODUCTS_KEY = 'inventory_products';

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // fall through to seed data
  }
  return SEED_PRODUCTS;
}

function Dashboard() {
  const [products, setProducts] = useState(loadProducts);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [latestEvent, setLatestEvent] = useState(null);

  const debouncedSearch = useDebounce(search, 250);

  // Keep localStorage in sync with the inventory.
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  // Document title reflects the number of products that are available.
  const activeCount = useMemo(() => products.filter((p) => p.quantity > 0).length, [products]);
  useEffect(() => {
    document.title = `Inventory (${activeCount} active ${activeCount === 1 ? 'product' : 'products'})`;
  }, [activeCount]);

  const logEvent = useCallback((type, message) => {
    setLatestEvent({ id: newId(), type, message });
  }, []);

  const handleAddProduct = useCallback(
    (data) => {
      setProducts((prev) => [{ id: newId(), ...data }, ...prev]);
      logEvent('ADDED', `Added "${data.title}" (${data.quantity} units)`);
    },
    [logEvent]
  );

  const handleStockChange = useCallback(
    (product, delta) => {
      const next = Math.max(0, product.quantity + delta);
      if (next === product.quantity) return;
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, quantity: next } : p)));
      logEvent('STOCK', `"${product.title}" stock ${product.quantity} to ${next}`);
    },
    [logEvent]
  );

  const handleDelete = useCallback(
    (product) => {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      logEvent('DELETED', `Deleted "${product.title}"`);
    },
    [logEvent]
  );

  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = term === '' || p.title.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || getStockStatus(p.quantity) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  const metrics = useMemo(
    () => ({
      totalProducts: products.length,
      totalUnits: products.reduce((sum, p) => sum + p.quantity, 0),
      totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
      lowStock: products.filter((p) => getStockStatus(p.quantity) === 'Low Stock').length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
    }),
    [products]
  );

  return (
    <div className="app">
      <Header activeCount={activeCount} totalCount={products.length} />

      <InventoryMetrics metrics={metrics} />

      <main className="layout">
        <aside className="sidebar">
          <ProductForm categories={CATEGORIES} onAddProduct={handleAddProduct} />
          <AuditLogger latestEvent={latestEvent} />
        </aside>

        <section className="content">
          <div className="filters">
            <label>
              Search
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" />
            </label>
            <label>
              Category
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stock status
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ProductList
            products={filteredProducts}
            hasAnyProducts={products.length > 0}
            onStockChange={handleStockChange}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
