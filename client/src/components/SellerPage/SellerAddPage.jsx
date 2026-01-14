import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import api from '../../services/axios';

export const SellerAddProduct = () => {
    const [product, setProduct] = useState({
        pid: '', name: '', image: [''], description: '', brand: '',
        productMainCategory: "Men's Fashion", subCategory: '', productType: '',
        genderCategory: 'Men', sizes: [''], stockQuantity: 0,
        mrp: 0, discount: 0, sellingPrice: 0, purl: '',
        rating: 0, ratingsCount: 0, reviewsCount: 0,
        specifications: { Fabric: '', Fit: '', Pattern: '', Occasion: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['mrp', 'discount', 'stockQuantity', 'rating', 'ratingsCount', 'reviewsCount'];
        
        let updatedValue = numericFields.includes(name) ? Number(value) : value;

        setProduct(prev => {
            const newState = { ...prev, [name]: updatedValue };
            
            if (name === 'mrp' || name === 'discount') {
                newState.sellingPrice = Math.round(newState.mrp - (newState.mrp * (newState.discount / 100)));
            }
            return newState;
        });
    };

    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            specifications: { ...prev.specifications, [name]: value }
        }));
    };

    const handleArrayChange = (index, value, field) => {
        const newArr = [...product[field]];
        newArr[index] = value;
        setProduct(prev => ({ ...prev, [field]: newArr }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', product);
            alert("Product posted successfully!");
        } catch (error) {
            alert(`Error: ${error.response?.data?.details?.join(", ") || "Upload failed"}`);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow p-4 border-0">
                <h2 className="mb-4 text-center fw-bold">Seller Portal: Full Product Entry</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={4}><Form.Group><Form.Label>PID *</Form.Label><Form.Control name="pid" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={4}><Form.Group><Form.Label>Name *</Form.Label><Form.Control name="name" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={4}><Form.Group><Form.Label>Brand *</Form.Label><Form.Control name="brand" required onChange={handleChange} /></Form.Group></Col>
                    </Row>

                    <Row className="mb-3 bg-light p-3 rounded">
                        <Col md={3}><Form.Group><Form.Label>Main Category *</Form.Label>
                            <Form.Select name="productMainCategory" onChange={handleChange}>
                                <option>Men's Fashion</option><option>Women's Fashion</option>
                                <option>Home & Kitchen</option><option>Electronics</option>
                            </Form.Select>
                        </Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Sub Category *</Form.Label><Form.Control name="subCategory" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Type *</Form.Label><Form.Control name="productType" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Gender *</Form.Label>
                            <Form.Select name="genderCategory" onChange={handleChange}>
                                <option>Men</option><option>Women</option><option>Unisex</option>
                            </Form.Select>
                        </Form.Group></Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={3}><Form.Group><Form.Label>MRP (₹) *</Form.Label><Form.Control type="number" name="mrp" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Discount (%) *</Form.Label><Form.Control type="number" name="discount" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Selling Price</Form.Label><Form.Control type="number" value={product.sellingPrice} readOnly className="bg-light" /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Stock *</Form.Label><Form.Control type="number" name="stockQuantity" required onChange={handleChange} /></Form.Group></Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={3}><Form.Group><Form.Label>PURL Slug *</Form.Label><Form.Control name="purl" required onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Rating (0-5)</Form.Label><Form.Control type="number" step="0.1" name="rating" onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Ratings Count</Form.Label><Form.Control type="number" name="ratingsCount" onChange={handleChange} /></Form.Group></Col>
                        <Col md={3}><Form.Group><Form.Label>Reviews Count</Form.Label><Form.Control type="number" name="reviewsCount" onChange={handleChange} /></Form.Group></Col>
                    </Row>

                    <h5 className="mt-4">Specifications</h5>
                    <Row className="mb-3 p-2 border rounded">
                        <Col md={3}><Form.Control name="Fabric" placeholder="Fabric" onChange={handleSpecChange} /></Col>
                        <Col md={3}><Form.Control name="Fit" placeholder="Fit" onChange={handleSpecChange} /></Col>
                        <Col md={3}><Form.Control name="Pattern" placeholder="Pattern" onChange={handleSpecChange} /></Col>
                        <Col md={3}><Form.Control name="Occasion" placeholder="Occasion" onChange={handleSpecChange} /></Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Label>Image URLs *</Form.Label>
                            {product.image.map((_, i) => (
                                <Form.Control key={i} className="mb-2" required placeholder="https://..." onChange={(e) => handleArrayChange(i, e.target.value, 'image')} />
                            ))}
                            <Button size="sm" variant="outline-secondary" onClick={() => setProduct({...product, image: [...product.image, '']})}>+ Add Image</Button>
                        </Col>
                        <Col md={6}>
                            <Form.Label>Sizes *</Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {product.sizes.map((_, i) => (
                                    <Form.Control key={i} style={{width: '70px'}} required placeholder="XL" onChange={(e) => handleArrayChange(i, e.target.value, 'sizes')} />
                                ))}
                                <Button size="sm" variant="outline-secondary" onClick={() => setProduct({...product, sizes: [...product.sizes, '']})}>+</Button>
                            </div>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>Description *</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" required onChange={handleChange} />
                    </Form.Group>

                    <Button variant="danger" type="submit" className="w-100 py-3 fw-bold shadow">PUBLISH PRODUCT</Button>
                </Form>
            </Card>
        </Container>
    );
};