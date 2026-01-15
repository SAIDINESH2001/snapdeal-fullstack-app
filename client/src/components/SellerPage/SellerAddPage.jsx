import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../../services/axios';
import { getCategories } from './sellerAddPageService';
import { AppNav } from '../common/ApplicationNavBar/AppNav';

const RedStar = () => <span className="text-danger">*</span>;

export const SellerAddProduct = () => {
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const [product, setProduct] = useState({
        pid: '', name: '', image: [''], description: '', brand: '',
        productMainCategory: '', subCategory: '', productType: '',
        genderCategory: 'Men', sizes: [''], stockQuantity: 0,
        mrp: 0, discount: 0, sellingPrice: 0, purl: '',
        rating: 0, ratingsCount: 0, reviewsCount: 0,
        specifications: { Fabric: '', Fit: '', Pattern: '', Occasion: '' }
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getCategories();
            setDbCategories(data);
            setLoading(false);
        };
        loadData();
    }, []);

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

    const handleMainCategoryChange = (e) => {
        const catName = e.target.value;
        const catObj = dbCategories.find(c => c.categoryName === catName);
        setSelectedCategory(catObj || null);
        setSelectedSection(null); // Reset child selection
        setProduct(prev => ({ 
            ...prev, 
            productMainCategory: catName, 
            subCategory: '', 
            productType: '' 
        }));
    };

    const handleSectionChange = (e) => {
        const secName = e.target.value;
        const secObj = selectedCategory?.sections?.find(s => s.sectionName === secName);
        setSelectedSection(secObj || null);
        setProduct(prev => ({ 
            ...prev, 
            subCategory: secName, 
            productType: '' 
        }));
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
        <>
            <AppNav />
            <Container className="py-5">
                <Card className="shadow p-4 border-0">
                    <h2 className="mb-4 text-center fw-bold text-dark">Seller Portal: Add Product</h2>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                            <p className="mt-2 text-muted">Fetching Categories...</p>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={4}><Form.Group><Form.Label>Name <RedStar /></Form.Label><Form.Control name="name" required onChange={handleChange} /></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Brand <RedStar /></Form.Label><Form.Control name="brand" required onChange={handleChange} /></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Gender <RedStar /></Form.Label>
                                    <Form.Select name="genderCategory" onChange={handleChange}>
                                        <option>Men</option><option>Women</option><option>Unisex</option><option>Kids</option>
                                    </Form.Select>
                                </Form.Group></Col>
                            </Row>

                            <Row className="mb-3 bg-light p-3 rounded border">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-secondary small">MAIN CATEGORY <RedStar /></Form.Label>
                                        <Form.Select required value={product.productMainCategory} onChange={handleMainCategoryChange}>
                                            <option value="">Select Category</option>
                                            {dbCategories.map(cat => (
                                                <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-secondary small">SUB CATEGORY <RedStar /></Form.Label>
                                        <Form.Select required disabled={!selectedCategory} value={product.subCategory} onChange={handleSectionChange}>
                                            <option value="">Select Sub Category</option>
                                            {selectedCategory?.sections?.map(sec => (
                                                <option key={sec._id} value={sec.sectionName}>{sec.sectionName}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-secondary small">PRODUCT TYPE <RedStar /></Form.Label>
                                        <Form.Select required disabled={!selectedSection} name="productType" value={product.productType} onChange={handleChange}>
                                            <option value="">Select Item Type</option>
                                            {selectedSection?.items?.map(item => (
                                                <option key={item._id} value={item.itemName}>{item.itemName}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><Form.Group><Form.Label>MRP (₹) <RedStar /></Form.Label><Form.Control type="number" name="mrp" required onChange={handleChange} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Discount (%) <RedStar /></Form.Label><Form.Control type="number" name="discount" required onChange={handleChange} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Selling Price</Form.Label><Form.Control type="number" value={product.sellingPrice} readOnly className="bg-light" /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Stock <RedStar /></Form.Label><Form.Control type="number" name="stockQuantity" required onChange={handleChange} /></Form.Group></Col>
                            </Row>

                            <h5 className="mt-4">Specifications (Optional)</h5>
                            <Row className="mb-3 p-2 border rounded">
                                <Col md={3}><Form.Control name="Fabric" placeholder="Fabric" onChange={handleSpecChange} /></Col>
                                <Col md={3}><Form.Control name="Fit" placeholder="Fit" onChange={handleSpecChange} /></Col>
                                <Col md={3}><Form.Control name="Pattern" placeholder="Pattern" onChange={handleSpecChange} /></Col>
                                <Col md={3}><Form.Control name="Occasion" placeholder="Occasion" onChange={handleSpecChange} /></Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Label>Image URLs <RedStar /></Form.Label>
                                    {product.image.map((_, i) => (
                                        <Form.Control key={i} className="mb-2" required placeholder="https://..." onChange={(e) => handleArrayChange(i, e.target.value, 'image')} />
                                    ))}
                                    <Button size="sm" variant="outline-dark" onClick={() => setProduct({ ...product, image: [...product.image, ''] })}>+ Add Image</Button>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Sizes <RedStar /></Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {product.sizes.map((_, i) => (
                                            <Form.Control key={i} style={{ width: '70px' }} required placeholder="XL" onChange={(e) => handleArrayChange(i, e.target.value, 'sizes')} />
                                        ))}
                                        <Button size="sm" variant="outline-dark" onClick={() => setProduct({ ...product, sizes: [...product.sizes, ''] })}>+</Button>
                                    </div>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label>Description <RedStar /></Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" required onChange={handleChange} />
                            </Form.Group>

                            <Button variant="danger" type="submit" className="w-100 py-3 fw-bold shadow">PUBLISH PRODUCT</Button>
                        </Form>
                    )}
                </Card>
            </Container>
        </>
    );
};