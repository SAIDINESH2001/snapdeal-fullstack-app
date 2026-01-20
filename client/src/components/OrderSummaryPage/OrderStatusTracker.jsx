import React from "react";

const OrderStatusTracker = ({ stages, currentStep }) => {
    return (
        <div className="mb-5 px-5">
            <div className="d-flex justify-content-between position-relative" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="position-absolute" style={{ top: '20px', left: '0', right: '0', height: '2px', background: '#eee', zIndex: 0 }}></div>
                {currentStep > 0 && (
                    <div className="position-absolute" style={{ 
                        top: '20px', left: '0', 
                        width: `${(currentStep / (stages.length - 1)) * 100}%`, 
                        height: '2px', background: '#16a34a', zIndex: 1, transition: 'width 0.4s ease' 
                    }}></div>
                )}
                {stages.map((stage, index) => {
                    const isActive = index <= currentStep;
                    return (
                        <div key={index} className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                style={{ 
                                    width: '40px', height: '40px', 
                                    backgroundColor: isActive ? '#16a34a' : '#fff',
                                    border: `2px solid ${isActive ? '#16a34a' : '#eee'}`,
                                    color: isActive ? '#fff' : '#ccc',
                                    fontSize: '18px'
                                }}>
                                <i className={`bi ${stage.icon}`}></i>
                            </div>
                            <div className="fw-bold" style={{ color: isActive ? '#333' : '#ccc', fontSize: '11px' }}>
                                {stage.label.toUpperCase()}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;