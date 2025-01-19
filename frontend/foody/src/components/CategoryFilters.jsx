import React from "react";

const CategoryFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  filters,
  filtersState,
  setFiltersState,
}) => {
  return (
    <div
      className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between flex-wrap mb-3 bg-white p-3 border"
    >
      {/* Categories Section */}
      <div className="d-flex flex-wrap mb-2 mb-md-0">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn btn-link text-decoration-none ${
              activeCategory === category
                ? "text-danger fw-bold border-bottom border-danger"
                : "text-dark"
            }`}
            onClick={() => setActiveCategory(category)}
            style={{
              paddingBottom: "5px", // Bottom padding for the button
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="d-flex flex-wrap gap-3">
        {filters.map((filter, index) => (
          <select
            key={index}
            className="form-select w-auto"
            value={filtersState[index]}
            onChange={(e) =>
              setFiltersState((prev) => {
                const newFilters = [...prev];
                newFilters[index] = e.target.value;
                return newFilters;
              })
            }
          >
            <option>{filter}</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
          </select>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
