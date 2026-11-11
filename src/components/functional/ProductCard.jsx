import { memo } from 'react';
import CardWrapper from './CardWrapper';
import { getStockStatus } from '../../utils/stock';

// memo + useCallback handlers in App mean a card only re-renders when its own product changes.
function ProductCard({ product, onStockChange, onDelete }) {
  const status = getStockStatus(product.quantity);
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <CardWrapper className="product-card">
      <div className="product-top">
        <div>
          <h3 className="product-title">{product.title}</h3>
          <p className="muted">{product.category}</p>
        </div>
        <span className={`badge badge-${statusClass}`}>{status}</span>
      </div>

      <div className="product-meta">
        <span>${product.price.toFixed(2)}</span>
        <span>
          {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
        </span>
      </div>

      {status === 'Low Stock' && <p className="hint hint-warn">Reorder soon: only {product.quantity} left.</p>}
      {status === 'Out of Stock' && <p className="hint hint-danger">Unavailable until restocked.</p>}

      <div className="product-actions">
        <button type="button" className="btn btn-small" onClick={() => onStockChange(product, -1)} disabled={product.quantity === 0} aria-label={`Remove one ${product.title}`}>
          -1
        </button>
        <button type="button" className="btn btn-small" onClick={() => onStockChange(product, 1)} aria-label={`Add one ${product.title}`}>
          +1
        </button>
        <button type="button" className="btn btn-small" onClick={() => onStockChange(product, 10)} aria-label={`Add ten ${product.title}`}>
          +10
        </button>
        <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(product)}>
          Delete
        </button>
      </div>
    </CardWrapper>
  );
}

export default memo(ProductCard);
