import { useEffect, useState, useMemo } from "react";
import api from "../services/axios";
import { useParams, useLocation } from "react-router-dom";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { BreadcrumbAndTrending } from "../components/ProductsPage/BreadCrumb";
import { ProductSideBar } from "../components/ProductsPage/ProductSideBar";
import { useAuth } from "../hooks/useAuth";

export const ProductPage = () => {
    const { user } = useAuth();
    const { mainCategory, subCategory, category, keyword } = useParams();
    const { pathname, search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const searchQuery = queryParams.get("q");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("popularity");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url;
                if (searchQuery) {
                    url = `/products/search?keyword=${encodeURIComponent(searchQuery)}`;
                } 
                else if (pathname.includes('/trending/')) {
                    url = `/products/trending/${encodeURIComponent(keyword)}`;
                }
                else if (mainCategory && !subCategory) {
                    url = `/products/mainCategory/${encodeURIComponent(mainCategory)}`;
                } 
                else {
                    const sub = subCategory || "all";
                    const cat = category || "all";
                    url = `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(sub)}/${encodeURIComponent(cat)}`;
                }

                const res = await api.get(url);
                const fetchedData = res.data.products || res.data.data || [];
                setProducts(fetchedData);
            } catch (error) {
                console.error("Fetch Error:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mainCategory, subCategory, category, keyword, searchQuery, pathname]);

    const sortedProducts = useMemo(() => {
        let items = [...products];
        if (sortType === "lowToHigh") return items.sort((a, b) => a.sellingPrice - b.sellingPrice);
        if (sortType === "highToLow") return items.sort((a, b) => b.sellingPrice - a.sellingPrice);
        return items;
    }, [products, sortType]);

    return (
        <>
            <AppNav user={user}/>
            <BreadcrumbAndTrending />
            {loading ? (
                <div className="text-center p-5"><h4>Searching for products...</h4></div>
            ) : products.length > 0 ? (
                <ProductSideBar products={sortedProducts} onSortChange={setSortType} />
            ) : (
                <div className="text-center p-5"><h4>No products found</h4></div>
            )}
        </>
    );
};