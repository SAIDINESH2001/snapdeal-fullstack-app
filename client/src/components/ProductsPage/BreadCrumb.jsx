export const BreadcrumbAndTrending = () => {
  const trends = [
    "kitchen product",
    "shoes for men",
    "kurti set",
    "sandal men",
    "sport shoe men",
    "saree",
    "tshirt",
    "wall stickers",
  ];

  return (
    <div className="border-top">
      <div className="container-fluid px-5 py-3">
        <div className="mb-3 text-muted small">
          Home <span className="mx-1">/</span> Men’s Clothing{" "}
          <span className="mx-1">/</span>
          <span className="text-dark">Shirts For Men</span>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="text-muted d-flex align-items-center me-2">
            <span className="me-1">📈</span>
            <span>Trending searches:</span>
          </div>

          {trends.map((item) => (
            <button
              key={item}
              className="btn btn-outline-secondary btn-sm rounded px-3"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
