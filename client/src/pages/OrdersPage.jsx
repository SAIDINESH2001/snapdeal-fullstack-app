import { AppNav } from "../components/common/ApplicationNavBar/AppNav"
import { ProductCartFooter } from "../components/ProductCart/ProductCartFooter"
import { OrdersPageMain } from "../components/OrdersPage/OrdersPageMain"

export const OrdersPage = () => {
    return (
        <>
            <AppNav />
            <OrdersPageMain />
            <ProductCartFooter />
        </>
    )
}