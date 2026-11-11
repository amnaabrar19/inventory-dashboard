import { useState, useRef, useEffect } from 'react';
import CardWrapper from './CardWrapper';

const EMPTY_FORM = { title: '', price: '', quantity: '' };

function ProductForm({ categories, onAddProduct }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, category: categories[0] });
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  // Focus the title field as soon as the form mounts.
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!title) {
      setError('Enter a product title.');
      titleRef.current.focus();
      return;
    }
    if (form.price === '' || Number.isNaN(price) || price < 0) {
      setError('Enter a price of 0 or more.');
      return;
    }
    if (form.quantity === '' || !Number.isInteger(quantity) || quantity < 0) {
      setError('Enter a whole-number quantity of 0 or more.');
      return;
    }

    onAddProduct({ title, category: form.category, price, quantity });
    setForm({ ...EMPTY_FORM, category: form.category });
    setError('');
    titleRef.current.focus(); // back to the title field, ready for the next product
  };

  return (
    <CardWrapper title="Add a product">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>
          Title
          <input ref={titleRef} name="title" type="text" value={form.title} onChange={handleChange} placeholder="e.g. USB-C Cable" />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="form-row">
          <label>
            Price ($)
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} />
          </label>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary">
          Add product
        </button>
      </form>
    </CardWrapper>
  );
}

export default ProductForm;
