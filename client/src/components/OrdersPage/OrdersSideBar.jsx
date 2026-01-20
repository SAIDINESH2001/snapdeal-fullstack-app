import React from "react";

const AccountSidebar = ({ user }) => {
  return (
    <div className="border-end pr-md-4 h-100">
      <h5 className="fw-bold mb-4" style={{ fontSize: "14px", color: '#e40046', letterSpacing: '0.5px' }}>MY ACCOUNT</h5>
      
      <div className="d-flex align-items-center gap-3 mb-4 p-2" style={{ backgroundColor: '#fcfcfc', borderRadius: '4px' }}>
        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: "35px", height: "35px" }}>
          <span className="material-symbols-outlined fs-5">person</span>
        </div>
        <div className="overflow-hidden">
          <div className="fw-bold text-dark text-truncate" style={{ fontSize: '12px' }}>{user?.name || "User"}</div>
          <div className="text-muted text-truncate" style={{ fontSize: "10px" }}>{user?.email}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2 text-dark">
          <span className="material-symbols-outlined fs-5">description</span>
          <span className="fw-bold" style={{ fontSize: '12px' }}>ORDERS</span>
        </div>
        <div className="ps-4 fw-bold" style={{ fontSize: '12px', color: '#e40046', cursor: 'pointer' }}>My Orders</div>
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2 text-muted">
          <span className="material-symbols-outlined fs-5">person</span>
          <span className="fw-bold" style={{ fontSize: '12px' }}>PROFILE</span>
        </div>
        <div className="ps-4 text-muted py-1 cursor-pointer" style={{ fontSize: '12px' }}>Saved Addresses</div>
        <div className="ps-4 text-muted py-1 cursor-pointer" style={{ fontSize: '12px' }}>Saved Cards</div>
      </div>
    </div>
  );
};

export default AccountSidebar;