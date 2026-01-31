import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios';
import useLogin from '../../hooks/useLogin';
import { useAuth } from '../../hooks/useAuth';

const PhoneInputStep = ({ onNext, setSharedData }) => {
    const onExistingUser = (value, type) => {
        setSharedData({ value, type });
        onNext('PASSWORD');
    };

    const onNewUser = (value, type) => {
        setSharedData({ value, type });
        onNext('REGISTER');
    };

    const { mobile, setMobile, handleContinue, error } = useLogin({
        mode: "page",
        onExistingUser,
        onNewUser,
    });

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <h6 className="text-muted mb-2">Welcome to Snapdeal</h6>
            <h2 className="fw-bold mb-3 text-dark">Get Started</h2>
            <p className="text-muted mb-4">Enter your Mobile Number or Email to continue</p>

            <Form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small text-secondary">Mobile / Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Mobile or Email"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="py-2"
                        style={{ fontSize: '15px', boxShadow: 'none' }}
                        isInvalid={!!error}
                    />
                    {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 fw-bold border-0"
                    style={{ backgroundColor: '#4a90e2', width: 'fit-content' }}
                >
                    Continue
                </Button>
            </Form>
        </div>
    );
};

const PasswordStep = ({ sharedData, onChangeUser, onNext }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                password,
                type: sharedData.type,
                value: sharedData.value
            };

            const res = await api.post('/users/password-validate', payload);

            if (res.data.success || res.data.token) {
                localStorage.setItem("token", res.data.token);
                if (setUser && res.data.user) {
                    setUser(res.data.user);
                }
                navigate('/seller');
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        onNext('RESET_PASSWORD');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <h4 className="fw-bold mb-2 text-dark">Welcome Back!</h4>
            <p className="text-muted mb-4 small">
                Logging in as <strong className="text-dark">{sharedData.value}</strong> <br/>
                <span className="text-primary small cursor-pointer text-decoration-underline" onClick={onChangeUser}>Change Account</span>
            </p>

            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold">Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        size="lg"
                        placeholder="Enter your password"
                        className="py-2 fs-6" 
                        style={{ boxShadow: 'none' }}
                    />
                </Form.Group>

                <div className="d-flex justify-content-end mb-4">
                    <Button 
                        variant="link" 
                        className="p-0 text-decoration-none small fw-bold text-primary" 
                        onClick={handleForgotPassword}
                        disabled={loading}
                    >
                        Forgot Password?
                    </Button>
                </div>

                {error && <div className="alert alert-danger small p-2 mb-3">{error}</div>}

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading} style={{ backgroundColor: '#4a90e2' }}>
                    {loading ? <Spinner size="sm" animation="border" /> : "LOGIN"}
                </Button>
            </Form>
        </div>
    );
};

const ResetPasswordStep = ({ sharedData, onCancel }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/users/reset-password', {
                type: sharedData.type,
                value: sharedData.value,
                newPassword: newPassword
            });

            if (res.status === 200) {
                setSuccess('Password updated successfully. Please login.');
                setTimeout(() => {
                    onCancel(); 
                }, 1500);
            }
        } catch (err) {
            setError(err?.response?.data?.error || "Reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <h4 className="fw-bold mb-2 text-dark">Reset Password</h4>
            <p className="text-muted mb-4 small">
                Create a new password for <strong className="text-dark">{sharedData.value}</strong>
            </p>

            <Form onSubmit={handleReset}>
                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="py-2"
                        style={{ boxShadow: 'none' }}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="py-2"
                        style={{ boxShadow: 'none' }}
                        required
                    />
                </Form.Group>

                {error && <div className="alert alert-danger small p-2 mb-3">{error}</div>}
                {success && <div className="alert alert-success small p-2 mb-3">{success}</div>}

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-2" disabled={loading} style={{ backgroundColor: '#4a90e2' }}>
                    {loading ? <Spinner size="sm" animation="border" /> : "RESET PASSWORD"}
                </Button>
                
                <Button variant="link" className="w-100 text-muted small text-decoration-none" onClick={onCancel}>
                    Cancel
                </Button>
            </Form>
        </div>
    );
};

const RegisterStep = ({ sharedData, onNext }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', dob: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sharedData?.type === 'email') {
            setFormData(prev => ({ ...prev, email: sharedData.value }));
        } else if (sharedData?.type === 'phone') {
            setFormData(prev => ({ ...prev, phone: sharedData.value }));
        }
    }, [sharedData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/seller/auth/register', formData);

            if (res.data.success) {
                await api.post('/auth/send-otp', { 
                    type: sharedData.type, 
                    value: sharedData.value 
                });
                onNext('OTP');
            }
        } catch (err) {
            let errorMsg = "Registration failed";
            const resMessage = err.response?.data?.message;
            if (typeof resMessage === 'string') errorMsg = resMessage;
            else if (err.message) errorMsg = err.message;
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <h4 className="fw-bold mb-1 mt-4 text-dark">Seller Registration</h4>
            <p className="text-muted small mb-3">Complete your profile to start selling</p>

            {error && <div className="alert alert-danger small p-2">{error}</div>}

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold mb-1">Full Name</Form.Label>
                    <Form.Control 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        size="sm" 
                        className="py-2" 
                        style={{ boxShadow: 'none' }}
                    />
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold mb-1">Mobile Number</Form.Label>
                    <Form.Control 
                        name="phone"
                        value={formData.phone} 
                        onChange={handleChange}
                        readOnly={sharedData.type === 'phone'} 
                        className={`py-2 ${sharedData.type === 'phone' ? 'bg-light' : ''}`}
                        size="sm"
                        required
                        style={{ boxShadow: 'none' }}
                    />
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold mb-1">Email Address</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        readOnly={sharedData.type === 'email'} 
                        className={`py-2 ${sharedData.type === 'email' ? 'bg-light' : ''}`}
                        required 
                        size="sm" 
                        style={{ boxShadow: 'none' }}
                    />
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold mb-1">Date of Birth</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="dob" 
                        value={formData.dob} 
                        onChange={handleChange} 
                        required 
                        size="sm" 
                        className="py-2" 
                        style={{ boxShadow: 'none' }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold mb-1">Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        size="sm" 
                        className="py-2" 
                        style={{ boxShadow: 'none' }}
                    />
                    <Form.Text className="text-muted small" style={{ fontSize: '10px' }}>Must be 6+ chars with 1 letter & 1 number</Form.Text>
                </Form.Group>

                <Button variant="danger" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "REGISTER & VERIFY"}
                </Button>
            </Form>
        </div>
    );
};

const OtpStep = ({ sharedData, onChangeNumber }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("/auth/verify-otp", { 
                type: sharedData.type, 
                value: sharedData.value, 
                otp 
            });
            
            localStorage.setItem("token", res.data.token);
            if (setUser && res.data.user) {
                setUser(res.data.user);
            }
            navigate('/seller');

        } catch (err) {
            setError(err?.response?.data?.error || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
            <h4 className="fw-bold mb-2 text-dark">Verify OTP</h4>
            <p className="text-muted mb-3 small">
                Enter code sent to <strong className="text-dark">{sharedData.value}</strong> <br/>
                <span className="text-primary small cursor-pointer text-decoration-underline" onClick={onChangeNumber}>Change</span>
            </p>

            <Form onSubmit={handleVerify}>
                <Form.Control
                    className="form-control text-center mb-3"
                    placeholder="Enter OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ height: "45px", fontSize: "18px", letterSpacing: "4px", boxShadow: 'none' }}
                />
                {error && <div className="text-danger text-center mb-2 small">{error}</div>}
                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
                    {loading ? "VERIFYING..." : "VERIFY OTP"}
                </Button>
            </Form>
        </div>
    );
};

export const SellerLogin = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState('PHONE'); 
    const [sharedData, setSharedData] = useState({ value: '', type: '' });

    const renderLeftContent = () => {
        switch (currentStep) {
            case 'PHONE': 
                return <PhoneInputStep onNext={setCurrentStep} setSharedData={setSharedData} />;
            case 'PASSWORD': 
                return <PasswordStep sharedData={sharedData} onChangeUser={() => setCurrentStep('PHONE')} onNext={setCurrentStep} />;
            case 'RESET_PASSWORD':
                return <ResetPasswordStep sharedData={sharedData} onCancel={() => setCurrentStep('PASSWORD')} />;
            case 'REGISTER': 
                return <RegisterStep sharedData={sharedData} onNext={setCurrentStep} />;
            case 'OTP': 
                return <OtpStep sharedData={sharedData} onChangeNumber={() => setCurrentStep('PHONE')} />;
            default: 
                return null;
        }
    };

    return (
        <div className="vh-100 d-flex flex-column overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <div className="w-100 py-3 px-4 px-md-5 d-flex justify-content-between align-items-center bg-white shadow-sm" style={{ zIndex: 10, height: '80px', flexShrink: 0 }}>
                <div className="d-flex align-items-center">
                   <img src="/snapdeal-logo.png" alt="Snapdeal" height="100" width="150" style={{ objectFit: 'contain', cursor:'pointer' }} onClick={() => navigate('/')} />
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small d-none d-md-block">New here?</span>
                    <Button variant="outline-danger" className="px-4 fw-bold" onClick={() => setCurrentStep('PHONE')}>Register</Button>
                </div>
            </div>

            <Container fluid className="p-0" style={{ height: 'calc(100vh - 80px)' }}>
                <Row className="h-100 g-0">
                    <Col md={6} className="bg-white h-100 position-relative d-flex flex-column justify-content-center align-items-center">
                        <div className="w-100 px-4" style={{ marginTop: '-40px' }}>
                            {renderLeftContent()}
                        </div>
                        
                        {currentStep === 'PHONE' && (
                            <div className="w-100 d-flex justify-content-center position-absolute bottom-0 pb-4">
                                <img src="https://setu.snapdeal.com/_next/image?url=%2Fassets%2Fimages%2Fbike.png&w=3840&q=75" alt="Delivery" style={{ maxHeight: '140px', objectFit: 'cover' }} />
                            </div>
                        )}
                    </Col>

                    <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-light position-relative h-100 overflow-hidden">
                        <div className="position-absolute w-100 h-100" style={{ backgroundColor: '#f4f4f5' }}></div>
                        <div className="position-relative d-flex justify-content-center align-items-center h-100" style={{ maxWidth: '90%' }}>
                            <img src="https://setu.snapdeal.com/_next/image?url=%2Fassets%2Fimages%2Fonboarding-img2.png&w=1080&q=75" alt="Dashboard" className="img-fluid" style={{ objectFit: 'contain', maxHeight: '80vh' }} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};