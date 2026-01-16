import {useParams} from 'react-router-dom'

export const ProductHeaderSort = ({products}) => {
  const {category} = useParams();
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 pb-4 border-bottom">
            <div>
              <h4 className="mb-0 fs-5 ms-4">{category}<span className="text-muted fs-6 ms-2">({products && products.length} Items)</span></h4>
            </div>

            <div className="d-flex gap-3">
              <input
                className="form-control form-control-sm"
                placeholder="Search within category"
                style={{boxShadow: 'none'}}
              />
              <select className="form-select form-select-sm" style={{boxShadow: 'none'}}>
                <option>Sort by: Popularity</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </div>
        </div>
    )
}