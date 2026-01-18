
export const AppNavInfoTopBar = () => {
  return (
    <div className="bg-danger text-white py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center px-5">
        <div className="fw-semibold" style={{fontSize: '12px'}}>
          India's Leading Online Shopping Destination
        </div>

        <div className="d-flex gap-4" style={{fontSize: '10px'}}>
          <span role="button">Our Blog</span>
          <span role="button">Help Center</span>
          <span role="button">Sell On Snapdeal</span>
          <span role="button" className="d-flex align-items-center gap-1">
            <i className="bi bi-phone" />
            Download App
          </span>
        </div>
      </div>
    </div>
  );
};
