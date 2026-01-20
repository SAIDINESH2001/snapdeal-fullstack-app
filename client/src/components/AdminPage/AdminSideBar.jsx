import React from "react";
import { Nav, Badge } from "react-bootstrap";

const Sidebar = ({ activeTab, setActiveTab, pendingCount, ordersCount }) => {
  const menuItems = [
    { id: 'approvals', label: 'Review Queue', icon: 'pending', count: pendingCount },
    { id: 'products', label: 'Inventory', icon: 'grid_view', count: 0 },
    { id: 'orders', label: 'Orders', icon: 'shopping_bag', count: ordersCount }
  ];

  return (
    <div className="bg-white border-end px-3 py-4 sticky-top shadow-sm" style={{ height: '100vh' }}>
      <div className="px-3 mb-5 mt-2">
        <span className="text-muted small">Admin Dashboard</span>
      </div>
      <Nav className="flex-column gap-1">
        {menuItems.map(item => (
          <Nav.Link
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`d-flex align-items-center justify-content-between rounded-3 px-3 py-2.5 transition-all ${
              activeTab === item.id ? "bg-[#f1f5f9] text-[#e40046] fw-bold" : "text-secondary"
            }`}
            style={{ fontSize: '14px' }}
          >
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-5">{item.icon}</span>
              {item.label}
            </div>
            {item.count > 0 && (
              <Badge pill bg={activeTab === item.id ? "danger" : "light"} text={activeTab === item.id ? "white" : "dark"} style={{ fontSize: '10px' }}>
                {item.count}
              </Badge>
            )}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;