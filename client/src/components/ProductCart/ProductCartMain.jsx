import { useEffect, useState } from "react";
import { ProductCartBody } from "./ProductCartBody";
import { ProductCartFooter } from "./ProductCartFooter";
import api from '../../services/axios';
import { useParams } from 'react-router-dom';
import { Spinner, Container } from "react-bootstrap";

export const ProductCartMain = () => {
    const [cartProduct, setCartProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { productId } = useParams();

    const fetchProductData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`products/${productId}`);
            setCartProduct(res.data.product);
        }
        catch (error) {
            console.error("Fetch error:", error);
            alert(`Error fetching product data`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="danger" />
            </Container>
        );
    }

    return (
        <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>

            <ProductCartBody cartProduct={cartProduct} />
            
            <ProductCartFooter />
        </div>
    );
};