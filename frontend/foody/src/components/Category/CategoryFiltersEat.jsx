import React from "react";

const CategoryFiltersEat = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div
      className="d-flex align-items-center bg-light border-bottom px-3"
      style={{
        justifyContent: "space-between", // Ensure spacing between elements
        height: "50px", // Adjust height to match the design
      }}
    >
      {/* Categories Section */}
      <div className="d-flex flex-grow-1" style={{ overflowX: "auto" }}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn text-decoration-none px-3 py-1 ${
              activeCategory === category
                ? "text-danger fw-bold border-bottom border-danger"
                : "text-dark"
            }`}
            onClick={() => setActiveCategory(category)}
            style={{
              border: "none", // Remove button border
              background: "none", // Transparent background
              fontSize: "14px", // Adjust font size
              whiteSpace: "nowrap", // Prevent wrapping
              transition: "all 0.3s ease",
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFiltersEat;
