export const BrandFilter = ({ brandSearch, onSearchChange, availableBrands, selectedBrands, onToggle }) => (
  <>
    <div className="input-group input-group-sm mb-2 border-bottom">
      <input
        type="text"
        className="form-control border-0 shadow-none px-0"
        placeholder="Search by Brand"
        value={brandSearch}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ fontSize: "12px" }}
      />
      <span className="input-group-text bg-white border-0">
        <span className="material-symbols-outlined text-muted" style={{ fontSize: "16px" }}>search</span>
      </span>
    </div>
    <div className="filter-scroll" style={{ maxHeight: "200px", overflowY: "auto" }}>
      {availableBrands
        .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
        .map((brand) => (
          <div key={brand.name} className="form-check small d-flex align-items-center mb-1">
            <input
              className="form-check-input rounded-0 me-2 border shadow-none"
              type="checkbox"
              checked={selectedBrands.includes(brand.name)}
              onChange={() => onToggle(brand.name)}
            />
            <label
              className="form-check-label text-muted flex-grow-1"
              style={{ cursor: "pointer" }}
              onClick={() => onToggle(brand.name)}
            >
              {brand.name}
            </label>
            <span className="text-muted small ms-2">{brand.count}</span>
          </div>
        ))}
    </div>
  </>
);