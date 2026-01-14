export const ProductGrid = ({ products = [] }) => {
  return (
    <div className="row g-4 mt-4 mx-4">
      {products.map((product, i) => (
        <div key={product._id || i} className="col-6 col-md-4 col-lg-3">
          <div className="card h-100 border-0">
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
                <span className="text-muted text-decoration-line-through ms-1">
                  {product.mrp}
                </span>
                <span className="text-success ms-1">
                  {product.discount}% Off
                </span>
              </div>

              <div className="small text-warning">
                ★★★★☆
                <span className="text-muted ms-1">
                  ({product.ratingsCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
