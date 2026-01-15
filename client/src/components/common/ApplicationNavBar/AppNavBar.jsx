import { useAuth } from "../../../hooks/useAuth";
import {Link} from 'react-router-dom';

export const MainNavbar = () => {
  const {user, logout} = useAuth();
  return (
    <nav className="py-1" style={{backgroundColor: '#E40046'}}>
      <div className="container-fluid d-flex align-items-center gap-4 px-5">
        <div className="d-flex align-items-center gap-3 text-white fw-bold fs-4">
          <Link to={user?.role === 'seller' ? '/seller' : '/'}><img src="/snapdeal-white.png" alt="Logo" width={150} height={30} style={{objectFit : "cover"}}/></Link>
          <span className="btn fs-3 text-white"><span className="material-symbols-outlined">menu</span></span>
        </div>

        <div className="flex-grow-1">
          <div className="input-group w-75">
            <input
              type="text" 
              className="form-control px-3 border border-none"
              style={{boxShadow: 'none'}}
              placeholder="Search products & brands"
            />
            <button className="btn btn-dark px-4">Search</button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-4 text-white">
          {user?.role === 'customer' ?  (
                      <div className="btn text-light d-flex align-items-center gap-2">
            <span>Cart</span>
            <span className="material-symbols-outlined">shopping_cart</span>
          </div>
          ) : (<div className="btn text-light d-flex align-items-center gap-2" onClick={logout}>
            <span>Log Out</span>
            <span className="material-symbols-outlined">logout</span>
          </div>)}


          <div className="btn text-light d-flex align-items-center gap-2">
            <span>{user && user.name || 'Profile'}</span>
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
