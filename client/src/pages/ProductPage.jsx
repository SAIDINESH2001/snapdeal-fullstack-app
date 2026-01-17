import { useEffect, useState, useMemo } from "react";
import api from "../services/axios";
import { useParams, useLocation } from "react-router-dom";
import { AppNav } from "../components/common/ApplicationNavBar/AppNav";
import { BreadcrumbAndTrending } from "../components/ProductsPage/BreadCrumb";
import { ProductSideBar } from "../components/ProductsPage/ProductSideBar";
import { useAuth } from "../hooks/useAuth";

export const ProductPage = () => {
    const { user } = useAuth();
    const { mainCategory, subCategory, category } = useParams();
    const { search } = useLocation();
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
                } else {
                    url = `/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(category)}`;
                }

                const res = await api.get(url);
                setProducts(res.data.products);
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mainCategory, subCategory, category, searchQuery]); 
    const sortedProducts = useMemo(() => {
        let items = [...products]; 
        if (sortType === "lowToHigh") {
            return items.sort((a, b) => a.sellingPrice - b.sellingPrice);
        }
        if (sortType === "highToLow") {
            return items.sort((a, b) => b.sellingPrice - a.sellingPrice);
        }
        return items; 
    }, [products, sortType]);

    return (
        <>
            <AppNav user={user}/>
            <BreadcrumbAndTrending />
            {loading ? (
                <div className="text-center p-5"><h4>Searching for products...</h4></div>
            ) : products.length > 0 ? (
                <ProductSideBar 
                    products={sortedProducts} 
                    onSortChange={setSortType} 
                />
            ) : (
                <div className="text-center p-5">
                    <h4>No products found {searchQuery ? `for "${searchQuery}"` : ""}</h4>
                    <p>Try checking your spelling or using more general terms.</p>
                </div>
            )}
        </>
    );
};