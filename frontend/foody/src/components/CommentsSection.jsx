import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import "bootstrap/dist/css/bootstrap.min.css";

const CommentsSection = ({ currentComments }) => {
  const { state } = useData();
  const [activeTab, setActiveTab] = useState("latest"); // State for active tab
  const [myComments, setMyComments] = useState([]);
  const [tabs, setTabs] = useState([]);
  useEffect(() => {
    if (state.user) {
      setMyComments(
        currentComments.filter((el) => el.user._id === state.user._id)
      );
    }
    setTabs([
      { name: "Mới nhất", count: currentComments.length || 0, id: "latest" },
      { name: "Của tôi", count: myComments.length || 0, id: "mine" },
    ]);
  }, [currentComments, state, myComments.length]);

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
          {currentComments && currentComments.length > 0 ? (
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
                  {/* Avatar */}
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

                  {/* Thông tin người dùng */}
                  <div>
                    <div className="d-flex align-items-center">
                      <strong className="me-2">
                        {comment?.user[0].fullname || "empty"}
                      </strong>

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" // Icon xác nhận (dấu check)
                        alt="Verified"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </div>

                    {/* Nguồn và thời gian */}
                    <div className="d-flex align-items-center text-muted small">
                      <span className="fw-bold me-1">{comment.type}</span>
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
                <p className="text-muted fw-semibold">{comment.description}</p>
                {/* Action Buttons */}
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
                    <i className="fas fa-comment-alt me-1"></i> Thảo luận
                  </button>
                  <button
                    className="btn btn-link p-0 text-muted"
                    style={{ textDecoration: "none", fontSize: "14px" }}
                  >
                    <i className="fas fa-exclamation-triangle me-1"></i> Báo lỗi
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

                  {/* Thông tin người dùng */}
                  <div>
                    <div className="d-flex align-items-center">
                      <strong className="me-2">
                        {comment?.user[0].fullname || "empty"}
                      </strong>

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png" // Icon xác nhận (dấu check)
                        alt="Verified"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </div>

                    {/* Nguồn và thời gian */}
                    <div className="d-flex align-items-center text-muted small">
                      <span className="fw-bold me-1">{comment.type}</span>
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
                <p className="text-muted fw-semibold">{comment.description}</p>

                {/* Action Buttons */}
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
                    <i className="fas fa-comment-alt me-1"></i> Thảo luận
                  </button>
                  <button
                    className="btn btn-link p-0 text-muted"
                    style={{ textDecoration: "none", fontSize: "14px" }}
                  >
                    <i className="fas fa-exclamation-triangle me-1"></i> Báo lỗi
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
  );
};

export default CommentsSection;
