import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaCamera, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GalleryModal from "../Gallery/GalleryModal";
import LoginModal from "../Login/LoginModal";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import {
  callAddFavoriteRestaurant,
  callSavedRestaurant,
} from "../../services/api";
import { addNotification } from "../../redux/notification/notificationSlice";
const ItemList = ({ currentItems, handleShowModal }) => {
  const navigate = useNavigate(); // Hook điều hướng
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedItem, setItem] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [savedRestaurant, setSavedRestaunrant] = useState([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const isLoading = useAppSelector((state) => state.account.loading);
  const getSavedRestaurant = async () => {
    if (!isLoading && user._id) {
      try {
        const res = await callSavedRestaurant(user._id);
        const data = res.data;

        if (
          res.status !== "error" &&
          res.status !== "fail" &&
          res.status !== 400
        ) {
          setSavedRestaunrant(data.data);
        }
      } catch (error) {
        toast.error("Error fetching saved restaurants:", error);
      }
    }
  };
  useEffect(() => {
    if (!isLoading && !user) return;
    getSavedRestaurant();
  }, [isLoading, user]);
  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };
  const handleOpenSaveModal = async (id, name) => {
    if (!isLoading && !user) {
      setShowLoginModal(true);
      return;
    }

    if (user) {
      const payload = {
        userId: user._id,
        restaurantId: id,
      };

      try {
        const res = await callAddFavoriteRestaurant(payload);
        const data = res.data;
        console.log(data);
        if (
          res.status !== "error" &&
          res.status !== "fail" &&
          res.status !== 400
        ) {
          if (data.active) {
            setSavedRestaunrant([data.data, ...savedRestaurant]);
            dispatch(
              addNotification({
                message: `Saved restaurant ${name} successfully.`,
                userId: user._id,
              })
            );
            toast.success(`Saved restaurant ${name} successfully.`);
          } else {
            setSavedRestaunrant(
              savedRestaurant.filter((savedId) => savedId !== data.data)
            );
            toast.success(`Unsaved restaurant ${name} successfully.`);
            dispatch(
              addNotification({
                message: `Restaurant ${name} successfully unsaved`,
                userId: user._id,
              })
            );
          }
        } else {
          toast.error("Failed to save favorite restaurant:", data.message);
        }
      } catch (error) {
        console.error("Error saving favorite restaurant:", error);
      }
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
                  target="_blank"
                  rel="noopener noreferrer"
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
                          item?.comments[0]?.user.photo === "default.jpg"
                            ? "/images/default.jpg"
                            : item?.comments[0]?.user.photo
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
                      {item?.comments[0]?.user?.fullname
                        ? item?.comments[0]?.user?.fullname.substring(0, 5)
                        : "Ẩn danh"}{" "}
                    </span>
                    <span
                      className="d-flex align-items-center ms-2 text-muted text-truncate"
                      style={{ color: "#444" }}
                    >
                      {item?.comments[0]?.description
                        ? item?.comments[0]?.description.substring(0, 15)
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
                    onClick={() => {
                      handleOpenSaveModal(item._id, item.name);
                    }}
                  >
                    <span className="text-muted d-flex align-items-center">
                      <FaBookmark />{" "}
                      {savedRestaurant.includes(item._id.toString())
                        ? "Đã Lưu"
                        : "Lưu"}
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
