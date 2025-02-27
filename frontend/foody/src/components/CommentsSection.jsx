import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginModal from "./LoginModal";
import axios from "axios";
const CommentsSection = ({ currentComments }) => {
  const { state } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("latest");
  const [myComments, setMyComments] = useState([]);
  const [likes, setLikes] = useState({});
  const [tabs, setTabs] = useState([
    { name: "Mới nhất", count: currentComments.length || 0, id: "latest" },
    { name: "Của tôi", count: 0, id: "mine" },
  ]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openCommentId, setOpenCommentId] = useState(null);
  const [replies, setReplies] = useState({}); // Lưu trữ phản hồi theo commentId
  const [replyText, setReplyText] = useState({}); // Lưu nội dung phản hồi

  useEffect(() => {
    // Khởi tạo trạng thái lượt thích từ danh sách bình luận
    const initialLikes = {};
    if (currentComments) {
      currentComments.forEach((comment) => {
        initialLikes[comment._id] = comment.numberOfLikes.length || 0;
      });
    }
    setLikes(initialLikes);
  }, [currentComments]);

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

  function isLike(comment) {
    const likes = comment.numberOfLikes;
    if (likes && state.user) {
      if (likes.includes(state.user._id)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  const handleLike = async (commentId) => {
    if (!state.user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/comment/like`,
        { commentId },
        { headers: { Authorization: `Bearer ${state.user.token}` } }
      );

      if (response.data.success) {
        setLikes({
          ...likes,
          [commentId]: likes[commentId] + 1,
        });
      }
    } catch (error) {
      console.error("Error liking comment", error);
    }
  };

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

  const handleReplySubmit = (commentId) => {
    if (!replyText[commentId]?.trim()) return;

    const newReply = {
      id: new Date().getTime(),
      user: {
        fullname: state.user?.fullname || "Bạn",
        photo: "/images/default.jpg",
      },
      description: replyText[commentId],
      time: "Vừa xong",
    };

    setReplies({
      ...replies,
      [commentId]: [...(replies[commentId] || []), newReply],
    });

    setReplyText({ ...replyText, [commentId]: "" });
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
                    className="btn btn-link p-0 me-3 text-muted "
                    style={{
                      textDecoration: "none",
                      fontSize: "14px",
                      color: "red",
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
                            src={reply.user.photo}
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
                            <div className="text-muted small">{reply.time}</div>
                          </div>
                        </div>
                        <p className="text-muted fw-semibold mt-1">
                          {reply.description}
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
