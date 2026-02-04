import { Link } from "react-router-dom";
import { Bar } from "../../../styles/HomePage/topInfoBar.style";
import { topInfoItems } from "./TopInfoBar.config";

export default function TopInfoBar() {

  return (
    <Bar>
      <div className="w-100 h-100 px-0">
        <div className="d-flex flex-wrap justify-content-between align-items-center h-100 px-2 px-md-4 gap-2">
          <div className="d-flex align-items-center gap-1 gap-md-2 flex-wrap">
            <span>FREE Delivery</span>
            <span className="text-muted fw-normal d-none d-sm-inline">|</span>
            <span className="d-none d-sm-inline">7 Days Easy Returns</span>
            <span className="text-muted fw-normal d-none d-md-inline">|</span>
            <span className="d-none d-md-inline">Best Prices</span>
          </div>

          <div className="d-none d-lg-flex align-items-center">
            {topInfoItems.map((item, index) => {
              return (
                <Link to={item.path} className="d-flex text-decoration-none align-items-center justify-content-start ms-4 text-dark" key={index} target="_blank">
                    <span className="material-symbols-outlined">{item.svgName}</span>
                    <span className="ms-2 fw-medium">{item.itemText}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Bar>
  );
}
