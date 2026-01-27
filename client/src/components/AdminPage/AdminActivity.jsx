import React from "react";
import { Table, Spinner, Form, Button } from "react-bootstrap";

const ActivityTable = ({ loading, activeTab, data, statusUpdateLoading, handleOrderStatusUpdate, handleStatusUpdate }) => {
  
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase().trim() || 'default';
    const colors = {
      'delivered': { bg: '#10b981', color: '#ffffff' },      
      'cancelled': { bg: '#ef4444', color: '#ffffff' },      
      'shipped': { bg: '#3b82f6', color: '#ffffff' },        
      'processing': { bg: '#f59e0b', color: '#ffffff' },     
      'order placed': { bg: '#64748b', color: '#ffffff' },   
      'return pending': { bg: '#f97316', color: '#ffffff' }, 
      'returned': { bg: '#8b5cf6', color: '#ffffff' },       
      'replace pending': { bg: '#06b6d4', color: '#ffffff' }, 
      'replaced': { bg: '#ec4899', color: '#ffffff' },
      'refund initiated': { bg: '#6366f1', color: '#ffffff' },
      'refund processing': { bg: '#8b5cf6', color: '#ffffff' },
      'refunded': { bg: '#14b8a6', color: '#ffffff' },
      'default': { bg: '#94a3b8', color: '#ffffff' }
    };
    return colors[s] || colors['default'];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 bg-white">
        <Spinner animation="border" variant="danger" size="sm" />
      </div>
    );
  }

  return (
    <Table borderless hover responsive className="mb-0 align-middle shadow-none">
      <thead className="bg-[#f8fafc] border-bottom">
        <tr className="text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
          <th className="ps-4 py-2">INFORMATION</th>
          <th className="py-2">CONTACT / SOURCE</th>
          <th className="py-2 text-center">VALUE</th>
          <th className="py-2 text-center">STATUS</th>
          <th className="text-end pe-4 py-2">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => {
            const statusConfig = getStatusConfig(item.orderStatus);
            const lastAction = item.actionHistory?.[item.actionHistory.length - 1];
            
            return (
              <tr key={item._id} className="border-bottom transition-all hover:bg-gray-50">
                <td className="ps-4 py-3" style={{ maxWidth: '280px' }}>
                  <div className="fw-bold text-[#1e293b]" style={{ fontSize: '12.5px' }}>
                    {activeTab === 'approvals' ? item.name : `ID: #${item._id.toUpperCase()}`}
                  </div>
                  <div className="text-muted fw-medium" style={{ fontSize: '11px' }}>
                    {activeTab === 'approvals' ? `${item.brand} • ${item.productType}` : `${item.items.length} items • ${item.paymentMethod}`}
                  </div>
                  {activeTab !== 'approvals' && lastAction && (
                    <div className="mt-1 p-2 bg-[#fff1f2] border-start border-danger border-2 rounded-1" style={{ fontSize: '10.5px' }}>
                      <span className="text-danger fw-bold text-uppercase">Reason: </span>
                      <span className="text-[#475569]">{lastAction.reason}</span>
                    </div>
                  )}
                </td>
                <td className="py-3">
                  <div className="fw-semibold text-[#475569]" style={{ fontSize: '12px' }}>
                    {activeTab === 'approvals' ? (item.sellerId?.name || "Independent") : item.shippingAddress.phone}
                  </div>
                  {activeTab !== 'approvals' && <div className="text-muted" style={{ fontSize: '10.5px' }}>{item.shippingAddress.city}</div>}
                </td>
                <td className="fw-bold text-[#1e293b] text-center" style={{ fontSize: '12.5px' }}>
                  ₹{(activeTab === 'approvals' ? item.sellingPrice : item.totalAmount).toLocaleString()}
                </td>
                <td className="text-center py-3">
                  <div
                    style={{ 
                      backgroundColor: statusConfig.bg, 
                      color: statusConfig.color, 
                      fontSize: '10px', 
                      minWidth: '115px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      display: 'inline-block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }} 
                  >
                    {item.orderStatus || 'ORDER PLACED'}
                  </div>
                </td>
                <td className="text-end pe-4 py-3">
                  {activeTab !== 'approvals' ? (
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <Form.Select 
                        size="sm" 
                        className="border-0 bg-[#f1f5f9] text-[#475569] shadow-none"
                        style={{ width: '130px', fontSize: '11px', height: '32px', borderRadius: '4px' }}
                        defaultValue={item.orderStatus}
                        id={`sel-${item._id}`}
                      >
                        {[
                          'Order Placed', 
                          'Processing', 
                          'Shipped', 
                          'Delivered', 
                          'Cancelled', 
                          'Return Pending', 
                          'Returned', 
                          'Refund Initiated',
                          'Refund Processing',
                          'Refunded',
                          'Replace Pending', 
                          'Replaced'
                        ].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>
                      <Button 
                        size="sm" className="px-3 border-0 shadow-none fw-bold"
                        style={{ backgroundColor: '#1e293b', fontSize: '10px', height: '32px', borderRadius: '4px' }}
                        disabled={statusUpdateLoading === item._id}
                        onClick={() => handleOrderStatusUpdate(item._id, document.getElementById(`sel-${item._id}`).value)}
                      >
                        {statusUpdateLoading === item._id ? '...' : 'SAVE'}
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end gap-1">
                      <Button variant="light" size="sm" className="text-success fw-bold px-2 py-1 rounded-2 border-0 shadow-none" style={{ fontSize: '11px' }} onClick={() => handleStatusUpdate(item._id, "approved")}>Accept</Button>
                      <Button variant="link" size="sm" className="text-danger text-decoration-none fw-bold px-1" style={{ fontSize: '11px' }} onClick={() => handleStatusUpdate(item._id, "rejected")}>Decline</Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr><td colSpan="5" className="text-center py-5 text-muted fw-medium" style={{ fontSize: '12px' }}>No records found.</td></tr>
        )}
      </tbody>
    </Table>
  );
};

export default ActivityTable;