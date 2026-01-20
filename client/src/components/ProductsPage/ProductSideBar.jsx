import React, { useState, useMemo } from "react";
import { ProductHeaderSort } from "./ProductHeaderSort";
import { ProductGrid } from "./ProductGrid";
import { useParams } from "react-router-dom";

import FilterSection from "./sidebar/FilterSection";
import {CategoryDisplay} from "./sidebar/CategoryDisplay";
import {BrandFilter} from "./sidebar/BrandFilter";

export const ProductSideBar = ({ products = [], onSortChange }) => {
  const { mainCategory, category } = useParams();

  const [openSections, setOpenSections] = useState({ brand: true, color: true, discount: true });
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");

  const discountRanges = useMemo(() => [
    { label: "0 - 10", min: 0, max: 10 },
    { label: "10 - 20", min: 10, max: 20 },
    { label: "20 - 30", min: 20, max: 30 },
    { label: "30 - 40", min: 30, max: 40 },
    { label: "40 - 50", min: 40, max: 50 },
    { label: "50 - 60", min: 50, max: 60 },
    { label: "60 - 70", min: 60, max: 70 },
  ], []);

  const colorPalette = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Grey", "Pink", "Purple", "Brown", "Orange", "Beige", "Navy", "Maroon", "Gold", "Silver", "Multicolor", "Cream", "Teal"];

  const { availableColors, availableBrands, availableDiscounts, filteredProducts } = useMemo(() => {
    const colorMap = {};
    const brandMap = {};
    const discountMap = {};
    discountRanges.forEach(r => { discountMap[r.label] = 0; });

    // Detect colors and filter
    const productsWithMetadata = products.map(p => {
      const searchText = `${p.name} ${p.description || ""}`.toLowerCase();
      let foundColor = p.color || colorPalette.find(c => searchText.includes(c.toLowerCase()));
      return { ...p, detectedColor: foundColor };
    });

    const filtered = productsWithMetadata.filter(p => {
      const matchesDiscount = !selectedDiscount || (p.discount >= selectedDiscount.min && p.discount < selectedDiscount.max);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(p.detectedColor || p.color);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      return matchesDiscount && matchesColor && matchesBrand;
    });

    // Calculate Counts
    productsWithMetadata.forEach(p => {
      if (p.detectedColor) colorMap[p.detectedColor] = (colorMap[p.detectedColor] || 0) + 1;
      if (p.brand) brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      discountRanges.forEach(r => { if (p.discount >= r.min && p.discount < r.max) discountMap[r.label]++; });
    });

    return {
      filteredProducts: filtered,
      availableColors: Object.keys(colorMap).map(n => ({ name: n, count: colorMap[n], hex: n.toLowerCase() === "multicolor" ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)" : n.toLowerCase() })),
      availableBrands: Object.keys(brandMap).map(n => ({ name: n, count: brandMap[n] })),
      availableDiscounts: discountRanges.map(r => ({ ...r, count: discountMap[r.label] })).filter(r => r.count > 0)
    };
  }, [products, selectedDiscount, selectedColors, selectedBrands, discountRanges]);

  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="container-fluid mt-3 bg-white">
      <div className="row">
        <aside className="col-md-3 col-lg-2 border-end px-3 sidebar-filters">
          <CategoryDisplay mainCategory={mainCategory} category={category} totalCount={filteredProducts.length} />

          <FilterSection title="Brand" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
            <BrandFilter 
              brandSearch={brandSearch} onSearchChange={setBrandSearch} 
              availableBrands={availableBrands} selectedBrands={selectedBrands}
              onToggle={(val) => setSelectedBrands(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])}
            />
          </FilterSection>

          <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')}>
            <div className="filter-scroll" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {availableColors.map(color => (
                <div key={color.name} className="form-check small d-flex align-items-center mb-1">
                  <input className="form-check-input rounded-0 me-2 border shadow-none" type="checkbox" checked={selectedColors.includes(color.name)} onChange={() => setSelectedColors(prev => prev.includes(color.name) ? prev.filter(i => i !== color.name) : [...prev, color.name])} />
                  <span className="me-2 border" style={{ width: "14px", height: "14px", background: color.hex, display: "inline-block" }}></span>
                  <label className="form-check-label text-muted flex-grow-1" style={{ cursor: "pointer" }}>{color.name}</label>
                  <span className="text-muted small ms-2">{color.count}</span>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Discount %" isOpen={openSections.discount} onToggle={() => toggleSection('discount')}>
            <div className="filter-scroll" style={{ maxHeight: "150px", overflowY: "auto" }}>
              {availableDiscounts.map(range => (
                <div key={range.label} className="form-check small d-flex align-items-center mb-1">
                  <input className="form-check-input rounded-0 me-2 border shadow-none" type="checkbox" checked={selectedDiscount?.label === range.label} onChange={() => setSelectedDiscount(selectedDiscount?.label === range.label ? null : range)} />
                  <label className="form-check-label text-muted flex-grow-1" style={{ cursor: "pointer" }}>{range.label}</label>
                  <span className="text-muted small ms-2">{range.count}</span>
                </div>
              ))}
            </div>
          </FilterSection>
        </aside>

        <main className="col-md-9 col-lg-10 ps-4">
          <ProductHeaderSort products={filteredProducts} onSortChange={onSortChange} />
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
};