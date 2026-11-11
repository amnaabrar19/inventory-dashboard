import ThemeToggle from './ThemeToggle';

function Header({ activeCount, totalCount }) {
  return (
    <header className="header">
      <div>
        <h1>Inventory &amp; Stock Dashboard</h1>
        <p className="muted">
          {activeCount} of {totalCount} {totalCount === 1 ? 'product' : 'products'} currently available
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}

export default Header;
