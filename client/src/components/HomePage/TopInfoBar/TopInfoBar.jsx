import { Link } from "react-router-dom";
import { Bar } from "../../../styles/HomePage/topInfoBar.style";
import { topInfoItems } from "./TopInfoBar.config";

export default function TopInfoBar() {

  return (
    <Bar>
      <div className="container-fluid h-100 px-0">
        <div className="d-flex justify-content-between align-items-center h-100 px-2">
          <div className="d-flex align-items-center gap-2">
            <span>FREE Delivery</span>
            <span className="text-muted fw-normal">|</span>
            <span>7 Days Easy Returns</span>
            <span className="text-muted fw-normal">|</span>
            <span>Best Prices</span>
          </div>

          <div className="d-flex align-items-center">
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
