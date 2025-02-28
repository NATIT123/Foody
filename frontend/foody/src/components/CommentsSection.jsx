import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginModal from "./LoginModal";
const CommentsSection = ({
  handleReplySubmit,
  replies,
  likes,
  likedComments,
  handleLike,
  currentComments,
}) => {
  const { state } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("latest");
  const [myComments, setMyComments] = useState([]);
  const [tabs, setTabs] = useState([
    { name: "Mới nhất", count: currentComments.length || 0, id: "latest" },
    { name: "Của tôi", count: 0, id: "mine" },
  ]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openCommentId, setOpenCommentId] = useState(null);
  const [replyText, setReplyText] = useState({}); // Lưu nội dung phản hồi
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
    if (!state.loading && state.user) {
      const filteredComments = currentComments.filter(
        (el) => el.user[0]._id.toString() === state.user._id.toString()
      );
      setMyComments(filteredComments);
      setTabs((prevTabs) =>
        prevTabs.map((el) =>
          el.id === "latest"
            ? { ...el, count: currentComments.length || 0 }
            : { ...el, count: filteredComments.length || 0 }
        )
      );
    }
  }, [currentComments, state.user, state.loading]);

  const isLike = (comment) => likedComments.has(comment);

  useEffect(() => {
    if (activeTab === tabs[1].id) {
      handleShowModalLogin();
    }
  }, [activeTab, tabs]);

  const handleShowModalLogin = () => {
    if (!state.loading && !state.user) {
      setShowLoginModal(true);
      return;
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleReplyClick = (commentId) => {
    setOpenCommentId(openCommentId === commentId ? null : commentId);
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText({ ...replyText, [commentId]: text });
  };

  return (
    <div className="col-md-9">
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
            {tab.name} <span className="text-muted">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Comments */}
      {activeTab === "latest" && (
        <div className="mt-3">
          {currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
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
                  <img
                    src={
                      comment?.user[0].photo === "default.jpg"
                        ? "/images/default.jpg"
                        : comment?.user[0].photo
                    }
                    alt="User Avatar"
                    className="rounded-circle me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <strong>{comment?.user[0].fullname || "empty"}</strong>
                    <div className="text-muted small">
                      <span className="fw-bold me-1">{comment.type}</span>
                      <span className="ms-2">{comment.time}</span>
                    </div>
                  </div>
                  <span className="badge bg-success ms-auto">
                    {comment.rate}
                  </span>
                </div>

                <div className="fw-bold">{comment.title}</div>
                <p className="text-muted fw-semibold">{comment.description}</p>

                {/* Action Buttons */}
                <div className="d-flex align-items-center mt-3">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className="btn btn-link p-0 me-3 text-muted "
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "red",
                    }}
                  >
                    {isLike(comment._id)}
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
                    style={{ textDecoration: "none", fontSize: "14px" }}
                  >
                    <i className="fas fa-comment-alt me-1"></i> Thảo luận
                  </button>
                </div>

                {/* Ô nhập bình luận */}
                {openCommentId === comment._id && (
                  <div className="mt-2">
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Nhập bình luận của bạn..."
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(comment._id, e.target.value)
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
                {replies[comment._id] && replies[comment._id].length > 0 && (
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

      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default CommentsSection;
