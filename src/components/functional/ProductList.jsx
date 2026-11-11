import ProductCard from './ProductCard';

function ProductList({ products, hasAnyProducts, onStockChange, onDelete }) {
  // Two different empty states: no inventory at all vs. no match for the current filters.
  if (products.length === 0) {
    return (
      <div className="empty">
        {hasAnyProducts ? (
          <>
            <h3>No products match these filters</h3>
            <p className="muted">Clear the search or change the category and status filters.</p>
          </>
        ) : (
          <>
            <h3>Your inventory is empty</h3>
            <p className="muted">Add your first product using the form.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onStockChange={onStockChange} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default ProductList;
