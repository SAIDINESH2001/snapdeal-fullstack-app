import { useEffect, useState, useCallback } from "react";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { ProductSummaryBreadCrumb } from "../components/ProductSummaryPage/ProductSummaryBreadCrumb";
import { ProductDetails } from "../components/ProductSummaryPage/ProductSummaryMain";
import { ProductTabs } from "../components/ProductSummaryPage/ProductSummarySection";
import api from "../services/axios";
import { useParams } from "react-router-dom";
import { ReviewsSection } from "../components/ProductSummaryPage/ReviewSection";
import { ProductCartFooter } from "../components/ProductCart/ProductCartFooter";

export const ProductSummaryPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.product);
    } catch (err) {
      console.error("Error Fetching Product", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading Product...</div>;
if (!product) return <div>Product not found.</div>;
  return (
    <>
      <AppNav />
      <ProductSummaryBreadCrumb product={product} loading={loading}/>
      <ProductDetails product={product} loading={loading}/>
      <ProductTabs product={product} loading={loading}/>
      <ReviewsSection product={product} />
      <ProductCartFooter />
    </>
  );
};
