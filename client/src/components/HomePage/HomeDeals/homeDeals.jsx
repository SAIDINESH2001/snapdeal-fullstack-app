import { Link, useNavigate } from "react-router-dom";
import { deals } from "./homeDealService";

export const HomeDeal = () => {
  const navigate = useNavigate();

  const handleDealClick = (deal) => {
    if (deal.productType) {
      navigate(
        `/products/${encodeURIComponent(deal.productMainCategory)}/${encodeURIComponent(deal.subCategory)}/${encodeURIComponent(deal.productType)}`,
      );
    } else
      navigate(
        `/products/${encodeURIComponent(deal.productMainCategory)}/${encodeURIComponent(deal.subCategory)}`,
      );
  };

  return (
    <>
      <div
        style={{ fontSize: "clamp(24px, 5vw, 40px)" }}
        className="fw-bolder w-100 text-center mb-3 px-2"
      >
        Deal Of The Day
      </div>
      <div className="px-2 px-md-4 w-100 mt-3 mb-4">
        <div className="row g-2 g-md-3">
          {deals &&
            deals.map((deal) => (
              <div
                key={deal.id}
                className="col-6 col-sm-4 col-md-3 col-lg-2"
                onClick={() => handleDealClick(deal)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  width={200}
                  height={300}
                  className="w-100 object-fit-cover shadow-sm rounded"
                  style={{aspectRatio: "2/3"}}
                />
                <div
                  className="text-center mt-2 fw-bold"
                  style={{ fontSize: "clamp(11px, 2vw, 14px)" }}
                >
                  {deal.name}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div
        className="d-flex px-4 w-100 mt-3 mb-4"
        onClick={() => navigate(`/products/search?q=Campus`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/campusshoeswebpagebanner.jpg"
          alt=""
          className="w-100"
        />
      </div>
      <Link
        className="d-flex px-4 w-100 mt-3 mb-4"
        target="blank"
        to={"https://play.google.com/store/apps/details?id=com.snapdeal.main"}
      >
        <img
          className="border border-dark w-100 "
          src="https://g.sdlcdn.com/imgs/a/b/c/sdtv/appdownloadbannerhomeweb_4.jpg"
          alt=""
        />
      </Link>
    </>
  );
};
