import { useNavigate } from "react-router-dom";

export const ProductGrid = ({ products = [] }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating > 0 && i <= rating) {
        stars.push(<span key={i}>★</span>);
      } else if (rating > 0 && i - 0.5 <= rating) {
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>★</span>
            <span className="text-light">☆</span>
          </span>
        );
      } else {
        stars.push(<span key={i} className="text-secondary opacity-25">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="row g-4 mt-4 mx-4">
      {products.map((product, i) => (
        <div key={product._id || i} className="col-6 col-lg-3 shadow-sm">
          <div 
            className="card h-100 border-0" 
            style={{ cursor: 'pointer' }} 
            onClick={() => handleClick(product._id)}
          >
            <img
              src={product.image?.[0]}
              alt={product.name}
              className="card-img-top"
              style={{
                height: "320px",
                objectFit: "cover",
              }}
            />

            <div className="card-body px-0">
              <p className="small mb-1 text-muted">
                {product.name}
              </p>

              <div className="fw-bold">
                Rs. {product.sellingPrice}
                <span className="text-muted text-decoration-line-through ms-1 small">
                  {product.mrp}
                </span>
                <span className="text-success ms-1 small">
                  {product.discount}% Off
                </span>
              </div>

              <div className="small text-warning">
                {renderStars(product.rating)}
                <span className="text-muted ms-1">
                  ({product.ratingsCount || 0})
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};