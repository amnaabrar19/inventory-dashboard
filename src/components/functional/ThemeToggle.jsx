import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

function ThemeToggle() {
  // useContext lets this component read the theme without any prop drilling.
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button type="button" className="btn btn-ghost" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    </button>
  );
}

export default ThemeToggle;
