import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import CommentModal from "./CommentModal";
import { useData } from "../context/DataContext";

const Modal = ({ show, onClose, item, currentItems, setCurrentItems }) => {
  const navigate = useNavigate(); // Hook điều hướng
  const { state } = useData();
  const [activeTab, setActiveTab] = useState("latest"); // State for active tab
  const [myComments, setMyComments] = useState([]);

  const restaurant = useMemo(() => {
    return (
      currentItems.find((el) => el._id.toString() === item._id.toString()) ||
      item
    );
  }, [currentItems, item]);

  const [tabs, setTabs] = useState([
    { name: "Mới nhất", count: item.commentCount || 0, id: "latest" },
    { name: "Của tôi", count: 0, id: "mine" },
  ]);

  useEffect(() => {
    if (!state.loading && state.user) {
      const filteredComments = restaurant.comments.filter(
        (el) => el.user._id === state.user._id
      );
      setMyComments(filteredComments);
      setTabs((prevTabs) =>
        prevTabs.map((el) =>
          el.id === "latest"
            ? { ...el, count: restaurant.commentCount || 0 }
            : { ...el, count: filteredComments.length || 0 }
        )
      );
    }
  }, [item.comments, item.commentCount, state.user, state.loading, restaurant]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [ratings, setRatings] = useState([]);
  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login"); // Chuyển hướng sang trang đăng nhập
  };

  const handleShowModalLogin = () => {
    if (!state.loading && !state.user) {
      setShowLoginModal(true);
      return;
    }
  };

  const handleShowModalComment = () => {
    if (!state.loading && !state.user) {
      setShowLoginModal(true);
      return;
    }
    setShowCommentModal(true);
  };

  useEffect(() => {
    if (activeTab === tabs[1].id) {
      handleShowModalLogin();
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    setRatings([
      { category: "Vị trí", value: item.locationRate },
      { category: "Giá cả", value: item.priceRate },
      { category: "Chất lượng", value: item.qualityRate },
      { category: "Phục vụ", value: item.serviceRate },
      { category: "Không gian", value: item.spaceRate },
    ]);
  }, [item]);

  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div
              className="d-flex gap-4 mb-4"
              style={{
                alignItems: "flex-start", // Căn chỉnh các thành phần đầu hàng trên
              }}
            >
              {/* Ảnh và mô tả */}
              <div
                className="d-flex flex-column align-items-start"
                style={{
                  width: "210px", // Đặt chiều rộng cố định cho phần ảnh và mô tả
                  flexShrink: 0, // Ngăn không cho phần này bị co lại
                }}
              >
                {/* Hình ảnh */}
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="img-fluid"
                  style={{
                    width: "100%", // Chiều rộng chiếm toàn bộ container
                    height: "150px", // Chiều cao cố định
                    objectFit: "cover", // Đảm bảo ảnh không bị méo
                    borderRadius: "8px",
                    marginBottom: "10px", // Khoảng cách giữa ảnh và mô tả
                  }}
                />

                {/* Mô tả */}
                <div className="ml-2">
                  <p
                    style={{
                      fontSize: "12px",
                      marginBottom: "4px",
                      fontWeight: "bold",
                      color: "#4CAF50",
                      display: "inline",
                      padding: "2px 6px",
                      borderRadius: "50%",
                      backgroundColor: "#e0f7e1",
                    }}
                  >
                    {restaurant.averageRate}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {restaurant.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "normal",
                    }}
                  >
                    {restaurant.address}
                  </p>
                </div>
                {/* Nút Viết bình luận */}
                <button
                  className="btn btn-primary w-100"
                  onClick={handleShowModalComment}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px", // Khoảng cách giữa icon và text
                    fontSize: "14px",
                  }}
                >
                  <i className="bi bi-chat-dots"></i>
                  Viết bình luận
                </button>

                <h6 className="mt-2 text-center">
                  {restaurant.commentCount} Bình luận
                </h6>
                <div className="mb-3">
                  <div
                    className="d-flex justify-content-evenly"
                    style={{ fontSize: "12px", width: "100%" }}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontWeight: "bold" }}>0</span>
                      <span style={{ fontWeight: "500" }}>Tuyệt vời</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontWeight: "bold" }}>1</span>
                      <span style={{ fontWeight: "500" }}>Khá tốt</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontWeight: "bold" }}>0</span>
                      <span style={{ fontWeight: "500" }}>Trung bình</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontWeight: "bold" }}>0</span>
                      <span style={{ fontWeight: "500" }}>Kém</span>
                    </div>
                  </div>

                  <hr />
                  <div style={{ width: "100%" }}>
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center mb-2"
                        style={{ fontSize: "12px", width: "100%" }}
                      >
                        <span style={{ width: "70px", fontSize: "12px" }}>
                          {rating.category}
                        </span>{" "}
                        {/* Giảm width ở đây */}
                        <div
                          className="progress"
                          style={{ height: "8px", width: "100px" }}
                        >
                          {" "}
                          {/* Giảm chiều rộng của thanh progress */}
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${rating.value * 10}%` }}
                          />
                        </div>
                        <span
                          style={{
                            width: "20px",
                            textAlign: "right",
                            fontSize: "12px",
                          }}
                        >
                          {rating.value.toFixed(1)}
                        </span>{" "}
                        {/* Giảm width ở đây */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phần bình luận */}
              <div style={{ flex: 1 }}>
                {/* Bình luận */}
                <div className="col-md-12">
                  {/* Tabs */}
                  <div className="d-flex mb-3">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`btn btn-link text-decoration-none me-3 ${
                          activeTab === tab.id ? "text-danger fw-bold" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.name}{" "}
                        <span className="text-muted">({tab.count})</span>
                      </button>
                    ))}

                    <div className="ms-auto">
                      <select className="form-select form-select-sm w-auto">
                        <option>Bình luận</option>
                        <option>Đánh giá</option>
                      </select>
                    </div>
                  </div>

                  {/* Comments */}
                  {activeTab === "latest" && (
                    <div className="mt-3">
                      {restaurant?.comments &&
                      restaurant?.comments.length > 0 ? (
                        restaurant.comments.map((comment, index) => (
                          <div
                            key={index}
                            className="p-3 mb-3"
                            style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              {/* Avatar */}
                              <img
                                src={
                                  comment?.user?.photo === "default.jpg"
                                    ? "/images/default.jpg"
                                    : comment?.user?.photo
                                }
                                alt="User Avatar"
                                className="rounded-circle me-2"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />

                              {/* Thông tin người dùng */}
                              <div>
                                <div className="d-flex align-items-center">
                                  <strong className="me-2">
                                    {comment?.user?.fullname || "empty"}
                                  </strong>

                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png" // Icon xác nhận (dấu check)
                                    alt="Verified"
                                    style={{ width: "16px", height: "16px" }}
                                  />
                                </div>

                                {/* Nguồn và thời gian */}
                                <div className="d-flex align-items-center text-muted small">
                                  <span className="fw-bold me-1">
                                    {comment.type}
                                  </span>
                                  <i className="bi bi-phone"></i>{" "}
                                  {/* Icon điện thoại (Bootstrap Icons) */}
                                  <span className="ms-2">{comment.time}</span>
                                </div>
                              </div>

                              {/* Đánh giá (badge sao) */}
                              <span
                                className="badge bg-success ms-auto"
                                style={{
                                  fontSize: "14px",
                                  padding: "4px 8px",
                                  borderRadius: "8px",
                                }}
                              >
                                {comment.rate}
                              </span>
                            </div>

                            <div className="fw-bold">{comment.title}</div>
                            <p className="text-muted fw-semibold">
                              {comment.description}
                            </p>
                            {/* Action Buttons */}
                            <div className="d-flex align-items-center mt-3">
                              <button
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-heart me-1"></i> Thích
                              </button>
                              <button
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-comment-alt me-1"></i> Thảo
                                luận
                              </button>
                              <button
                                className="btn btn-link p-0 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-exclamation-triangle me-1"></i>{" "}
                                Báo lỗi
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted fw-bold text-center fs-4">
                          Hiện tại không có bình luận nào
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === "mine" && (
                    <div className="mt-3">
                      {myComments && myComments.length > 0 ? (
                        myComments.map((comment, index) => (
                          <div
                            key={index}
                            className="p-3 mb-3"
                            style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {/* Header */}
                            <div className="d-flex align-items-center">
                              {/* Avatar */}
                              <img
                                src={
                                  comment?.user.photo === "default.jpg"
                                    ? "/images/default.jpg"
                                    : comment?.user.photo
                                }
                                alt="User Avatar"
                                className="rounded-circle me-2"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />

                              {/* Thông tin người dùng */}
                              <div>
                                <div className="d-flex align-items-center">
                                  <strong className="me-2">
                                    {comment?.user.fullname || "empty"}
                                  </strong>

                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png" // Icon xác nhận (dấu check)
                                    alt="Verified"
                                    style={{ width: "16px", height: "16px" }}
                                  />
                                </div>

                                {/* Nguồn và thời gian */}
                                <div className="d-flex align-items-center text-muted small">
                                  <span className="fw-bold me-1">
                                    {comment.type}
                                  </span>
                                  <i className="bi bi-phone"></i>{" "}
                                  {/* Icon điện thoại (Bootstrap Icons) */}
                                  <span className="ms-2">{comment.time}</span>
                                </div>
                              </div>

                              {/* Đánh giá (badge sao) */}
                              <span
                                className="badge bg-success ms-auto"
                                style={{
                                  fontSize: "14px",
                                  padding: "4px 8px",
                                  borderRadius: "8px",
                                }}
                              >
                                {comment.rate}
                              </span>
                            </div>

                            <div className="fw-bold">{comment.title}</div>
                            <p className="text-muted fw-semibold">
                              {comment.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="d-flex align-items-center mt-3">
                              <button
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-heart me-1"></i> Thích
                              </button>
                              <button
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-comment-alt me-1"></i> Thảo
                                luận
                              </button>
                              <button
                                className="btn btn-link p-0 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-exclamation-triangle me-1"></i>{" "}
                                Báo lỗi
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted fw-bold text-center fs-4">
                          Hiện tại không có bình luận nào
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {showCommentModal && (
        <CommentModal
          myComments={myComments}
          setMyComments={setMyComments}
          currentItems={currentItems}
          setCurrentItems={setCurrentItems}
          restaurant={restaurant}
          show={showCommentModal}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </div>
  );
};
export default Modal;
