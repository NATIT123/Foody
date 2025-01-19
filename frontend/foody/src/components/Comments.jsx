import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Comments = () => {
  const [activeTab, setActiveTab] = useState("new"); // State for active tab
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 2; // Số bình luận hiển thị trên mỗi trang

  const comments = [
    {
      user: "Thaopham412 Pham",
      restaurant: "Matsuri Japanese Restaurant - Thảo Điền",
      location: "Thảo Điền",
      time: "11/1/2025 12:21",
      platform: "via Web",
      views: 4,
      rating: 10,
      content:
        "View cửa kính chill chill nhìn ra toàn cảnh nội khu Thảo Điền sông Sài Gòn. Menu đa dạng sashimi-sushi, nướng - lẩu và có cả menu chay.",
      tags: [
        "#ẩu",
        "#nhà hàng nhật",
        "#Sushi",
        "#sashimi",
        "#BBQ",
        "#Hot Pot",
        "#Thảo Điền",
        "#vincom thảo điền",
      ],
      images: [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m4vcodi4cw03ce@resize_w800",
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m4vcodi4cw03ce@resize_w800",
      ],
    },
    {
      user: "NguyenLe389",
      restaurant: "Nhà hàng Hải Sản - Quận 1",
      location: "Quận 1",
      time: "10/1/2025 15:45",
      platform: "via Mobile",
      views: 7,
      rating: 9,
      content:
        "Món ăn ngon, không gian ấm cúng. Thích hợp cho các buổi tụ họp gia đình.",
      tags: ["#Seafood", "#Quận 1", "#family"],
      images: [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m4vcodi4cw03ce@resize_w800",
      ],
    },
    {
      user: "MinhTuan291",
      restaurant: "Lẩu Thái Phong Cách Mới",
      location: "Quận 7",
      time: "9/1/2025 18:30",
      platform: "via Web",
      views: 10,
      rating: 8,
      content: "Hương vị độc đáo, nước lẩu thơm ngon. Phục vụ rất nhiệt tình!",
      tags: ["#HotPot", "#ThaiFood", "#Quận 7"],
      images: [],
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComments = comments.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container">
      {/* Tabs */}
      <div className="d-flex mb-3">
        <button
          className={`btn btn-outline-primary me-2 ${
            activeTab === "new" ? "active" : ""
          }`}
          onClick={() => setActiveTab("new")}
        >
          Bình luận mới
        </button>
        <button
          className={`btn btn-outline-primary ${
            activeTab === "friends" ? "active" : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Bình luận từ bạn bè
        </button>
      </div>

      {/* Comments */}
      <div className="comment-list">
        {currentComments.map((comment, index) => (
          <div className="card mb-4" key={index}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <img
                    src="https://down-vn.img.susercontent.com/vn-11134523-7ras8-m4yge1aemuuwe9@resize_ss40x40"
                    alt="User Avatar"
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />
                </div>
                <div>
                  <h6 className="mb-1">{comment.user}</h6>
                  <a href="/" className="text-primary">
                    {comment.restaurant}
                  </a>{" "}
                  - <span>{comment.location}</span>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    {comment.platform} | {comment.time} | {comment.views} lượt
                    xem
                  </p>
                </div>
                <span className="ms-auto badge bg-success fs-5">
                  {comment.rating}
                </span>
              </div>

              <p className="mt-3">{comment.content}</p>

              {/* Tags */}
              <div className="mb-3">
                {comment.tags.map((tag, i) => (
                  <span key={i} className="badge bg-light text-dark me-1">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Images */}
              <div className="d-flex">
                {comment.images.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt={`Image ${i + 1}`}
                    className="img-thumbnail me-2"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="mt-3 d-flex align-items-center">
                <button className="btn btn-outline-danger me-2">Gọi món</button>
                <button className="btn btn-outline-secondary me-2">
                  Lưu lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          &laquo; Trước
        </button>
        <span className="mx-3 text-muted">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Sau &raquo;
        </button>
      </div>
    </div>
  );
};

export default Comments;
