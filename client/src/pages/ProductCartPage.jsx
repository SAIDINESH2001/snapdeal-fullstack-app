import {AppNav} from '../components/common/ApplicationNavBar/AppNav';
import { useAuth } from '../hooks/useAuth';
import { ProductCartMain } from '../components/ProductCart/ProductCartMain';

export const ProductCartPage = () => {
    const { user } = useAuth();
    return (
        <>
            <AppNav user={user}/> 
            <ProductCartMain />
        </>
    )
}