import React, { useState, useEffect } from "react";
import "../css/Slide.css";
import ImageGallery from "./images";
import Comments from "./Comments";
import CommentsSection from "./CommentsSection";
import { FaPlus } from "react-icons/fa";

const MapModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // Don't render the modal if not visible

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      aria-labelledby="mapModalLabel"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="mapModalLabel">
              Bản đồ - Mì Dầu Hào HongKong Thượng Hạng
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div style={{ height: "400px" }}>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4898942877085!2d105.85084937444965!3d21.013075388318644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab23149b5aa5%3A0xe6f99884919762c7!2zQsOhbmggR2nDsiBDaOG7oyBOZ3V54buFbiBDw7RuZyBUcuG7qQ!5e0!3m2!1sen!2s!4v1739010064680!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
};
const Slide = ({
  currentFoods,
  currentComments,
  currentAlbums,
  currentRestaurants,
}) => {
  const [activeSection, setActiveSection] = useState("Trang chủ");
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    if (activeSection === "Bản đồ") {
      setIsMapVisible(true); // Automatically show modal when "Bản đồ" is active
    }
  }, [activeSection]);

  const handleCloseModal = () => {
    setIsMapVisible(false);
    setActiveSection("Trang chủ"); // Optionally reset section when modal is closed
  };
  const menuItems = [
    { name: "Trang chủ", active: true },

    { name: "Ảnh & Video", active: false, count: currentAlbums.length || 0 },
    { name: "Bình luận", active: false, count: currentComments.length || 0 },
    { name: "Bản đồ", active: false },
  ];
  const handleMenuClick = (name) => {
    setActiveSection(name); // Update active section based on the clicked menu item
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-md-3">
          <ul
            className="list-group"
            style={{
              position: "sticky",
              top: "60px",
              zIndex: "1000",
            }}
          >
            {menuItems.map((menuItem, index) => (
              <li
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  activeSection === menuItem.name ? "active" : ""
                }`}
                onClick={() => handleMenuClick(menuItem.name)}
                style={{ cursor: "pointer" }}
              >
                {menuItem.name}
                {menuItem.count && (
                  <span className="badge bg-secondary">{menuItem.count}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {activeSection === "Trang chủ" && (
          <div className="col-md-9">
            {/* Food Items Section */}
            <div
              className="mb-5"
              style={{
                border: "1px solid white",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <h4 className="mb-3">Đặt món & Giao tận nơi</h4>
              <div className="row">
                {currentFoods &&
                  currentFoods.map((item, index) => (
                    <div
                      key={index}
                      className="col-12 col-md-6 d-flex align-items-center mb-3"
                    >
                      <div className="me-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted small mb-0">Đã được đặt lần</p>
                      </div>
                      <div className="d-flex align-items-center">
                        {" "}
                        <div className="flex-grow-1">
                          {" "}
                          <span
                            className={
                              item.priceDiscount !== "empty"
                                ? "fw-bold text-primary text-decoration-line-through"
                                : "fw-bold text-primary me-2"
                            }
                          >
                            {" "}
                            {item.priceDiscount !== "empty" && (
                              <span className="fw-bold text-primary me-2">
                                {" "}
                                {item.priceDiscount}
                              </span>
                            )}
                          </span>
                          {item.priceOriginal !== "empty" && (
                            <span className="fw-bold text-primary me-2">
                              {" "}
                              {item.priceOriginal}
                            </span>
                          )}
                        </div>
                        <button className="btn btn-outline-danger btn-sm ms-auto">
                          {" "}
                          <FaPlus />{" "}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-3">
                <button
                  className="btn btn-primary w-100"
                  style={{
                    backgroundColor: "#ff5722",
                    borderColor: "#ff5722",
                    color: "white",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Xem thêm & Đặt giao tận nơi
                </button>
              </div>
            </div>

            {/* Community Images Section */}
            <div
              className="mt-5"
              style={{
                border: "1px solid white",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <h4>Hình món ăn từ cộng đồng</h4>
              <div className="row">
                {currentAlbums &&
                  currentAlbums.map((image, index) => (
                    <div key={index} className="col-6 col-md-3 mb-3">
                      <img
                        src={currentAlbums.image}
                        alt={`Community Food ${index + 1}`}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))}
                <div className="col-6 col-md-3 mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "#f8f9fa",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: "#999", fontSize: "14px" }}>
                      + Đăng món
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="row">
              {/* Main Content Section */}
              <div className="col-md-8">
                <div className="mt-5">
                  <h4>Bình luận</h4>
                  {currentComments &&
                    currentComments.map((review, index) => (
                      <div
                        key={index}
                        className="p-3 mb-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <strong>{review.name}</strong>
                          <span className="text-muted small">
                            {review.date} {review.device}
                          </span>
                        </div>
                        <div className="d-flex align-items-center my-2">
                          <span
                            className="badge bg-success"
                            style={{
                              fontSize: "14px",
                              padding: "4px 8px",
                              borderRadius: "8px",
                            }}
                          >
                            {review.rating}
                          </span>
                          <span className="ms-3 fw-bold">{review.title}</span>
                        </div>
                        <p className="text-muted">{review.reviewText}</p>
                        {/* Action Icons */}
                        <div className="d-flex align-items-center mt-3">
                          <button
                            className="btn btn-link p-0 me-3 text-muted"
                            style={{ textDecoration: "none", fontSize: "14px" }}
                          >
                            <i className="fas fa-heart me-1"></i> Thích
                          </button>
                          <button
                            className="btn btn-link p-0 me-3 text-muted"
                            style={{ textDecoration: "none", fontSize: "14px" }}
                          >
                            <i className="fas fa-comment-alt me-1"></i> Thảo
                            luận
                          </button>
                          <button
                            className="btn btn-link p-0 text-muted"
                            style={{ textDecoration: "none", fontSize: "14px" }}
                          >
                            <i className="fas fa-exclamation-triangle me-1"></i>{" "}
                            Báo lỗi
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sidebar Section */}
              <div className="col-md-4 mt-5">
                <div
                  className="p-3"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h6>40 bình luận đã chia sẻ</h6>
                  <ul className="list-unstyled mb-3">
                    <li>
                      <span style={{ color: "#6200ea", fontWeight: "bold" }}>
                        1
                      </span>{" "}
                      Tuyệt vời
                    </li>
                    <li>
                      <span style={{ color: "#388e3c", fontWeight: "bold" }}>
                        34
                      </span>{" "}
                      Khá tốt
                    </li>
                    <li>
                      <span style={{ color: "#fbc02d", fontWeight: "bold" }}>
                        4
                      </span>{" "}
                      Trung bình
                    </li>
                    <li>
                      <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                        1
                      </span>{" "}
                      Kém
                    </li>
                  </ul>

                  <h6>Tiêu chí</h6>
                  <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                    <li className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ flex: "1" }}>Vị trí</span>
                      <div
                        className="progress w-50"
                        style={{ height: "8px", flex: "2" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${currentRestaurants.locationRate * 10}%`,
                            backgroundColor: "#6200ea",
                          }}
                          aria-valuenow={currentRestaurants.locationRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        7.7
                      </span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ flex: "1" }}>Giá cả</span>
                      <div
                        className="progress w-50"
                        style={{ height: "8px", flex: "2" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${currentRestaurants.priceRate * 10}%`,
                            backgroundColor: "#388e3c",
                          }}
                          aria-valuenow={currentRestaurants.priceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        7.2
                      </span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ flex: "1" }}>Chất lượng</span>
                      <div
                        className="progress w-50"
                        style={{ height: "8px", flex: "2" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${currentRestaurants.qualityRate * 10}%`,
                            backgroundColor: "#fbc02d",
                          }}
                          aria-valuenow={currentRestaurants.qualityRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        7.2
                      </span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ flex: "1" }}>Phục vụ</span>
                      <div
                        className="progress w-50"
                        style={{ height: "8px", flex: "2" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${currentRestaurants.serviceRate * 10}%`,
                            backgroundColor: "#d32f2f",
                          }}
                          aria-valuenow={currentRestaurants.serviceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        7.6
                      </span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ flex: "1" }}>Không gian</span>
                      <div
                        className="progress w-50"
                        style={{ height: "8px", flex: "2" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${currentRestaurants.spaceRate * 10}%`,
                            backgroundColor: "#03a9f4",
                          }}
                          aria-valuenow={currentRestaurants.spaceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        7.7
                      </span>
                    </li>
                  </ul>

                  <div className="text-center mt-3">
                    <h4 className="text-success">7.5 điểm - Khá tốt</h4>
                    <button className="btn btn-primary w-100 mt-3">
                      <i className="fas fa-pencil-alt me-2"></i> Viết bình luận
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map and Information Section */}
            {/* Map and Information Section */}
            <div
              className="mt-5"
              style={{
                border: "1px solid white",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <h4>Thông tin & Bản đồ</h4>

              {/* Map Section */}
              <div className="row">
                <div className="col-md-12">
                  <div
                    style={{
                      height: "400px",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      title="Google Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8676005935885!2d105.79532781488302!3d21.028511793150485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc06e3a1b99%3A0x678946e8f8d3c04f!2zVGhhbmggxJDhu6ljIFRo4buNIFRo4buNIFRoYW5o!5e0!3m2!1sen!2s!4v1670928133423!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Expanded Information Section */}
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="container mt-4">
                    {/* Grid-based Flat Layout */}
                    <div className="row g-4">
                      {/* Column 1 */}
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "160px", display: "block" }}
                            >
                              Thời gian hoạt động
                            </strong>
                            <div>
                              <span style={{ color: "green" }}>
                                Đang mở cửa 09:00 - 22:00
                              </span>
                            </div>
                          </li>
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Thời gian chuẩn bị
                            </strong>
                            <div>
                              <span>Khoảng 10 - 15 phút</span>
                            </div>
                          </li>
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Sức chứa
                            </strong>
                            <div>
                              <span>50 người lớn</span>
                            </div>
                          </li>
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Thích hợp
                            </strong>
                            <div>
                              <span>Buổi sáng, Buổi trưa, Buổi tối</span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Column 2 */}
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Thể loại
                            </strong>
                            <div>
                              <span>Nhà hàng</span>
                            </div>
                          </li>
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Phục vụ các món
                            </strong>
                            <div>
                              <span>
                                Thịt gà, Gà rán, Hamburger, Cơm, Fastfood - Thức
                                ăn nhanh
                              </span>
                            </div>
                          </li>
                          <li className="mb-3">
                            <strong
                              className="me-2"
                              style={{ width: "150px", display: "block" }}
                            >
                              Website
                            </strong>
                            <div>
                              <a
                                href="https://www.kfcvietnam.com.vn"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                kfcvietnam.com.vn
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Service List Section */}
                    <div className="border-top pt-4 mt-4">
                      <h6 className="fw-bold">Dịch vụ hỗ trợ:</h6>
                      <div className="row">
                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>Có wifi</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>Có giao hàng</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>Cho mua về</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>Nên đặt trước</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <span>Gửi xe máy miễn phí</span>
                        </div>

                        <div className="col-md-4 d-flex align-items-center mb-2">
                          <i className="fas fa-times-circle text-danger me-2"></i>
                          <span>Không có chỗ đậu ôtô</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSection === "Ảnh & Video" && (
          <ImageGallery currentAlbums={currentAlbums} />
        )}
        {activeSection === "Bình luận" && (
          <CommentsSection currentComments={currentComments} />
        )}

        {activeSection === "Bản đồ" && (
          <MapModal isVisible={isMapVisible} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Slide;
