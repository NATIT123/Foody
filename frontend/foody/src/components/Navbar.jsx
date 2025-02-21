import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { FaBell } from "react-icons/fa";
const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { state, markAllNotificationsRead, unreadExists, logout } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = state;
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
  const handleToggleNotifications = () => {
    if (!state.loading && !state.user) {
      console.log("Không có user, fetch không chạy.");
      return;
    }

    if (!state.user || !state.user._id) {
      console.log("User ID không hợp lệ.");
      return;
    }
    if (showNotifications && unreadExists) {
      markAllNotificationsRead();
    }

    // Đảo trạng thái show/hide thông báo
    setShowNotifications(!showNotifications);
  };
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
      <a href="/" className="navbar-brand fw-bold text-primary">
        <i className="bi bi-speedometer2 me-2"></i>My Dashboard
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <div className="d-flex align-items-center ms-auto gap-3">
          {/* Tìm kiếm */}
          <form className="d-flex flex-grow-1 flex-lg-grow-0">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="form-control rounded-pill"
              placeholder="Search..."
              style={{ maxWidth: "300px" }}
            />
          </form>

          {/* Thông báo */}
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
          {/* User */}
          {state.user && (
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary rounded-circle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    state.user.photo === "default.jpg"
                      ? "/images/default.jpg"
                      : state.user.photo
                  }
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                  }}
                />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li className="d-flex align-items-center px-3 py-2">
                  <i
                    className="bi bi-person-circle text-warning me-2"
                    style={{ fontSize: "16px" }}
                  ></i>
                  <a href="/profile" className="text-decoration-none text-dark">
                    Tài khoản
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
