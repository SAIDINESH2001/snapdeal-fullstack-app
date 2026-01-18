

export const ProductSummaryBreadCrumb = ({product, loading}) => {
        if (loading || !product) return null;
       return (
        <>  
            <div className="mt-3 ms-5"><span>{product.genderCategory} / </span><span>{product.productMainCategory} / </span><span>{product.subCategory} / </span><span className="fw-bold">{product.name}</span></div>
        </>
       )
}