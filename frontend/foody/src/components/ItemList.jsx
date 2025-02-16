import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaCamera, FaBookmark } from "react-icons/fa";
import LoginModal from "./LoginModal";
import GalleryModal from "./GalleryModal";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const ItemList = ({ currentItems, handleShowModal }) => {
  const navigate = useNavigate(); // Hook điều hướng
  const { state } = useData();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedItem, setItem] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };
  useEffect(() => {
    console.log(currentItems);
  }, [currentItems]);
  const handleOpenSaveModal = () => {
    if (!state.loading && !state.user) {
      setShowLoginModal(true);
    }
  };
  return (
    <div className="row">
      {currentItems && currentItems.length > 0 ? (
        currentItems.map((item) => (
          <div
            key={item._id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card h-100">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.name}
                style={{ objectFit: "cover", height: "180px" }}
              />
              <div className="card-body">
                <Link
                  to={`/details/${item._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <h4
                    className="card-title text-truncate"
                    style={{
                      fontSize: "14px",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    {item.name}
                  </h4>
                </Link>

                <h6 className="card-subtitle mb-2 text-muted text-truncate">
                  {item.address}
                </h6>
                <hr
                  style={{
                    flex: 1,
                    border: 0,
                    height: "1px",
                    background: "#ccc",
                  }}
                />
                {item.commentCount > 0 ? (
                  <h6 className="card-subtitle mb-2 text-muted d-flex justify-content-start align-items-center">
                    {/* User Avatar */}
                    {item?.comments[0]?.user?.photo && (
                      <img
                        src={
                          item?.comments[0].user.photo === "default.jpg"
                            ? "/images/default.jpg"
                            : item?.comments[0].user.photo
                        }
                        alt="User Avatar"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    )}

                    {/* User Name and Description */}
                    <span
                      className="d-flex align-items-center ms-2"
                      style={{
                        color: "#333",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.comments[0]?.user?.fullname
                        ? item.comments[0]?.user?.fullname.substring(0, 5)
                        : "Ẩn danh"}{" "}
                    </span>
                    <span
                      className="d-flex align-items-center ms-2 text-muted text-truncate"
                      style={{ color: "#444" }}
                    >
                      {item.comments[0]?.description
                        ? item.comments[0].description.substring(0, 15)
                        : "Không có tiêu đề"}
                    </span>
                  </h6>
                ) : (
                  <p className="text-muted fw-bold">Không có bình luận</p>
                )}

                <hr
                  style={{
                    flex: 1,
                    border: 0,
                    height: "1px",
                    background: "#ccc",
                  }}
                />
                <div className="mb-0 d-flex justify-content-between align-items-center">
                  <div
                    className="d-flex align-items-center"
                    style={{ fontSize: "14px" }}
                  >
                    <FaComment
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowModal(item)}
                    />
                    <span className="ms-1">{item?.commentCount || 0}</span>

                    <FaCamera
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      onClick={() => {
                        setShowGalleryModal(true);
                        setItem(item);
                      }}
                    />
                    <span className="ms-1">{item?.albumCount || 0}</span>
                  </div>

                  <div
                    style={{ backgroundColor: "#f5f5f5" }}
                    onClick={handleOpenSaveModal}
                  >
                    <span className="text-muted d-flex align-items-center">
                      <FaBookmark /> {"Lưu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center w-100">
          <h5 className="text-muted mt-3">Hiện tại không có nhà hàng nào.</h5>
        </div>
      )}
      {showGalleryModal && (
        <GalleryModal
          item={selectedItem}
          onClose={() => setShowGalleryModal(false)}
        />
      )}
      <LoginModal
        show={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
        }}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default ItemList;
