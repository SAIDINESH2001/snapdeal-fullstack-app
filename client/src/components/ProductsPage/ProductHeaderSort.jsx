import { useParams, useLocation } from 'react-router-dom';

export const ProductHeaderSort = ({ products, onSortChange }) => {
  const { mainCategory, subCategory, category, keyword } = useParams();
  const { pathname } = useLocation();

  const getDisplayName = () => {
    if (pathname.includes('/trending/')) {
      return decodeURIComponent(keyword);
    }

    const currentCategory = category !== "all" ? category : null;
    const currentSubCategory = subCategory !== "all" ? subCategory : null;

    const displayName = currentCategory || currentSubCategory || mainCategory || "Search Results";
    
    return decodeURIComponent(displayName);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 pb-4 border-bottom">
      <div>
        <h4 className="mb-0 fs-5 ms-4 text-capitalize">
          {getDisplayName()}
          <span className="text-muted fs-6 ms-2">
            ({products ? products.length : 0} Items)
          </span>
        </h4>
      </div>

      <div className="me-3">
        <select 
          className="form-select form-select-sm" 
          style={{ boxShadow: 'none' }}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="popularity">Sort by: Popularity</option>
          <option value="lowToHigh">Price Low to High</option>
          <option value="highToLow">Price High to Low</option>
        </select>
      </div>
    </div>
  );
};