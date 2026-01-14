import React from "react";
import { ProductHeaderSort } from "./ProductHeaderSort";
import { ProductGrid } from "./ProductGrid";

export const ProductSideBar = ({products}) => {
  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <aside className="col-md-3 col-lg-2 border-end px-4">
          <div className="mb-4">
            <h6 className="fw-bold">- Men’s Clothing</h6>
            <ul className="list-unstyled ms-2">
              <li className="text-danger"> - Shirts For Men <span className="text-muted float-end">31507</span></li>
              <li className='ms-3 mt-2' style={{fontSize: '12px'}} >Casual Shirts For Men <span className="text-muted float-end">26849</span></li>
              <li className='ms-3' style={{fontSize: '12px'}}>Formal Shirts For Men <span className="text-muted float-end">4658</span></li>
            </ul>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold ms-2">Price</h6>
            <input type="range" name="price" id="price" className="ms-2 w-100"/>
            <div className="d-flex justify-content-between small mb-2 ms-2">
              <span>Rs. 179</span>
              <span>Rs. 1482</span>
            </div>
            <div className="d-flex gap-2 ms-2">
              <input className="form-control form-control-sm" placeholder="Rs. 179" />
              <input className="form-control form-control-sm" placeholder="Rs. 1482" />
              <button className="btn btn-outline-dark btn-sm">GO</button>
            </div>
          </div>

          <div className="mb-4 ms-2">
            <h6 className="fw-bold">Customer Rating</h6>
            {[4,3,2,1].map(r => (
              <div key={r} className="form-check small">
                <input className="form-check-input" type="radio" />
                <label className="form-check-label">
                  {"★".repeat(r)}{"☆".repeat(5-r)} & Up
                </label>
              </div>
            ))}
          </div>
        </aside>
        <main className="col-md-9 col-lg-10">
            <ProductHeaderSort products={products}/>
            <ProductGrid products={products} />
        </main>
      </div>

    </div>
  );
};
