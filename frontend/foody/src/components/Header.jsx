import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaBell, FaSearch, FaFilter } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
import "../css/Header.css"; // Import file CSS tùy chỉnh
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataContext";

function Header({ onSearch, setSelectedDistricts, selectedDistricts }) {
  const { state, logout, setSelectedCity, setSelectedCategory } = useData();
  const [showNotifications, setShowNotifications] = useState(false); // State để hiển thị thông báo
  const [showFilter, setShowFilter] = useState(false); // Hiển thị dropdown bộ lọc
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [activeTab, setActiveTab] = useState("Khu vực");
  const dropdownRef = useRef(null);
  // Xử lý toggle chọn/bỏ chọn quận/huyện

  // Call this function when the user submits the search
  const searchHandler = () => {
    if (onSearch) {
      onSearch(searchQuery); // Pass the search query to the parent component
    }
  };

  // Xử lý toggle chọn/bỏ chọn quận/huyện
  const toggleDistrict = (districtId) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    );
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadExists, setUnreadExists] = useState(false);
  useEffect(() => {
    // Cập nhật unreadExists mỗi khi notifications thay đổi
    setUnreadExists(notifications.some((n) => !n.isRead));
  }, [notifications]);

  const handleToggleNotifications = () => {
    if (!state.loading && !state.user) {
      console.log("Không có user, fetch không chạy.");
      return;
    }

    if (!state.user || !state.user._id) {
      console.log("User ID không hợp lệ.");
      return;
    }

    const apiUrl = `${process.env.REACT_APP_BASE_URL}/notification/makeAll/${state.user._id}`;

    // Chỉ gọi API khi đóng thông báo và có thông báo chưa đọc
    if (showNotifications && unreadExists) {
      fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (
            data &&
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            console.log("Tất cả thông báo đã được đánh dấu là đọc.");
            setNotifications(
              (prev) => prev.map((n) => ({ ...n, isRead: true })) // Cập nhật UI ngay
            );
          } else {
            console.log("Lỗi từ server:", data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi fetch dữ liệu:", error);
        });
    }

    // Đảo trạng thái show/hide thông báo
    setShowNotifications(!showNotifications);
  };
  useEffect(() => {
    if (!state.loading && !state.user) return;
    fetch(
      `${process.env.REACT_APP_BASE_URL}/notification/getAllNotifications`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            setNotifications(data.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [state, showNotifications]);

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
      {/* Navigation Bar */}
      <nav
        className="ps-4 bg-dark container-fluid d-flex justify-content-start border-bottom py-1  top-0"
        style={{ zIndex: 1030 }}
      >
        <a
          href="/"
          className={`me-3 text-light text-decoration-none nav-link ${
            window.location.pathname === "/" ? "active-custom" : ""
          }`}
        >
          Khám Phá
        </a>
        <a
          href="/"
          className={`me-3 text-light text-decoration-none nav-link ${
            window.location.pathname === "/dat-giao-hang" ? "active-custom" : ""
          }`}
        >
          Đặt Giao Hàng
        </a>
        <a
          href="/"
          className={`text-light text-decoration-none nav-link ${
            window.location.pathname === "/di-cho" ? "active-custom" : ""
          }`}
        >
          Đi Chợ
        </a>
      </nav>

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
                  {state.selectedCity && state.selectedCity.name}{" "}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownCity"
                  style={{
                    maxHeight: "200px", // Chiều cao tối đa
                    overflowY: "auto", // Thanh cuộn dọc nếu nội dung vượt quá chiều cao
                  }}
                >
                  {state.cities &&
                    state.cities.map((city) => (
                      <li key={city._id}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            setSelectedCity({
                              _id: city._id,
                              name: city.name,
                            })
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
                  {state.selectedCategory && state.selectedCategory.name}{" "}
                  {/* Hiển thị tên category được chọn */}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownCategory"
                >
                  {state.categories &&
                    state.categories.map((category) => (
                      <li key={category._id}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            setSelectedCategory({
                              _id: category._id,
                              name: category.name,
                            })
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
              className="input-group position-relative"
              style={{ maxWidth: "450px", width: "100%" }}
            >
              {/* Ô tìm kiếm */}
              <input
                type="text"
                className="form-control"
                placeholder="Địa điểm, món ăn, loại hình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: "8px 0 0 8px",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />

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
                          {state.districts &&
                            state.districts.map((district) => (
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
                          {state.cuisines &&
                            state.cuisines.map((food, index) => (
                              <div
                                key={index}
                                className="col-6 col-sm-6 col-md-6 col-lg-4 mb-2"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`food-${index}`}
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
                          {state.subCategories &&
                            state.subCategories.map((subCategory, index) => (
                              <div
                                key={index}
                                className="col-6 col-sm-6 col-md-6 col-lg-4 mb-2"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`category-${subCategory._id}`}
                                    style={{ accentColor: "#ffc107" }}
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
                      className="btn btn-primary me-1"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        backgroundColor: "#007bff",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        alert(
                          `Lọc theo quận: ${
                            selectedDistricts && selectedDistricts.join(", ")
                          }`
                        )
                      }
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#0056b3")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#007bff")
                      }
                    >
                      Tìm kiếm
                    </button>
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
                      onClick={() => setSelectedDistricts([])}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#e2e6ea")
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

              {/* Nút Tìm kiếm */}
              <button
                className="btn btn-outline-secondary search-button"
                onClick={searchHandler}
                style={{
                  marginLeft: "8px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div
            className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center align-items-center"
            style={{ gap: "10px" }}
          >
            {state.user ? (
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
                    {state.user.email.length > 12
                      ? `${state.user.email.substring(0, 12)}...`
                      : state.user.email}
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
                  <li className="d-flex align-items-center px-3 py-2">
                    <i
                      className="bi bi-box-arrow-right text-secondary me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <button
                      className="btn btn-link text-decoration-none text-dark p-0"
                      onClick={() => {
                        logout();
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

            {/* Bell Icon */}
            <div style={{ position: "relative", display: "inline-block" }}>
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
              {notifications?.filter((n) => !n.isRead).length > 0 && (
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
