export const HomePageNavSearch = () => {
  return (
    <div className="mx-4 d-flex justify-content-end" style={{ width: "720px" }}>
      <div className="input-group border border-dark rounded">
        <span className="input-group-text bg-white border-end-0">
          <span className="material-symbols-outlined fs-5 text-muted">
            search
          </span>
        </span>

        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search for Brands & Products"
          style={{
            height: "44px",
            fontSize: "14px",
            boxShadow: 'none',
            outline: "none",
          }}
        />
      </div>
    </div>
  );
};
