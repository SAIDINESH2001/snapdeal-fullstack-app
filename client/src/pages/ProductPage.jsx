import { useEffect, useState } from "react";
import api from "../services/axios";
import { useParams } from "react-router-dom";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { BreadcrumbAndTrending } from "../components/ProductsPage/BreadCrumb";
import { ProductSideBar } from "../components/ProductsPage/ProductSideBar";
import { ProductHeaderSort } from "../components/ProductsPage/ProductHeaderSort";
import { useAuth } from "../hooks/useAuth";

export const ProductPage = () => {
    const { user } = useAuth();

    const { mainCategory, subCategory, category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get(`/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(category)}`);
            setProducts(res.data.products);
        }
        fetchData();
    }, [mainCategory, subCategory, category]);

    return (
    <>
        <AppNav user={user}/>
        <BreadcrumbAndTrending />
        <ProductSideBar products={products}/>
    </>
)
}


