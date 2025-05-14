import React, { useState, useEffect } from "react";
import "../../css/Slide.css";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useData } from "../../context/DataContext";
import LoginModal from "../Login/LoginModal";
import ImageModal from "../../components/Gallery/ImageModal";
import ImageGallery from "../../components/Gallery/VideosAndImagesPage";
import CommentsSection from "../../components/Comment/CommentsSection";
const MapModal = ({ currentRestaurant, isVisible, onClose }) => {
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
              Bản đồ - {currentRestaurant.name || ""}
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
                src={
                  currentRestaurant.coordinateId?.iframe ===
                  "Không tìm thấy nút Chia sẻ"
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.033019962903!2d106.69676687486857!3d10.73193666001315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zxJDhuqFpIGjhu41jIFTDtG4gxJDhu6ljIFRo4bqvbmc!5e0!3m2!1svi!2s!4v1739377005781!5m2!1svi!2s"
                    : currentRestaurant.coordinateId?.iframe
                }
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
  setCurrentAlbum,
  setCurrentComment,
  currentFood,
  currentComment,
  currentAlbum,
  currentRestaurant,
}) => {
  const { state, addNotification } = useData();
  const [activeSection, setActiveSection] = useState("Trang chủ");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(1); // Default rate as 1
  const [showModalImage, setShowModalImage] = useState(false);
  const [showModalComment, setShowModalComment] = useState(false);
  const [totalRate, setTotalRate] = useState(0);

  const [openCommentId, setOpenCommentId] = useState(null);
  const [replies, setReplies] = useState({}); // Lưu trữ phản hồi theo commentId
  const [replyText, setReplyText] = useState({}); // Lưu nội dung phản hồi

  const [likes, setLikes] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());
  useEffect(() => {
    const initialLikes = {};
    const inititalReplies = {};
    if (currentComment) {
      currentComment.forEach((comment) => {
        initialLikes[comment._id] = comment.numberOfLikes.length || 0;
        inititalReplies[comment._id] = comment.replies;
      });
      setLikes(initialLikes);
      setReplies(inititalReplies);
      const userLikedComments = new Set(
        currentComment
          .filter((comment) => comment.numberOfLikes.includes(state.user?._id))
          .map((comment) => comment._id)
      );
      setLikedComments(userLikedComments);
    }
  }, [currentComment, state.user?._id]);

  const isLike = (comment) => likedComments.has(comment);

  const handleLike = async (commentId) => {
    if (!state.user) {
      setShowModalLogin(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/comment/like/${commentId}/${state.user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setLikes((prevLikes) => {
          const currentLikes = prevLikes[commentId] || 0;
          return {
            ...prevLikes,
            [commentId]: data.data
              ? Math.max(currentLikes - 1, 0)
              : currentLikes + 1,
          };
        });
        setLikedComments((prevLikedComments) => {
          const newLikedComments = new Set(prevLikedComments);
          if (data.data) {
            newLikedComments.delete(commentId);
          } else {
            newLikedComments.add(commentId);
          }
          return newLikedComments;
        });
      } else {
        console.error("Error liking comment", data.message);
      }
    } catch (error) {
      console.error("Error liking comment", error);
    }
  };

  const handleReplyClick = (commentId) => {
    if (!state.user) {
      setShowModalLogin(true);
      return;
    }
    setOpenCommentId(openCommentId === commentId ? null : commentId);
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText({ ...replyText, [commentId]: text });
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    if (state.user._id) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/comment/reply/${commentId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: replyText[commentId],
              fullname: state.user.fullname,
              photo: state.user.photo,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.status === "success") {
          const newReply = {
            id: data.data._id,
            user: {
              fullname: state.user?.fullname || "Bạn",
              photo: state.user?.photo,
            },
            content: data.data.content,
            createdAt: data.data.createdAt,
          };

          setReplies((prevReplies) => ({
            ...prevReplies,
            [commentId]: [...(prevReplies[commentId] || []), newReply],
          }));

          setReplyText((prevText) => ({
            ...prevText,
            [commentId]: "",
          }));
        } else {
          console.error("Error adding reply:", data.message);
        }
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    })
      .format(date)
      .replace(",", "");
  };

  useEffect(() => {
    let total =
      currentRestaurant.qualityRate +
      currentRestaurant.serviceRate +
      currentRestaurant.locationRate +
      currentRestaurant.priceRate +
      currentRestaurant.spaceRate;
    total /= 5;
    setTitle(currentRestaurant.name);
    setTotalRate(Math.floor(total));
  }, [currentRestaurant]);
  const handleSubmit = () => {
    const formatDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0-11
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    if (!title || !description || !rate) {
      console.log("Please input ");
      return;
    }

    const commentData = {
      title,
      time: formatDate(),
      description,
      rate,
    };
    if (!state.loading && !state.user) return;
    if (!currentRestaurant) return;
    fetch(
      `${process.env.REACT_APP_BASE_URL}/comment/addComment/user/${state.user._id}/restaurant/${currentRestaurant._id}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.data) {
          if (
            data.data.status !== "fail" &&
            data.data.status !== "error" &&
            data.data.status !== 400
          ) {
            setCurrentComment([
              {
                ...commentData,
                type: "Via Web",
                _id: data.data.data,
                user: [
                  {
                    fullname: state.user.fullname,
                    photo: state.user.photo,
                  },
                ],
                userId: state.user._id,
              },
              ...currentComment,
            ]);
            addNotification(
              `Đã lưu bình luận về nhà hàng ${currentRestaurant.name} thành công`
            );
            console.log("Success");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });

    setDescription(""); // Reset description
    setRate(1); // Reset rate to default
    setShowModalComment(false);
  };
  const handleLogin = () => {
    setShowModalLogin(false);
    navigate("/login");
  };

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

    {
      name: "Ảnh & Video",
      active: false,
      count: currentAlbum.length || 0,
    },
    { name: "Bình luận", active: false, count: currentComment.length || 0 },
    { name: "Bản đồ", active: false },
  ];
  const handleMenuClick = (name) => {
    setActiveSection(name); // Update active section based on the clicked menu item
  };

  const handleImage = () => {
    if (!state.loading && !state.user) {
      setShowModalLogin(true);
    } else if (!state.loading && state.user) {
      setShowModalImage(true);
    }
  };

  const handleComment = () => {
    if (!state.loading && !state.user) {
      setShowModalLogin(true);
    } else if (!state.loading && state.user) {
      setShowModalComment(true);
    }
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

                <span className="badge bg-secondary">{menuItem.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <LoginModal
          show={showModalLogin}
          onClose={() => setShowModalLogin(false)}
          onLogin={handleLogin}
        />

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
              <h4 className="mb-3">Thực đơn</h4>
              <div className="row">
                {currentFood &&
                  currentFood.map((item, index) => (
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
                {currentAlbum && currentAlbum.length > 0 ? (
                  currentAlbum.map((image, index) => (
                    <div key={index} className="col-6 col-md-3 mb-3">
                      <img
                        src={image.image}
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
                  ))
                ) : (
                  <p className="text-muted fw-bold text-center fs-4">
                    Hiện tại không có hình ảnh nào
                  </p>
                )}
                <div className="col-6 col-md-3 mb-3" onClick={handleImage}>
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
                  {currentComment && currentComment.length > 0 ? (
                    currentComment.map((review, index) => (
                      <div
                        key={index}
                        className="p-3 mb-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Avatar */}
                          <img
                            src={
                              review?.user[0].photo === "default.jpg"
                                ? "/images/default.jpg"
                                : review?.user[0].photo
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
                                {review?.user[0].fullname || "empty"}
                              </strong>

                              <img
                                src="https://cdn-icons-png.flaticon.com/512/190/190411.png" // Icon xác nhận (dấu check)
                                alt="Verified"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </div>

                            {/* Nguồn và thời gian */}
                            <div className="d-flex align-items-center text-muted small">
                              <span className="fw-bold me-1">via iPhone</span>
                              <i className="bi bi-phone"></i>{" "}
                              {/* Icon điện thoại (Bootstrap Icons) */}
                              <span className="ms-2">{review.time}</span>
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
                            {review.rate}
                          </span>
                        </div>

                        <div className="fw-bold">{review.title}</div>
                        <p className="text-muted fw-semibold">
                          {review.description}
                        </p>
                        {/* Action Icons */}
                        <div className="d-flex align-items-center mt-3">
                          <button
                            onClick={() => handleLike(review._id)}
                            className="btn btn-link p-0 me-3 text-muted"
                            style={{ textDecoration: "none", fontSize: "14px" }}
                          >
                            <i
                              className={`fas fa-heart me-1 ${
                                isLike(review._id) ? "text-danger" : ""
                              }`}
                            ></i>{" "}
                            Thích ({likes[review._id] || 0})
                          </button>
                          <button
                            onClick={() => handleReplyClick(review._id)}
                            className="btn btn-link p-0 me-3 text-muted"
                            style={{ textDecoration: "none", fontSize: "14px" }}
                          >
                            <i className="fas fa-comment-alt me-1"></i> Thảo
                            luận
                          </button>
                        </div>
                        {/* Ô nhập bình luận */}
                        {openCommentId === review._id && (
                          <div className="mt-2">
                            <textarea
                              className="form-control"
                              rows="2"
                              placeholder="Nhập bình luận của bạn..."
                              value={replyText[review._id] || ""}
                              onChange={(e) =>
                                handleReplyChange(review._id, e.target.value)
                              }
                            ></textarea>
                            <button
                              className="btn btn-primary btn-sm mt-2"
                              onClick={() => handleReplySubmit(review._id)}
                            >
                              Gửi
                            </button>
                          </div>
                        )}

                        {/* Hiển thị bình luận con */}
                        {replies[review._id] &&
                          replies[review._id].length > 0 && (
                            <div className="mt-3 ps-4 border-start">
                              {replies[review._id].map((reply, i) => (
                                <div key={i} className="mb-2">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={
                                        reply.user.photo === "default.jpg"
                                          ? "/images/default.jpg"
                                          : reply.user.photo
                                      }
                                      alt="User Avatar"
                                      className="rounded-circle me-2"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div>
                                      <strong>{reply.user.fullname}</strong>
                                      <div className="text-muted small">
                                        {formatDate(reply.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-muted fw-semibold mt-1">
                                    {reply.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted fw-bold text-center fs-4">
                      Hiện tại không có bình luận nào
                    </p>
                  )}
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
                  <h6>{currentComment.length || 0} bình luận đã chia sẻ</h6>
                  <ul className="list-unstyled mb-3"></ul>

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
                            width: `${currentRestaurant.locationRate * 10}%`,
                            backgroundColor: "#6200ea",
                          }}
                          aria-valuenow={currentRestaurant.locationRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        {currentRestaurant.locationRate}
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
                            width: `${currentRestaurant.priceRate * 10}%`,
                            backgroundColor: "#388e3c",
                          }}
                          aria-valuenow={currentRestaurant.priceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        {currentRestaurant.priceRate}
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
                            width: `${currentRestaurant.qualityRate * 10}%`,
                            backgroundColor: "#fbc02d",
                          }}
                          aria-valuenow={currentRestaurant.qualityRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        {currentRestaurant.qualityRate}
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
                            width: `${currentRestaurant.serviceRate * 10}%`,
                            backgroundColor: "#d32f2f",
                          }}
                          aria-valuenow={currentRestaurant.serviceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        {currentRestaurant.serviceRate}
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
                            width: `${currentRestaurant.spaceRate * 10}%`,
                            backgroundColor: "#03a9f4",
                          }}
                          aria-valuenow={currentRestaurant.spaceRate}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span
                        className="ms-2"
                        style={{ flex: "0.5", textAlign: "right" }}
                      >
                        {currentRestaurant.spaceRate}
                      </span>
                    </li>
                  </ul>

                  <div className="text-center mt-3">
                    <h4 className="text-success">
                      {Math.floor(totalRate || 0)} điểm - Khá tốt
                    </h4>
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={handleComment}
                    >
                      <i className="fas fa-pencil-alt me-2"></i> Viết bình luận
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
                      src={
                        currentRestaurant.coordinateId?.iframe ===
                        "Không tìm thấy nút Chia sẻ"
                          ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.033019962903!2d106.69676687486857!3d10.73193666001315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zxJDhuqFpIGjhu41jIFTDtG4gxJDhu6ljIFRo4bqvbmc!5e0!3m2!1svi!2s!4v1739377005781!5m2!1svi!2s"
                          : currentRestaurant.coordinateId?.iframe
                      }
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
            {showModalComment && (
              <div
                className="modal fade show d-block"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)", // Background opacity
                  zIndex: 1051,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="modal-dialog"
                  style={{
                    marginTop: "100px", // Spacing from the top
                    transform: "translateY(20px)", // Adjust the modal position
                  }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Thêm bình luận</h5>
                      <button
                        className="btn-close"
                        onClick={() => setShowModalComment(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group mb-3">
                        <label htmlFor="title">Tiêu đề</label>
                        <input
                          id="title"
                          className="form-control"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Nhập tiêu đề..."
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                          id="description"
                          className="form-control"
                          rows="4"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Nhập mô tả..."
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="rate">Đánh giá</label>
                        <input
                          id="rate"
                          className="form-control"
                          type="number"
                          min="1"
                          max="10"
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          placeholder="Đánh giá từ 1 đến 10"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModalComment(false)}
                      >
                        Hủy
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {showModalImage && (
          <ImageModal
            setItem={setCurrentAlbum}
            restaurant={currentRestaurant}
            item={currentAlbum}
            onClose={() => setShowModalImage(false)}
          />
        )}
        {activeSection === "Ảnh & Video" && (
          <ImageGallery currentAlbums={currentAlbum} />
        )}
        {activeSection === "Bình luận" && (
          <CommentsSection
            handleReplySubmit={handleReplySubmit}
            replies={replies}
            likes={likes}
            likedComments={likedComments}
            handleLike={handleLike}
            currentComments={currentComment}
          />
        )}

        {activeSection === "Bản đồ" && (
          <MapModal
            isVisible={isMapVisible}
            onClose={handleCloseModal}
            currentRestaurant={currentRestaurant}
          />
        )}
      </div>
    </div>
  );
};

export default Slide;
