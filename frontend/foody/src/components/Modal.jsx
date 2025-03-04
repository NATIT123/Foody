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
        (el) => el.user._id.toString() === state.user._id.toString()
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

  const [openCommentId, setOpenCommentId] = useState(null);
  const [replies, setReplies] = useState({}); // Lưu trữ phản hồi theo commentId
  const [replyText, setReplyText] = useState({}); // Lưu nội dung phản hồi

  const [likes, setLikes] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());
  useEffect(() => {
    console.log(restaurant.comments);
    const initialLikes = {};
    const inititalReplies = {};
    if (restaurant?.comments) {
      restaurant?.comments.forEach((comment) => {
        initialLikes[comment._id] = comment.numberOfLikes?.length || 0;
        inititalReplies[comment._id] = comment.replies;
      });
      setLikes(initialLikes);
      setReplies(inititalReplies);
      const userLikedComments = new Set(
        restaurant?.comments
          .filter((comment) => comment.numberOfLikes?.includes(state.user?._id))
          .map((comment) => comment._id)
      );
      setLikedComments(userLikedComments);
    }
  }, [restaurant?.comments, state.user?._id]);

  const isLike = (comment) => likedComments.has(comment);

  const handleLike = async (commentId) => {
    if (!state.user) {
      setShowLoginModal(true);
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

        setCurrentItems((prevCurrent) => {
          return prevCurrent.map((current) =>
            current._id.toString() === item._id.toString()
              ? {
                  ...current,
                  comments: current.comments.map((comment) =>
                    comment._id.toString() === commentId.toString()
                      ? {
                          ...comment,
                          numberOfLikes: data.data
                            ? comment?.numberOfLikes.filter(
                                (id) =>
                                  id.toString() !== state.user._id.toString()
                              ) || []
                            : [
                                ...(comment?.numberOfLikes || []),
                                state.user._id.toString(),
                              ],
                        }
                      : comment
                  ),
                }
              : current
          );
        });
      } else {
        console.error("Error liking comment", data.message);
      }
    } catch (error) {
      console.error("Error liking comment", error);
    }
  };

  const handleReplyClick = (commentId) => {
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

          setCurrentItems((prevCurrent) => {
            return prevCurrent.map((current) =>
              current._id.toString() === item._id.toString()
                ? {
                    ...current,
                    comments: current.comments.map((comment) =>
                      comment._id.toString() === commentId.toString()
                        ? {
                            ...comment,
                            replies: [newReply, ...comment.replies],
                          }
                        : comment
                    ),
                  }
                : current
            );
          });

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
                                onClick={() => handleLike(comment._id)}
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i
                                  className={`fas fa-heart me-1 ${
                                    isLike(comment._id) ? "text-danger" : ""
                                  }`}
                                ></i>{" "}
                                Thích ({likes[comment._id] || 0})
                              </button>
                              <button
                                onClick={() => handleReplyClick(comment._id)}
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-comment-alt me-1"></i> Thảo
                                luận
                              </button>
                            </div>
                            {openCommentId === comment._id && (
                              <div className="mt-2">
                                <textarea
                                  className="form-control"
                                  rows="2"
                                  placeholder="Nhập bình luận của bạn..."
                                  value={replyText[comment._id] || ""}
                                  onChange={(e) =>
                                    handleReplyChange(
                                      comment._id,
                                      e.target.value
                                    )
                                  }
                                ></textarea>
                                <button
                                  className="btn btn-primary btn-sm mt-2"
                                  onClick={() => handleReplySubmit(comment._id)}
                                >
                                  Gửi
                                </button>
                              </div>
                            )}

                            {/* Hiển thị bình luận con */}
                            {replies[comment._id] &&
                              replies[comment._id].length > 0 && (
                                <div className="mt-3 ps-4 border-start">
                                  {replies[comment._id].map((reply, i) => (
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
                                onClick={() => handleLike(comment._id)}
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i
                                  className={`fas fa-heart me-1 ${
                                    isLike(comment._id) ? "text-danger" : ""
                                  }`}
                                ></i>{" "}
                                Thích ({likes[comment._id] || 0})
                              </button>
                              <button
                                onClick={() => handleReplyClick(comment._id)}
                                className="btn btn-link p-0 me-3 text-muted"
                                style={{
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                <i className="fas fa-comment-alt me-1"></i> Thảo
                                luận
                              </button>
                            </div>
                            {openCommentId === comment._id && (
                              <div className="mt-2">
                                <textarea
                                  className="form-control"
                                  rows="2"
                                  placeholder="Nhập bình luận của bạn..."
                                  value={replyText[comment._id] || ""}
                                  onChange={(e) =>
                                    handleReplyChange(
                                      comment._id,
                                      e.target.value
                                    )
                                  }
                                ></textarea>
                                <button
                                  className="btn btn-primary btn-sm mt-2"
                                  onClick={() => handleReplySubmit(comment._id)}
                                >
                                  Gửi
                                </button>
                              </div>
                            )}

                            {/* Hiển thị bình luận con */}
                            {replies[comment._id] &&
                              replies[comment._id].length > 0 && (
                                <div className="mt-3 ps-4 border-start">
                                  {replies[comment._id].map((reply, i) => (
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
