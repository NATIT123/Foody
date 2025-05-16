import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Blogs = () => {
  const [activeTab, setActiveTab] = useState("food"); // Active tab state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 3; // Số lượng blog hiển thị trên mỗi trang

  const blogs = [
    {
      title: "Top 5 Món Ăn Truyền Thống...",
      date: "2022/09/28",
      time: "17:00",
      views: "12.0K",
      thumbnail:
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8bk1jcfrob07@resize_ss320x320",
    },
    {
      title: "Ăn xuyên màn đêm với Top...",
      date: "2022/09/28",
      time: "16:53",
      views: "10.0K",
      thumbnail:
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8bk1jcfrob07@resize_ss320x320",
    },
    {
      title: "Foodtour Hội An trong một b...",
      date: "2022/09/28",
      time: "15:22",
      views: "7.7K",
      thumbnail:
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8bk1jcfrob07@resize_ss320x320",
    },
    {
      title: "Hè Này Chưa Có Dịp Đi Đà N...",
      date: "2022/09/28",
      time: "14:29",
      views: "7.6K",
      thumbnail:
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8bk1jcfrob07@resize_ss320x320",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container py-4">
      {/* Tabs */}
      <div className="d-flex align-items-center mb-4">
        <button
          className={`btn ${
            activeTab === "food" ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          onClick={() => setActiveTab("food")}
        >
          Ăn uống
        </button>
        <button
          className={`btn ${
            activeTab === "events" ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          onClick={() => setActiveTab("events")}
        >
          Sự kiện xung quanh
        </button>
        <button
          className={`btn ${
            activeTab === "experience" ? "btn-primary" : "btn-outline-primary"
          } me-2`}
          onClick={() => setActiveTab("experience")}
        >
          Kinh nghiệm
        </button>
        <button
          className={`btn ${
            activeTab === "partners" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("partners")}
        >
          Quán Đối Tác
        </button>
        <select className="form-select ms-auto" style={{ width: "150px" }}>
          <option value="latest">Mới nhất</option>
          <option value="popular">Phổ biến</option>
        </select>
      </div>

      {/* Blogs */}
      <div className="row">
        {currentBlogs.map((blog, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className="card shadow-sm border-0"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h6
                  className="card-title text-truncate mb-2"
                  style={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  {blog.title}
                </h6>
                <p
                  className="card-text text-muted mb-0"
                  style={{ fontSize: "14px" }}
                >
                  {blog.date} - {blog.time}
                </p>
                <p
                  className="card-text text-muted"
                  style={{ fontSize: "14px", marginBottom: "0" }}
                >
                  {blog.views} lượt xem
                </p>
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

export default Blogs;
