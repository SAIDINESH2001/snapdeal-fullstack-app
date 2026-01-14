export const ProductHeaderSort = ({products}) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 pb-4 border-bottom">
            <div>
              <h4 className="mb-0">Shirts For Men <span className="text-muted fs-6">({products && products.length} Items)</span></h4>
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