// Reusable container that uses props.children so any content can be placed inside.
function CardWrapper({ title, className = '', children }) {
  return (
    <section className={`card ${className}`}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </section>
  );
}

export default CardWrapper;
