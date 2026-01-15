import { useEffect, useState, useCallback } from "react";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { ProductSummaryBreadCrumb } from "../components/ProductSummaryPage/ProductSummaryBreadCrumb";
import { ProductDetails } from "../components/ProductSummaryPage/ProductSummaryMain";
import { ProductTabs } from "../components/ProductSummaryPage/ProductSummarySection";
import api from "../services/axios";
import { useParams } from "react-router-dom";
import { ReviewsSection } from "../components/ProductSummaryPage/reviewSection";

export const ProductSummaryPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error("Error Fetching Product", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <>
      <AppNav />
      <ProductSummaryBreadCrumb product={product} loading={loading}/>
      <ProductDetails product={product} loading={loading}/>
      <ProductTabs product={product} loading={loading}/>
      <ReviewsSection product={product} />
    </>
  );
};
