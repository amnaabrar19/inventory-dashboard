import CardWrapper from './CardWrapper';

function InventoryMetrics({ metrics }) {
  const items = [
    { label: 'Products', value: metrics.totalProducts },
    { label: 'Units in stock', value: metrics.totalUnits },
    { label: 'Inventory value', value: `$${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: 'Low stock', value: metrics.lowStock, warn: metrics.lowStock > 0 },
    { label: 'Out of stock', value: metrics.outOfStock, danger: metrics.outOfStock > 0 },
  ];

  return (
    <div className="metrics">
      {items.map((item) => (
        <CardWrapper key={item.label} className="metric">
          <span className="metric-label">{item.label}</span>
          <span className={`metric-value ${item.danger ? 'is-danger' : ''} ${item.warn ? 'is-warn' : ''}`}>
            {item.value}
          </span>
        </CardWrapper>
      ))}
    </div>
  );
}

export default InventoryMetrics;
