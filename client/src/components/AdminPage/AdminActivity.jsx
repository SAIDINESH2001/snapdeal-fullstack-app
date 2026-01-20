import React from "react";
import { Table, Spinner, Badge, Form, Button } from "react-bootstrap";

const ActivityTable = ({ loading, activeTab, data, statusUpdateLoading, handleOrderStatusUpdate, handleStatusUpdate }) => {
  const getStatusConfig = (status) => {
    const config = {
      'Delivered': { bg: '#def7ec', color: '#03543f' },
      'Cancelled': { bg: '#fde8e8', color: '#9b1c1c' },
      'Shipped': { bg: '#e1effe', color: '#1e429f' },
      'Processing': { bg: '#fef3c7', color: '#92400e' },
      'Order Placed': { bg: '#f3f4f6', color: '#374151' }
    };
    return config[status] || config['Order Placed'];
  };

  if (loading) {
    return (
      <Table borderless hover responsive className="mb-0">
        <tbody>
          <tr><td className="text-center py-5"><Spinner animation="border" variant="danger" size="sm" /></td></tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table borderless hover responsive className="mb-0">
      <thead className="bg-[#f8fafc] border-bottom">
        <tr className="text-muted extra-small fw-bold">
          <th className="ps-4 py-3">INFORMATION</th>
          <th className="py-3">CONTACT / SOURCE</th>
          <th className="py-3 text-center">VALUE</th>
          <th className="py-3 text-center">STATUS</th>
          <th className="text-end pe-4 py-3">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => {
            const statusConfig = getStatusConfig(item.orderStatus || 'Pending');
            return (
              <tr key={item._id} className="align-middle border-bottom transition-all">
                <td className="ps-4 py-4">
                  <div className="fw-bold text-[#334155]" style={{ fontSize: '13.5px' }}>
                    {activeTab === 'orders' ? `ORDERID - #${item._id.toUpperCase()}` : item.name}
                  </div>
                  <div className="text-muted extra-small">
                    {activeTab === 'orders' ? `${item.items.length} items • ${item.paymentMethod}` : `${item.brand} • ${item.productType}`}
                  </div>
                </td>
                <td>
                  <div className="fw-semibold text-[#475569]" style={{ fontSize: '13px' }}>
                    {activeTab === 'orders' ? item.shippingAddress.phone : (item.sellerId?.name || "Independent")}
                  </div>
                  {activeTab === 'orders' && <div className="text-muted extra-small">{item.shippingAddress.city}</div>}
                </td>
                <td className="fw-bold text-[#1e293b] text-center">
                  ₹{(activeTab === 'orders' ? item.totalAmount : item.sellingPrice).toLocaleString()}
                </td>
                <td className="text-center">
                  <Badge 
                    style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, fontSize: '10px' }} 
                    className="rounded-pill px-3 py-2 fw-bold"
                  >
                    {(item.orderStatus || 'PENDING').toUpperCase()}
                  </Badge>
                </td>
                <td className="text-end pe-4">
                  {activeTab === 'orders' ? (
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <Form.Select 
                        size="sm" 
                        className="rounded-3 border-light bg-light"
                        style={{ width: '130px', fontSize: '11px', color: '#475569' }}
                        defaultValue={item.orderStatus}
                        id={`sel-${item._id}`}
                      >
                        {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="dark" size="sm" className="rounded-3 px-3 fw-bold border-0"
                        style={{ backgroundColor: '#334155' }}
                        disabled={statusUpdateLoading === item._id}
                        onClick={() => handleOrderStatusUpdate(item._id, document.getElementById(`sel-${item._id}`).value)}
                      >
                        {statusUpdateLoading === item._id ? '...' : 'Save'}
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end gap-1">
                      <Button variant="light" size="sm" className="text-success fw-bold rounded-2 px-3" onClick={() => handleStatusUpdate(item._id, "approved")}>Accept</Button>
                      <Button variant="link" size="sm" className="text-danger text-decoration-none fw-bold" onClick={() => handleStatusUpdate(item._id, "rejected")}>Decline</Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr><td colSpan="5" className="text-center py-5 text-muted small">No data found in this category.</td></tr>
        )}
      </tbody>
    </Table>
  );
};

export default ActivityTable;