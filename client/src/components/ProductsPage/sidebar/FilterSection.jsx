import React from "react";

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <div className="mb-4 pb-2 border-bottom">
    <div
      className="d-flex justify-content-between align-items-center mb-2"
      style={{ cursor: "pointer" }}
      onClick={onToggle}
    >
      <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>{title}</h6>
      <span className="fw-bold text-muted">{isOpen ? "−" : "+"}</span>
    </div>
    {isOpen && children}
  </div>
);

export default FilterSection;