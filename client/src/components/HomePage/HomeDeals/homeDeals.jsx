import { Link, useNavigate } from "react-router-dom";
import { deals } from "./homeDealService";

export const HomeDeal = () => {
  const navigate = useNavigate();

  const handleDealClick = (deal) => {
    if(deal.productType) {
      navigate(`/products/${encodeURIComponent(deal.productMainCategory)}/${encodeURIComponent(deal.subCategory)}/${encodeURIComponent(deal.productType)}`); 
    }
    else navigate(`/products/${encodeURIComponent(deal.productMainCategory)}/${encodeURIComponent(deal.subCategory)}`);
  };

  return (
    <>
      <div style={{ fontSize: '40px' }} className="fw-bolder w-100 text-center">
        Deal Of The Day
      </div>
      <div className="d-flex px-5 w-100 justify-content-between mt-3 mb-4">
        {deals && deals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => handleDealClick(deal)} 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={deal.image} 
              alt={deal.name} 
              width={200} 
              height={300} 
              className="object-fit-cover shadow-sm rounded"
            />
            <div className="text-center mt-2 fw-bold" style={{ fontSize: '14px' }}>
              {deal.name}
            </div>
          </div>
        ))}
      </div>
      <div 
        className="d-flex px-5 w-100 mt-3 mb-4" 
        onClick={() => navigate(`/products/search?q=Campus`)}
        style={{ cursor: 'pointer' }}
      >
        <img src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/campusshoeswebpagebanner.jpg" alt="" />
      </div>
      <Link className="d-flex px-5 w-100 mt-3 mb-4" target="blank" to={'https://play.google.com/store/apps/details?id=com.snapdeal.main'}><img  className="border border-dark w-100 " src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/appdownloadbannerhomeweb_4.jpg" alt="" /></Link>
    </>
  );
};