import React from "react";
import { Table, Spinner, Badge, Form, Button } from "react-bootstrap";

const ActivityTable = ({ loading, activeTab, data, statusUpdateLoading, handleOrderStatusUpdate, handleStatusUpdate }) => {
  const getStatusConfig = (status) => {
    const config = {
      'Delivered': { bg: '#def7ec', color: '#03543f' },
      'Cancelled': { bg: '#fde8e8', color: '#9b1c1c' },
      'Shipped': { bg: '#e1effe', color: '#1e429f' },
      'Processing': { bg: '#fef3c7', color: '#92400e' },
      'Order Placed': { bg: '#f3f4f6', color: '#374151' },
      'Return Pending': { bg: '#ffedd5', color: '#9a3412' },
      'Returned': { bg: '#f3e8ff', color: '#6b21a8' },
      'Replace Pending': { bg: '#dcfce7', color: '#166534' },
      'Replaced': { bg: '#ecfeff', color: '#083344' }
    };
    return config[status] || config['Order Placed'];
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
            const statusConfig = getStatusConfig(item.orderStatus || 'Order Placed');
            const lastAction = item.actionHistory?.[item.actionHistory.length - 1];
            
            return (
              <tr key={item._id} className="border-bottom transition-all hover:bg-gray-50">
                <td className="ps-4 py-3" style={{ maxWidth: '280px' }}>
                  <div className="fw-bold text-[#1e293b]" style={{ fontSize: '12.5px' }}>
                    {activeTab === 'orders' ? `ID: #${item._id.toUpperCase()}` : item.name}
                  </div>
                  <div className="text-muted fw-medium" style={{ fontSize: '11px' }}>
                    {activeTab === 'orders' ? `${item.items.length} items • ${item.paymentMethod}` : `${item.brand} • ${item.productType}`}
                  </div>
                  {activeTab === 'orders' && lastAction && (
                    <div className="mt-1 p-2 bg-[#fff1f2] border-start border-danger border-2 rounded-1" style={{ fontSize: '10.5px' }}>
                      <span className="text-danger fw-bold text-uppercase">Reason: </span>
                      <span className="text-[#475569]">{lastAction.reason}</span>
                    </div>
                  )}
                </td>
                <td className="py-3">
                  <div className="fw-semibold text-[#475569]" style={{ fontSize: '12px' }}>
                    {activeTab === 'orders' ? item.shippingAddress.phone : (item.sellerId?.name || "Independent")}
                  </div>
                  {activeTab === 'orders' && <div className="text-muted" style={{ fontSize: '10.5px' }}>{item.shippingAddress.city}</div>}
                </td>
                <td className="fw-bold text-[#1e293b] text-center" style={{ fontSize: '12.5px' }}>
                  ₹{(activeTab === 'orders' ? item.totalAmount : item.sellingPrice).toLocaleString()}
                </td>
                <td className="text-center py-3">
                  <Badge 
                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, fontSize: '9.5px' }} 
                    className="rounded-pill px-2 py-1.5 fw-bold border-0"
                  >
                    {(item.orderStatus || 'ORDER PLACED').toUpperCase()}
                  </Badge>
                </td>
                <td className="text-end pe-4 py-3">
                  {activeTab === 'orders' ? (
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <Form.Select 
                        size="sm" 
                        className="border-0 bg-[#f1f5f9] text-[#475569] shadow-none"
                        style={{ width: '120px', fontSize: '10.5px', height: '30px' }}
                        defaultValue={item.orderStatus}
                        id={`sel-${item._id}`}
                      >
                        {['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Pending', 'Returned', 'Replace Pending', 'Replaced'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>
                      <Button 
                        size="sm" className="px-2 border-0 shadow-none fw-bold"
                        style={{ backgroundColor: '#1e293b', fontSize: '10.5px', height: '30px' }}
                        disabled={statusUpdateLoading === item._id}
                        onClick={() => handleOrderStatusUpdate(item._id, document.getElementById(`sel-${item._id}`).value)}
                      >
                        {statusUpdateLoading === item._id ? '...' : 'Save'}
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