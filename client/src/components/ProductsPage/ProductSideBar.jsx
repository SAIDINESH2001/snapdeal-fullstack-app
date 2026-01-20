import React, { useState, useMemo } from "react";
import { ProductHeaderSort } from "./ProductHeaderSort";
import { ProductGrid } from "./ProductGrid";
import { useParams } from "react-router-dom";

export const ProductSideBar = ({ products = [], onSortChange }) => {
  const { mainCategory, category } = useParams();

  const [isDiscountOpen, setIsDiscountOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");

  const discountRanges = [
    { label: "0 - 10", min: 0, max: 10 },
    { label: "10 - 20", min: 10, max: 20 },
    { label: "20 - 30", min: 20, max: 30 },
    { label: "30 - 40", min: 30, max: 40 },
    { label: "40 - 50", min: 40, max: 50 },
    { label: "50 - 60", min: 50, max: 60 },
    { label: "60 - 70", min: 60, max: 70 },
  ];

  const colorPalette = [
    "Red",
    "Blue",
    "Black",
    "White",
    "Green",
    "Yellow",
    "Grey",
    "Pink",
    "Purple",
    "Brown",
    "Orange",
    "Beige",
    "Navy",
    "Maroon",
    "Gold",
    "Silver",
    "Multicolor",
    "Cream",
    "Teal",
  ];

  const {
    availableColors,
    availableBrands,
    availableDiscounts,
    filteredProducts,
  } = useMemo(() => {
    const colorMap = {};
    const brandMap = {};
    const discountMap = {};
    discountRanges.forEach((range) => {
      discountMap[range.label] = 0;
    });

    const productsWithDetectedColor = products.map((p) => {
      const searchText = `${p.name} ${p.description || ""}`.toLowerCase();
      let foundColor = p.color;
      if (!foundColor) {
        foundColor = colorPalette.find((color) =>
          searchText.includes(color.toLowerCase()),
        );
      }
      return { ...p, detectedColor: foundColor };
    });

    const filtered = productsWithDetectedColor.filter((p) => {
      const matchesDiscount =
        !selectedDiscount ||
        (p.discount >= selectedDiscount.min &&
          p.discount < selectedDiscount.max);
      const matchesColor =
        selectedColors.length === 0 ||
        selectedColors.includes(p.detectedColor || p.color);
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      return matchesDiscount && matchesColor && matchesBrand;
    });

    productsWithDetectedColor.forEach((p) => {
      if (p.detectedColor) {
        colorMap[p.detectedColor] = (colorMap[p.detectedColor] || 0) + 1;
      }
      if (p.brand) {
        brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      }
      const d = p.discount || 0;
      discountRanges.forEach((range) => {
        if (d >= range.min && d < range.max) {
          discountMap[range.label]++;
        }
      });
    });

    return {
      filteredProducts: filtered,
      availableColors: Object.keys(colorMap).map((name) => ({
        name,
        count: colorMap[name],
        hex:
          name.toLowerCase() === "multicolor"
            ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
            : name.toLowerCase(),
      })),
      availableBrands: Object.keys(brandMap).map((name) => ({
        name,
        count: brandMap[name],
      })),
      availableDiscounts: discountRanges
        .map((range) => ({ ...range, count: discountMap[range.label] }))
        .filter((r) => r.count > 0),
    };
  }, [products, selectedDiscount, selectedColors, selectedBrands]);

  const handleToggle = (item, list, setList) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  return (
    <div className="container-fluid mt-3 bg-white">
      <div className="row">
        <aside className="col-md-3 col-lg-2 border-end px-3 sidebar-filters">
          <div className="mb-4 pb-2 border-bottom">
            <h6 className="fw-bold mb-3" style={{ fontSize: "14px" }}>
              Category
            </h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: "13px" }}>
              <li className="mb-2 d-flex align-items-center">
                {mainCategory && (
                  <>
                    <span
                      className="text-muted me-2"
                      style={{ fontSize: "20px", lineHeight: "0" }}
                    >
                      −
                    </span>
                    <span className="text-dark" style={{ fontWeight: "500" }}>
                      {mainCategory}
                    </span>
                  </>
                )}
              </li>
              <li className="ps-3 mb-2 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span
                    className="text-muted me-2"
                    style={{ fontSize: "20px", lineHeight: "0" }}
                  >
                    −
                  </span>
                  <span className="text-danger fw-bold">{category}</span>
                </div>
                <span className="text-muted" style={{ fontSize: "11px" }}>
                  {filteredProducts.length}
                </span>
              </li>
            </ul>
          </div>

          <div className="mb-4 pb-2 border-bottom">
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIsBrandOpen(!isBrandOpen)}
            >
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>
                Brand
              </h6>
              <span className="fw-bold text-muted">
                {isBrandOpen ? "−" : "+"}
              </span>
            </div>
            {isBrandOpen && (
              <>
                <div className="input-group input-group-sm mb-2 border-bottom">
                  <input
                    type="text"
                    className="form-control border-0 shadow-none px-0"
                    placeholder="Search by Brand"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    style={{ fontSize: "12px" }}
                  />
                  <span className="input-group-text bg-white border-0">
                    <span
                      className="material-symbols-outlined text-muted"
                      style={{ fontSize: "16px" }}
                    >
                      search
                    </span>
                  </span>
                </div>
                <div
                  className="filter-scroll"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {availableBrands
                    .filter((b) =>
                      b.name.toLowerCase().includes(brandSearch.toLowerCase()),
                    )
                    .map((brand) => (
                      <div
                        key={brand.name}
                        className="form-check small d-flex align-items-center mb-1"
                      >
                        <input
                          className="form-check-input rounded-0 me-2 border shadow-none"
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() =>
                            handleToggle(
                              brand.name,
                              selectedBrands,
                              setSelectedBrands,
                            )
                          }
                        />
                        <label
                          className="form-check-label text-muted flex-grow-1"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleToggle(
                              brand.name,
                              selectedBrands,
                              setSelectedBrands,
                            )
                          }
                        >
                          {brand.name}
                        </label>
                        <span className="text-muted small ms-2">
                          {brand.count}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>

          <div className="mb-4 pb-2 border-bottom">
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIsColorOpen(!isColorOpen)}
            >
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>
                Color
              </h6>
              <span className="fw-bold text-muted">
                {isColorOpen ? "−" : "+"}
              </span>
            </div>
            {isColorOpen && (
              <div
                className="filter-scroll"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {availableColors.length > 0 ? (
                  availableColors.map((color) => (
                    <div
                      key={color.name}
                      className="form-check small d-flex align-items-center mb-1"
                    >
                      <input
                        className="form-check-input rounded-0 me-2 border shadow-none"
                        type="checkbox"
                        checked={selectedColors.includes(color.name)}
                        onChange={() =>
                          handleToggle(
                            color.name,
                            selectedColors,
                            setSelectedColors,
                          )
                        }
                      />
                      <span
                        className="me-2 border"
                        style={{
                          width: "14px",
                          height: "14px",
                          background: color.hex,
                          display: "inline-block",
                        }}
                      ></span>
                      <label
                        className="form-check-label text-muted flex-grow-1"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleToggle(
                            color.name,
                            selectedColors,
                            setSelectedColors,
                          )
                        }
                      >
                        {color.name}
                      </label>
                      <span className="text-muted small ms-2">
                        {color.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="small text-muted ps-2">
                    No colors detected
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-4 pb-2 border-bottom">
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIsDiscountOpen(!isDiscountOpen)}
            >
              <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>
                Discount %
              </h6>
              <span className="fw-bold text-muted">
                {isDiscountOpen ? "−" : "+"}
              </span>
            </div>
            {isDiscountOpen && (
              <div
                className="filter-scroll"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {availableDiscounts.map((range) => (
                  <div
                    key={range.label}
                    className="form-check small d-flex align-items-center mb-1"
                  >
                    <input
                      className="form-check-input rounded-0 me-2 border shadow-none"
                      type="checkbox"
                      checked={selectedDiscount?.label === range.label}
                      onChange={() =>
                        setSelectedDiscount(
                          selectedDiscount?.label === range.label
                            ? null
                            : range,
                        )
                      }
                    />
                    <label
                      className="form-check-label text-muted flex-grow-1"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedDiscount(
                          selectedDiscount?.label === range.label
                            ? null
                            : range,
                        )
                      }
                    >
                      {range.label}
                    </label>
                    <span className="text-muted small ms-2">{range.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="col-md-9 col-lg-10 ps-4">
          <ProductHeaderSort
            products={filteredProducts}
            onSortChange={onSortChange}
          />
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
};
