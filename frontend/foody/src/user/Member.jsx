import React, { useEffect, useState } from "react";
import "../css/Member.css"; // Import the CSS for styling
import ImagesAndVideosPage from "../components/VideosAndImagesPage";
import Header from "../components/Header";
import Friends from "../components/Friends";
import Collection from "../components/Collection";
import { useParams } from "react-router-dom";

const Member = () => {
  const [comments, setComments] = useState([]);
  const [items, setItems] = useState([]);
  const [activeSection, setActiveSection] = useState("hoatdong"); // State for tracking active section
  const { id } = useParams();
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/user/getUserDetails/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            setComments(data.data.data);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/user/getAllDetails`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            console.log(data.data.data);
            setItems(data.data.data);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, []);
  return (
    <div>
      <Header />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="sidebar-card">
              <div className="profile-section">
                <img
                  src={comments.photo}
                  alt="Profile"
                  className="profile-img"
                />
                <h5 className="profile-name">{comments.fullname}</h5>
              </div>
              <ul className="list-group">
                <li
                  className={`list-group-item ${
                    activeSection === "hoatdongcanhan" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("hoatdongcanhan")}
                >
                  <a href="#" className="sidebar-link">
                    <span className="icon">
                      <i className="fas fa-user-circle"></i>
                    </span>{" "}
                    Hoạt động cá nhân
                  </a>
                </li>
                <li
                  className={`list-group-item ${
                    activeSection === "hoatdong" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("hoatdong")}
                >
                  <a href="#" className="sidebar-link">
                    Hoạt động
                  </a>
                </li>
                <li
                  className={`list-group-item ${
                    activeSection === "hinhanhvideo" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("hinhanhvideo")}
                >
                  <a href="#" className="sidebar-link">
                    Hình ảnh & Video
                  </a>
                </li>
                <li
                  className={`list-group-item ${
                    activeSection === "banbe" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("banbe")}
                >
                  <a href="#" className="sidebar-link">
                    Bạn bè
                  </a>
                </li>
                <li
                  className={`list-group-item ${
                    activeSection === "luutru" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("luutru")}
                >
                  <a href="#" className="sidebar-link">
                    <span className="icon">
                      <i className="fas fa-archive"></i>
                    </span>{" "}
                    Lưu trữ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            {activeSection === "hoatdong" && (
              <div className="col-md-9">
                {/* Post Card */}
                {comments?.comments && comments?.comments.length > 0 ? (
                  comments?.comments?.map((comment, index) => (
                    <div className="card mb-4" key={index}>
                      <div className="card-body">
                        <h5 className="card-title">{comments.fullname}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {comment.restaurant[0].name}
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {comment.restaurant[0].address}
                        </h6>
                        <img
                          src={comment.restaurant[0].image}
                          alt={comment.restaurant[0].name}
                          className="card-img-top fixed-image rounded-image"
                        />
                        <p className="card-text">
                          {comment.title}{" "}
                          <span
                            className="text-primary xem-them"
                            style={{ cursor: "pointer" }}
                          ></span>
                        </p>
                        <p className="card-text">
                          <strong>{comment.description}</strong>{" "}
                          <span
                            className="text-primary xem-them"
                            style={{ cursor: "pointer" }}
                          ></span>
                        </p>
                      </div>

                      {/* Images */}
                      <div className="card-body image-grid">
                        {comment.albums &&
                          comments.albums.length > 0 &&
                          comment.albums.map((src, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={src}
                              alt={`Image ${imgIndex + 1}`}
                              className="thumbnail"
                            />
                          ))}
                      </div>

                      {/* Footer */}
                      <div className="card-footer text-muted">
                        <div className="icon-section d-flex align-items-center py-2">
                          <div className="icon-item me-3">
                            <i className="fas fa-heart"></i> Thích
                          </div>
                          <div className="icon-item me-3">
                            <i className="fas fa-comment-alt"></i> Thảo luận
                          </div>
                          <div className="icon-item">
                            <i className="fas fa-exclamation-triangle"></i> Báo
                            lỗi
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-muted text-center"
                    style={{ fontWeight: "bold" }}
                  >
                    Hiện tại không có bình luận nào.
                  </p>
                )}
              </div>
            )}
            {activeSection === "hinhanhvideo" && (
              <ImagesAndVideosPage albums={comments.albums} />
            )}
            {activeSection === "banbe" && <Friends items={items} />}
            {activeSection === "luutru" && (
              <Collection saved={comments.favoriterestaurants} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
