import React, { useState } from "react";
import { Table, Spinner, Button, Badge, Modal, Row, Col, Dropdown } from "react-bootstrap";

const ActivityTable = ({ loading, activeTab, data, statusUpdateLoading, handleOrderStatusUpdate, handleStatusUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempStatuses, setTempStatuses] = useState({});

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleTempStatusChange = (orderId, status) => {
    setTempStatuses(prev => ({
      ...prev,
      [orderId]: status
    }));
  };

  const executeStatusUpdate = (orderId, originalStatus) => {
    const newStatus = tempStatuses[orderId];
    if (newStatus && newStatus !== originalStatus) {
        handleOrderStatusUpdate(orderId, newStatus);
    }
  };
  
  const getStatusColor = (status) => {
    if(!status) return 'secondary';
    const s = status.toLowerCase();
    
    if(['delivered', 'approved', 'refunded', 'replaced', 'returned'].includes(s)) return 'success';
    if(['cancelled', 'rejected'].includes(s)) return 'danger';
    if(['shipped', 'refund initiated', 'return pending', 'replace pending'].includes(s)) return 'primary';
    if(['processing', 'order placed', 'refund processing', 'pending'].includes(s)) return 'warning';
    
    return 'secondary';
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  const isProductTab = activeTab === 'approvals' || activeTab === 'inventory';

  return (
    <>
      <Table hover responsive className="mb-0 align-middle">
        <thead className="bg-light">
          <tr className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <th className="ps-4 py-3">Product / Order Info</th>
            <th className="py-3">Contact</th>
            <th className="text-center py-3">Value</th>
            <th className="text-center py-3">Status</th>
            <th className="text-end pe-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => {
              const currentStatus = tempStatuses[item._id] || item.orderStatus;
              const isChanged = tempStatuses[item._id] && tempStatuses[item._id] !== item.orderStatus;

              return (
                <tr key={item._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="ps-4 py-3">
                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                      {isProductTab ? item.name : `Order #${item._id.slice(-8).toUpperCase()}`}
                    </div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                      {isProductTab 
                          ? `${item.brand} • ${item.productType}` 
                          : `${item.items?.length || 0} Items • ${item.paymentMethod}`
                      }
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark" style={{ fontSize: '12px' }}>
                      {isProductTab ? (item.sellerId?.name || "Seller") : item.shippingAddress?.phone}
                    </div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                        {isProductTab ? item.sellerId?.email : item.shippingAddress?.city}
                    </div>
                  </td>
                  <td className="text-center fw-bold text-dark" style={{ fontSize: '13px' }}>
                    ₹{(isProductTab ? item.sellingPrice : item.totalAmount)?.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <Badge bg={getStatusColor(item.status || item.orderStatus)} style={{ fontSize: '10px', fontWeight: '600' }}>
                        {(item.status || item.orderStatus || 'Unknown').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-end pe-4">
                    {activeTab === 'approvals' ? (
                      <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" variant="success" style={{ fontSize: '11px', fontWeight: 'bold' }} onClick={() => handleStatusUpdate(item._id, "approved")}>Approve</Button>
                        <Button size="sm" variant="outline-danger" style={{ fontSize: '11px', fontWeight: 'bold' }} onClick={() => handleStatusUpdate(item._id, "rejected")}>Reject</Button>
                      </div>
                    ) : activeTab === 'inventory' ? (
                       <Button size="sm" variant="outline-secondary" style={{ fontSize: '11px', fontWeight: '600' }} onClick={() => handleViewProduct(item)}>
                          View
                        </Button>
                    ) : (
                      <div className="d-flex justify-content-end gap-2">
                        <Dropdown 
                            drop="down" 
                            onSelect={(eventKey) => handleTempStatusChange(item._id, eventKey)}
                        >
                          <Dropdown.Toggle 
                            variant="outline-dark" 
                            size="sm" 
                            disabled={statusUpdateLoading === item._id}
                            className="border-secondary-subtle"
                            style={{ 
                                fontSize: '11px', 
                                fontWeight: 'bold', 
                                width: '150px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}
                          >
                            {currentStatus || 'Select Status'}
                          </Dropdown.Toggle>

                          <Dropdown.Menu 
                            style={{ fontSize: '12px' }}
                            popperConfig={{
                              strategy: "fixed",
                              modifiers: [
                                {
                                  name: "flip",
                                  enabled: false,
                                },
                              ],
                            }}
                          >
                            <Dropdown.Item eventKey="Order Placed">Order Placed</Dropdown.Item>
                            <Dropdown.Item eventKey="Processing">Processing</Dropdown.Item>
                            <Dropdown.Item eventKey="Shipped">Shipped</Dropdown.Item>
                            <Dropdown.Item eventKey="Delivered">Delivered</Dropdown.Item>
                            <Dropdown.Item eventKey="Cancelled" className="text-danger">Cancelled</Dropdown.Item>
                            <Dropdown.Item eventKey="Return Pending">Return Pending</Dropdown.Item>
                            <Dropdown.Item eventKey="Returned">Returned</Dropdown.Item>
                            <Dropdown.Item eventKey="Refund Initiated">Refund Initiated</Dropdown.Item>
                            <Dropdown.Item eventKey="Refund Processing">Refund Processing</Dropdown.Item>
                            <Dropdown.Item eventKey="Refunded">Refunded</Dropdown.Item>
                            <Dropdown.Item eventKey="Replace Pending">Replace Pending</Dropdown.Item>
                            <Dropdown.Item eventKey="Replaced">Replaced</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        
                        <Button 
                            size="sm" 
                            variant="dark"
                            style={{ fontSize: '11px', fontWeight: 'bold' }}
                            disabled={!isChanged || statusUpdateLoading === item._id}
                            onClick={() => executeStatusUpdate(item._id, item.orderStatus)}
                        >
                            {statusUpdateLoading === item._id ? '...' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="5" className="text-center py-5 text-muted small">No records found</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title className="fs-5 fw-bold text-dark">{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Row>
                <Col md={5} className="mb-4 mb-md-0">
                  <div className="bg-light rounded p-3 d-flex align-items-center justify-content-center mb-3 border" style={{ height: '300px' }}>
                    <img 
                        src={selectedProduct.image && selectedProduct.image[0]} 
                        alt="Product" 
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <div className="d-flex gap-2 overflow-auto pb-2">
                      {selectedProduct.image && selectedProduct.image.map((img, index) => (
                          <div key={index} className="border rounded p-1" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                            <img src={img} alt="" className="w-100 h-100 object-fit-contain" />
                          </div>
                      ))}
                  </div>
                </Col>
                <Col md={7}>
                   <div className="mb-3">
                        <Badge bg={getStatusColor(selectedProduct.status)} className="mb-2 px-3 py-2">
                            {selectedProduct.status.toUpperCase()}
                        </Badge>
                   </div>
                   
                   <Row className="g-3 mb-4">
                       <Col xs={6}>
                           <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Brand</label>
                           <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{selectedProduct.brand}</div>
                       </Col>
                       <Col xs={6}>
                           <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Category</label>
                           <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{selectedProduct.subCategory}</div>
                       </Col>
                       <Col xs={6}>
                           <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Price</label>
                           <div className="d-flex align-items-baseline gap-2">
                               <span className="fw-bold text-dark fs-5">₹{selectedProduct.sellingPrice}</span>
                               <span className="text-decoration-line-through text-muted small">₹{selectedProduct.mrp}</span>
                           </div>
                       </Col>
                       <Col xs={6}>
                           <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Stock</label>
                           <div className={`fw-bold ${selectedProduct.stockQuantity < 5 ? 'text-danger' : 'text-success'}`} style={{ fontSize: '14px' }}>
                               {selectedProduct.stockQuantity} Units Left
                           </div>
                       </Col>
                   </Row>

                   <div className="p-3 bg-light rounded border mb-3">
                       <label className="text-muted mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Seller Information</label>
                       <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{selectedProduct.sellerId?.name}</div>
                       <div className="text-muted" style={{ fontSize: '12px' }}>{selectedProduct.sellerId?.email}</div>
                   </div>

                   <div>
                       <label className="text-muted mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Description</label>
                       <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                           {selectedProduct.description}
                       </p>
                   </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default ActivityTable;