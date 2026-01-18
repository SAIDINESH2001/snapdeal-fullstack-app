import { useParams } from 'react-router-dom';

export const ProductHeaderSort = ({ products, onSortChange }) => {
  const { category } = useParams();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 pb-4 border-bottom">
      <div>
        <h4 className="mb-0 fs-5 ms-4">
          {category || "Search Results"}
          <span className="text-muted fs-6 ms-2">
            ({products && products.length} Items)
          </span>
        </h4>
      </div>

      <div className="d-flex gap-3">
        <input
          className="form-control form-control-sm"
          placeholder="Search within category"
          style={{ boxShadow: 'none' }}
        />
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