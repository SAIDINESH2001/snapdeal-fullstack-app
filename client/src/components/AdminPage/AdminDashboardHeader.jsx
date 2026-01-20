import React from "react";
import { Button } from "react-bootstrap";

const DashboardHeader = ({ activeTab }) => {
  const titles = {
    approvals: "Product Approvals",
    products: "Inventory Manager",
    orders: "Customer Orders"
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h4 className="fw-bold text-[#1e293b] mb-1">{titles[activeTab]}</h4>
        <p className="text-muted small mb-0">Overview of your marketplace activity</p>
      </div>
      <Button 
        className="rounded-3 border-0 px-4 py-2 fw-semibold shadow-sm" 
        style={{ backgroundColor: '#e40046' }} 
        onClick={() => (window.location.href = "/add-product")}
      >
        + New Product
      </Button>
    </div>
  );
};

export default DashboardHeader;