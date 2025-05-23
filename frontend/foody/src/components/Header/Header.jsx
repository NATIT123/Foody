import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaBell, FaFilter } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
import "../../css/Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Badge, Popover, Empty } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { Form } from "react-bootstrap";
import { changeMode } from "../../redux/theme/theme.slice";
import { fetchResource } from "../../utils/fetchResource";
import {
  setSelectedCuisines,
  setSelectedDistricts,
  setSelectedSubCategories,
  resetFilters,
} from "../../redux/resource/resourceFilterSlice";
import {
  setSelectedCategory,
  setSelectedCity,
} from "../../redux/resource/resourceDataSlice";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../../redux/notification/notificationSlice";
import { callRestaurantsByFields } from "../../services/api";
function Header(props) {
  const [showNotifications, setShowNotifications] = useState(false); // State để hiển thị thông báo
  const [showFilter, setShowFilter] = useState(false); // Hiển thị dropdown bộ lọc
  const [activeTab, setActiveTab] = useState("Khu vực");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefSearch = useRef(null);
  const [restaurantSearch, setRestaurantSearch] = useState([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state) => state.order.carts);
  const user = useAppSelector((state) => state.account.user);
  const mode = useAppSelector((state) => state.app.mode);
  const cities = useAppSelector((state) => state.resource.cities);
  const categories = useAppSelector((state) => state.resource.categories);
  const cuisines = useAppSelector((state) => state.resource.cuisines);
  const selectedCity = useAppSelector((state) => state.resource.selectedCity);
  const selectedCategory = useAppSelector(
    (state) => state.resource.selectedCategory
  );
  const districts = useAppSelector((state) => state.resourceFilter.districts);
  const subCategories = useAppSelector(
    (state) => state.resourceFilter.subCategories
  );
  const selectedCuisines = useAppSelector(
    (state) => state.resourceFilter.selectedCuisines
  );
  const selectedSubCategories = useAppSelector(
    (state) => state.resourceFilter.selectedSubCategories
  );
  const selectedDistricts = useAppSelector(
    (state) => state.resourceFilter.selectedDistricts
  );
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const unreadExists = useAppSelector(
    (state) => state.notification.unreadExists
  );

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  useEffect(() => {
    dispatch(
      fetchResource({
        url: `${process.env.REACT_APP_BASE_URL}/city/getAllCity`,
        type: "cities",
        cacheKey: "cities",
      })
    );

    dispatch(
      fetchResource({
        url: `${process.env.REACT_APP_BASE_URL}/category/getAllCategory`,
        type: "categories",
        cacheKey: "categories",
      })
    );

    dispatch(
      fetchResource({
        url: `${process.env.REACT_APP_BASE_URL}/cuisines/getAllCuisines`,
        type: "cuisines",
        cacheKey: "cuisines",
      })
    );
  }, []);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchNotifications(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (selectedCity) {
      dispatch(
        fetchResource({
          url: `${process.env.REACT_APP_BASE_URL}/district/getDistrictsByCity/${selectedCity._id}`,
          type: "districts",
        })
      );
    }
  }, [selectedCity]);

  // Fetch SubCategories khi Category thay đổi
  useEffect(() => {
    if (selectedCategory) {
      dispatch(
        fetchResource({
          url: `${process.env.REACT_APP_BASE_URL}/subCategory/getSubCategoryByCategory/${selectedCategory._id}`,
          type: "subCategories",
        })
      );
    }
  }, [selectedCategory]);
  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {carts?.map((food) => {
            return (
              <div className="book" key={food?.detail._id}>
                <img src={food.detail.image} alt={food?.detail.name || ""} />
                <div>{food?.detail?.name}</div>
                <div className="price">
                  {food?.detail.priceDiscount === "empty"
                    ? food.detail.priceOriginal
                    : food.detail.priceDiscount}
                </div>
              </div>
            );
          })}
        </div>
        {carts.length > 0 ? (
          <div className="pop-cart-footer">
            <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </div>
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefSearch.current &&
        !dropdownRefSearch.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRestaurantsByFields = async () => {
      try {
        const res = await callRestaurantsByFields(props.searchQuery, {
          selectedCity: selectedCity?._id || "",
          selectedCategory: selectedCategory?._id || "",
          subCategory: selectedSubCategories,
          cuisines: selectedCuisines,
          district: selectedDistricts,
        });
        const data = res.data;
        if (res.status === "success") {
          setRestaurantSearch(data.data);
        }
      } catch (err) {
        toast.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurantsByFields();
  }, [
    props.searchQuery,
    selectedCuisines,
    selectedDistricts,
    selectedSubCategories,
    selectedCategory,
    selectedCity,
  ]);
  const handleSelectRestaurant = (restaurant) => {
    props.setSearchQuery(restaurant.name); // Gán tên nhà hàng vào ô tìm kiếm
    setShowDropdown(false); // Đóng dropdown sau khi chọn
  };

  // Xử lý toggle chọn/bỏ chọn quận/huyện
  const toggleDistrict = (districtId) => {
    const currentDistricts = selectedDistricts || [];
    const isSelected = currentDistricts.includes(districtId);
    const updatedDistricts = isSelected
      ? currentDistricts.filter((id) => id !== districtId)
      : [...currentDistricts, districtId];

    dispatch(setSelectedDistricts(updatedDistricts));
  };

  const toggleCuisines = (cuisinesId) => {
    const currentCuisines = selectedCuisines || [];
    const isSelected = currentCuisines.includes(cuisinesId);
    const updatedCuisines = isSelected
      ? currentCuisines.filter((id) => id !== cuisinesId)
      : [...currentCuisines, cuisinesId];

    dispatch(setSelectedCuisines(updatedCuisines));
  };

  const toggleSubCategories = (subCategoryId) => {
    const currentSubCategories = selectedSubCategories || [];
    const isSelected = currentSubCategories.includes(subCategoryId);
    const updatedSubCategories = isSelected
      ? currentSubCategories.filter((id) => id !== subCategoryId)
      : [...currentSubCategories, subCategoryId];

    dispatch(setSelectedSubCategories(updatedSubCategories));
  };

  const handleToggleNotifications = () => {
    console.log("Toogle");
    if (showNotifications && unreadExists && user._id) {
      dispatch(markAllNotificationsAsRead(user._id));
    }

    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const timeAgo = (timestamp) => {
    const givenTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - givenTime) / 1000); // Chênh lệch (giây)

    if (timeDifference < 60) return `${timeDifference} giây trước`;
    if (timeDifference < 3600)
      return `${Math.floor(timeDifference / 60)} phút trước`;
    if (timeDifference < 86400)
      return `${Math.floor(timeDifference / 3600)} giờ trước`;

    return `${Math.floor(timeDifference / 86400)} ngày trước`;
  };
  return (
    <>
      {/* Header Section */}
      <header
        className=" position-sticky container-fluid header border-bottom bg-light position-sticky top-0"
        style={{ zIndex: 1020 }}
      >
        <div className="row align-items-center py-2">
          {/* Left Section */}
          <div className="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0">
            <a href="/" className="text-decoration-none">
              {" "}
              <img
                src="https://www.foody.vn/style/images/logo/foody-vn.png"
                alt="Logo"
                className="me-3"
                style={{ height: "30px", cursor: "pointer" }}
              />
            </a>

            <div className="d-flex align-items-center">
              {/* Dropdown Thành phố */}
              <div className="dropdown me-2">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropdownCity"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCity && selectedCity.name}{" "}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownCity"
                  style={{
                    maxHeight: "200px", // Chiều cao tối đa
                    overflowY: "auto", // Thanh cuộn dọc nếu nội dung vượt quá chiều cao
                  }}
                >
                  {cities &&
                    cities.length > 0 &&
                    cities.map((city) => (
                      <li key={city._id}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            dispatch(
                              setSelectedCity({
                                _id: city._id,
                                name: city.name,
                              })
                            )
                          }
                        >
                          {city.name}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Dropdown Loại hình */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropdownCategory"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory && selectedCategory.name}{" "}
                  {/* Hiển thị tên category được chọn */}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownCategory"
                >
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category) => (
                      <li key={category._id}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            dispatch(
                              setSelectedCategory({
                                _id: category._id,
                                name: category.name,
                              })
                            )
                          }
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="col-12 col-md-4 d-flex justify-content-center mb-2 mb-md-0">
            <div
              ref={dropdownRefSearch}
              className="input-group position-relative"
              style={{ maxWidth: "450px", width: "100%" }}
            >
              {/* Ô tìm kiếm */}
              <input
                type="text"
                className="form-control"
                placeholder="Địa điểm, tên nhà hàng ..."
                value={props.searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                style={{
                  borderRadius: "8px 0 0 8px",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              {showDropdown && (
                <div
                  className="dropdown-menu show p-3"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    maxWidth: "100%",
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1050,
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    marginTop: "8px",
                  }}
                >
                  {/* Nội dung dropdown */}
                  <div>
                    <p className="mb-2 fw-bold">🔍 Gợi ý nhà hàng:</p>
                    <ul className="list-unstyled">
                      {restaurantSearch.map((restaurant, index) => (
                        <li
                          key={restaurant._id}
                          className="d-flex align-items-center p-2 border-bottom"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectRestaurant(restaurant)}
                        >
                          {/* Hình ảnh nhà hàng */}
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px",
                              marginRight: "12px",
                              objectFit: "cover",
                            }}
                          />
                          {/* Thông tin nhà hàng */}
                          <div>
                            <a
                              href={`/details/${restaurant._id}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {" "}
                              <p className="mb-1 fw-semibold">
                                {restaurant.name}
                              </p>
                            </a>

                            <p
                              className="mb-0 text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              📍 {restaurant.address}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Nút Bộ lọc */}
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => setShowFilter(!showFilter)}
                style={{
                  borderRadius: "0 8px 8px 0",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <i className="bi bi-filter" style={{ marginRight: "4px" }}></i>
                <FaFilter /> Bộ lọc
              </button>

              {/* Dropdown Bộ lọc */}
              {showFilter && (
                <div
                  className="dropdown-menu show p-3"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    maxWidth: "100%",
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1050,
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    marginTop: "8px",
                    paddingBottom: "60px",
                  }}
                >
                  {/* Nội dung Dropdown */}
                  <div className="row">
                    {/* Cột bên trái: Tiêu đề */}
                    <div className="col-12 col-md-4">
                      <div
                        className={`d-flex align-items-center border-bottom pb-2 mb-3 ${
                          activeTab === "Khu vực" ? "text-primary" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#444",
                        }}
                        onClick={() => setActiveTab("Khu vực")}
                      >
                        <MdLocationOn
                          style={{ fontSize: "18px", color: "#007bff" }}
                        />

                        <span>Khu vực</span>
                      </div>
                      <div
                        className={`d-flex align-items-center border-bottom pb-2 mb-3 ${
                          activeTab === "Ẩm thực" ? "text-success" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#444",
                        }}
                        onClick={() => setActiveTab("Ẩm thực")}
                      >
                        <PiBowlFoodFill
                          style={{ fontSize: "18px", color: "#28a745" }}
                        />

                        <span>Ẩm thực</span>
                      </div>
                      <div
                        className={`d-flex align-items-center border-bottom pb-2 mb-3 ${
                          activeTab === "Phân loại" ? "text-warning" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#444",
                        }}
                        onClick={() => setActiveTab("Phân loại")}
                      >
                        <BiCategoryAlt
                          style={{ fontSize: "18px", color: "#ffc107" }}
                        />

                        <span>Phân loại</span>
                      </div>
                    </div>

                    {/* Cột bên phải */}
                    <div className="col-12 col-md-8">
                      {activeTab === "Khu vực" && (
                        <div className="row mb-3">
                          {districts &&
                            districts.length > 0 &&
                            districts.map((district) => (
                              <div
                                key={district._id}
                                className="col-6 col-sm-6 col-md-6 mb-2"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`district-${district._id}`}
                                    checked={
                                      selectedDistricts &&
                                      selectedDistricts.includes(district._id)
                                    }
                                    onChange={() =>
                                      toggleDistrict(district._id)
                                    }
                                    style={{ accentColor: "#007bff" }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`district-${district.id}`}
                                    style={{
                                      fontSize: "14px",
                                      color: "#555",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {district.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      {activeTab === "Ẩm thực" && (
                        <div className="row mb-3">
                          {cuisines &&
                            cuisines.length > 0 &&
                            cuisines.map((food, index) => (
                              <div
                                key={index}
                                className="col-6 col-sm-6 col-md-6 col-lg-4 mb-2"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`food-${index}`}
                                    checked={
                                      selectedCuisines &&
                                      selectedCuisines.includes(food._id)
                                    }
                                    onChange={() => toggleCuisines(food._id)}
                                    style={{ accentColor: "#28a745" }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`food-${index}`}
                                    style={{
                                      fontSize: "14px",
                                      color: "#555",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {food.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      {activeTab === "Phân loại" && (
                        <div className="row">
                          {subCategories &&
                            subCategories.length > 0 &&
                            subCategories.map((subCategory, index) => (
                              <div
                                key={subCategory._id}
                                className="col-6 col-sm-6 col-md-6 col-lg-4 mb-2"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`category-${subCategory._id}`}
                                    style={{ accentColor: "#ffc107" }}
                                    checked={
                                      selectedSubCategories &&
                                      selectedSubCategories.includes(
                                        subCategory._id
                                      )
                                    }
                                    onChange={() =>
                                      toggleSubCategories(subCategory._id)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`category-${index}`}
                                    style={{
                                      fontSize: "14px",
                                      color: "#555",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {subCategory.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hành động */}
                  <div
                    className="d-flex justify-content-center mt-3"
                    style={{
                      position: "sticky",
                      bottom: "-16px",
                      backgroundColor: "#fff",
                      zIndex: 1050,
                      padding: "10px",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <button
                      className="btn btn-secondary ms-0"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        color: "#000",
                        fontSize: "14px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ddd",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => {
                        dispatch(resetFilters());
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "red")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#f8f9fa")
                      }
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div
            className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center align-items-center"
            style={{ gap: "10px" }}
          >
            {user.email !== "" ? (
              <div className="dropdown">
                {/* Display user email */}
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <strong>
                    {user?.email.length > 12
                      ? `${user?.fullname}`
                      : user?.email}
                  </strong>
                </button>

                {/* Dropdown Menu */}
                <ul
                  className="dropdown-menu"
                  aria-labelledby="userDropdown"
                  style={{
                    width: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <li className="d-flex align-items-center px-3 py-2">
                    <i
                      className="bi bi-person-circle text-warning me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <a
                      href="/profile"
                      className="text-decoration-none text-dark"
                    >
                      Cập nhật tài khoản
                    </a>
                  </li>
                  {user.role === "admin" && (
                    <li className="d-flex align-items-center px-3 py-2">
                      <i
                        className="bi bi-person-fill-check text-danger me-2"
                        style={{ fontSize: "16px" }}
                      ></i>
                      <a
                        href={`/admin`}
                        className="text-decoration-none text-dark"
                      >
                        Quản lý admin
                      </a>
                    </li>
                  )}
                  <li className="d-flex align-items-center px-3 py-2">
                    <i
                      className="bi bi-person-video3 text-success me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <a
                      href={`/member/${user._id}`}
                      className="text-decoration-none text-dark"
                    >
                      Hoạt động cá nhân
                    </a>
                  </li>
                  <li className="d-flex align-items-center px-3 py-2">
                    <i
                      className="bi bi-cart4  me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <a
                      href={`/history`}
                      className="text-decoration-none text-dark"
                    >
                      Lịch sử mua hàng
                    </a>
                  </li>
                  <li className="d-flex align-items-center px-3 py-2">
                    <i
                      className="bi bi-box-arrow-right text-secondary me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <button
                      className="btn btn-link text-decoration-none text-dark p-0"
                      onClick={() => {
                        toast.success("Logout Successfully");
                        dispatch(doLogoutAction());
                        navigate("/");
                      }}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <a href="/login" className="text-dark text-decoration-none">
                Đăng nhập
              </a>
            )}
            <Form>
              <Form.Check
                onChange={(e) =>
                  dispatch(
                    changeMode(e.target.checked === true ? "dark" : "light")
                  )
                }
                defaultChecked={mode === "light" ? false : true}
                type="switch"
                id="custom-switch"
              />
            </Form>
            <nav className="page-header__bottom">
              <ul id="navigation" className="navigation">
                <li className="navigation__item">
                  <Popover
                    className="popover-carts"
                    placement="topRight"
                    rootClassName="popover-carts"
                    title={"Sản phẩm mới thêm"}
                    content={contentPopover}
                    arrow={true}
                  >
                    <Badge count={carts?.length ?? 0} size={"small"} showZero>
                      <FiShoppingCart className="icon-cart" />
                    </Badge>
                  </Popover>
                </li>
              </ul>
            </nav>

            {/* Bell Icon */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginLeft: "10px",
              }}
            >
              {/* Biểu tượng chuông */}
              <FaBell
                style={{
                  fontSize: "16px",
                  color: "#333",
                  cursor: "pointer",
                  padding: "3px",
                  borderRadius: "50%",
                  backgroundColor: "#dcdcdc",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleToggleNotifications}
              />

              {/* Badge hiển thị số thông báo chưa đọc */}
              {unreadExists && (
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    transform: "translate(50%, -50%)",
                    backgroundColor: "red",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}

              {/* Dropdown thông báo */}
              {showNotifications && (
                <div
                  className="notifications-dropdown"
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: "0",
                    width: "300px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 1050,
                  }}
                >
                  <div
                    className="p-3"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <h6
                      className="border-bottom pb-2 mb-3"
                      style={{ fontWeight: "bold", color: "#333" }}
                    >
                      Thông báo
                    </h6>
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={notification._id}
                          className="d-flex align-items-center border-bottom pb-2 mb-2"
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            transition: "background-color 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: !notification.isRead
                                ? "red"
                                : "#007bff",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                            }}
                          >
                            <i className="bi bi-bell"></i>
                          </div>

                          <div style={{ flex: "1" }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "500",
                                color: "#333",
                                fontSize: "14px",
                              }}
                            >
                              {notification.description}
                            </p>
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px", marginTop: "4px" }}
                            >
                              {timeAgo(notification.createdAt) || "Vừa xong"}
                            </span>
                          </div>

                          <div style={{ color: "#6c757d", fontSize: "16px" }}>
                            <i className="bi bi-chevron-right"></i>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        className="text-muted text-center"
                        style={{
                          fontSize: "14px",
                          backgroundColor: "#f8f9fa",
                          padding: "15px",
                          borderRadius: "8px",
                        }}
                      >
                        Không có thông báo nào.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <img
              src="https://www.foody.vn/style/images/icons/lang/vn.png"
              alt="Vietnam Flag"
              style={{ height: "20px" }}
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
