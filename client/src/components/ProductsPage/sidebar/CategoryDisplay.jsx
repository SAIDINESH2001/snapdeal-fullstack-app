export const CategoryDisplay = ({ mainCategory, category, totalCount }) => (
  <div className="mb-4 pb-2 border-bottom">
    <h6 className="fw-bold mb-3" style={{ fontSize: "14px" }}>Category</h6>
    <ul className="list-unstyled mb-0" style={{ fontSize: "13px" }}>
      <li className="mb-2 d-flex align-items-center">
        {mainCategory && (
          <>
            <span className="text-muted me-2" style={{ fontSize: "20px", lineHeight: "0" }}>−</span>
            <span className="text-dark" style={{ fontWeight: "500" }}>{mainCategory}</span>
          </>
        )}
      </li>
      <li className="ps-3 mb-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span className="text-muted me-2" style={{ fontSize: "20px", lineHeight: "0" }}>−</span>
          <span className="text-danger fw-bold">{category}</span>
        </div>
        <span className="text-muted" style={{ fontSize: "11px" }}>{totalCount}</span>
      </li>
    </ul>
  </div>
);