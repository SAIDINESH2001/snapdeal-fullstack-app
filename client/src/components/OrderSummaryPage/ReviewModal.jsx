import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ReviewModal = ({ show, onHide, selectedItem, rating, hover, comment, isSubmitting, setRating, setHover, setComment, onSubmit }) => {
    return (
        <Modal show={show} onHide={onHide} centered className="rounded-0">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fs-6 fw-bold">RATE THIS PRODUCT</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center px-4 pb-4">
                {selectedItem && (
                    <div className="d-flex gap-3 mb-4 align-items-center bg-light p-2 border">
                        <img src={selectedItem.image[0]} width="45" height="45" style={{ objectFit: 'contain' }} alt="" />
                        <span className="small fw-bold text-truncate" style={{maxWidth: '250px'}}>{selectedItem.name}</span>
                    </div>
                )}
                <Form onSubmit={onSubmit}>
                    <div className="mb-4 d-flex justify-content-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star} 
                                className="material-symbols-outlined" 
                                style={{ 
                                    cursor: 'pointer', 
                                    color: (hover || rating) >= star ? '#e40046' : '#ccc', 
                                    fontSize: '40px',
                                    userSelect: 'none'
                                }}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                {(hover || rating) >= star ? 'star' : 'star_outline'}
                            </span>
                        ))}
                    </div>
                    <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Share your experience..." 
                        className="rounded-0 mb-3 shadow-none border"
                        style={{ fontSize: '14px' }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <Button 
                        type="submit" 
                        variant="danger" 
                        className="w-100 rounded-0 fw-bold py-2"
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? "SAVING..." : "SAVE REVIEW"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReviewModal;