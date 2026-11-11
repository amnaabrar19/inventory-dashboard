export const LOW_STOCK_THRESHOLD = 5;

export const CATEGORIES = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports'];

export const STATUSES = ['In Stock', 'Low Stock', 'Out of Stock'];

// Single source of truth for the stock badge and the status filter.
export function getStockStatus(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'In Stock';
}

export const SEED_PRODUCTS = [
  { id: 'seed-1', title: 'Wireless Mouse', category: 'Electronics', price: 24.99, quantity: 42 },
  { id: 'seed-2', title: 'Mechanical Keyboard', category: 'Electronics', price: 79.5, quantity: 4 },
  { id: 'seed-3', title: 'Cotton Hoodie', category: 'Clothing', price: 39, quantity: 18 },
  { id: 'seed-4', title: 'Ceramic Mug Set', category: 'Home & Kitchen', price: 21.75, quantity: 0 },
  { id: 'seed-5', title: 'JavaScript: The Good Parts', category: 'Books', price: 18.2, quantity: 11 },
  { id: 'seed-6', title: 'Yoga Mat', category: 'Sports', price: 27, quantity: 3 },
];
