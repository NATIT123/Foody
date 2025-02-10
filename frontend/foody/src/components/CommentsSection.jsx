import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CommentsSection = ({ currentComments }) => {
  const [activeTab, setActiveTab] = useState("latest"); // State for active tab

  const tabs = [
    { name: "Mới nhất", count: currentComments.length || 0, id: "latest" },
    { name: "Của tôi", count: 0, id: "mine" },
  ];

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
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex flex-column">
                    <strong>{comment.user}</strong>
                    <span className="text-muted small">
                      {comment.device} - {comment.date}
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      parseFloat(comment.rating) >= 7
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                    style={{
                      fontSize: "14px",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    {comment.rating}
                  </span>
                </div>
                <div className="d-flex align-items-center my-2">
                  <span className="fw-bold">{comment.restaurant}</span>
                </div>
                {/* Comment Text */}
                <p className="mb-1">{comment.comment}</p>
                <p className="text-muted small">{comment.details}</p>

                {/* Footer */}
                <div className="text-muted small">
                  - Đây là nhận xét từ Thành Viên trên Foody, không phải từ
                  Foody Corp. -
                </div>

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
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex flex-column">
                    <strong>{comment.user}</strong>
                    <span className="text-muted small">
                      {comment.device} - {comment.date}
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      parseFloat(comment.rating) >= 7
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                    style={{
                      fontSize: "14px",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    {comment.rating}
                  </span>
                </div>
                <div className="d-flex align-items-center my-2">
                  <span className="fw-bold">{comment.restaurant}</span>
                </div>
                {/* Comment Text */}
                <p className="mb-1">{comment.comment}</p>
                <p className="text-muted small">{comment.details}</p>

                {/* Footer */}
                <div className="text-muted small">
                  - Đây là nhận xét từ Thành Viên trên Foody, không phải từ
                  Foody Corp. -
                </div>

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
