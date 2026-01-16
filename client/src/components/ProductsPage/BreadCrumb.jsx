import { useNavigate, useParams } from "react-router-dom";

export const BreadcrumbAndTrending = () => {
  const trends = [
    "Shirts",
    "Wallets",
    "Jackets",
    "Wall Decor",
    "Jeans",
    "Sarees",
    "T-Shirts",
    "Sneakers",
  ];
  const {mainCategory, subCategory, category} = useParams();
  const navigate = useNavigate();

  return (
    <div className="border-top">
      <div className="container-fluid px-5 py-3">
        <div className="mb-3 text-muted medium">
          Home /
          {(mainCategory && <span className="mx-1">{mainCategory} /</span>)}
          {(subCategory && <span className={category? "" :"text-dark"}>{subCategory} /</span>)}
          {category && <span className="mx-1 text-dark"> {category}</span>}
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
              onClick={() => navigate(`/products/${item}`)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
