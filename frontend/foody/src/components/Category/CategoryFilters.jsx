import { useAppSelector } from "../../redux/hooks";
const CategoryFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  filters,
  filtersState,
  setFiltersState,
}) => {
  const subCategories = useAppSelector(
    (state) => state.resourceFilter.subCategories
  );

  const cuisines = useAppSelector((state) => state.resource.cuisines);
  const districts = useAppSelector((state) => state.resourceFilter.districts);

  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between flex-wrap mb-3 bg-white p-3 border">
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
            onClick={() => {
              setActiveCategory(category);
            }}
            style={{
              paddingBottom: "5px", // Bottom padding for the button
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="d-flex flex-wrap gap-3" style={{ marginTop: "16px" }}>
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
            {filter === "- Danh mục -" &&
              subCategories &&
              subCategories.length > 0 &&
              subCategories.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.name}
                </option>
              ))}
            ?
            {filter === "- Ẩm thực -" &&
              cuisines &&
              cuisines.length > 0 &&
              cuisines.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.name}
                </option>
              ))}
            :
            {filter === "- Quận/Huyện -" &&
              districts &&
              districts.length > 0 &&
              districts.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.name}
                </option>
              ))}
          </select>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
