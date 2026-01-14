

export const userNavigation = (navigate, role) => {
    if(role === 'admin') {
        navigate('/admin');
    }
    else if(role === 'seller') {
        navigate('/seller');
    }
    else {
        navigate('/');
    }
}