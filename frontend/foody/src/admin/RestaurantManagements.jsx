import React, { useState } from "react";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Chè Sầu - Văn Cao",
      categories: "Ăn vặt/vỉa hè - Món Việt",
      location: "44 Văn Cao, Quận Ba Đình, Hà Nội",
      openHours: "08:00 - 22:00",
      priceRange: "15.000đ - 30.000đ",
      ratings: {
        viTri: 7.5,
        giaCa: 8.0,
        chatLuong: 8.0,
        khongGian: 7.7,
        phucVu: 7.3,
        binhLuan: 6.3,
      },
      image:
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbt9sfun7x7c2@resize_ss640x400",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add", "edit", "view"
  const [formData, setFormData] = useState({});

  const handleOpenModal = (mode, restaurant = null) => {
    setModalMode(mode);
    setIsModalOpen(true);
    if (restaurant) {
      setFormData(restaurant);
    } else {
      setFormData({
        id: Date.now(), // Unique ID for new restaurant
        name: "",
        categories: "",
        location: "",
        openHours: "",
        priceRange: "",
        ratings: {
          viTri: "",
          giaCa: "",
          chatLuong: "",
          khongGian: "",
          phucVu: "",
          binhLuan: "",
        },
        image: "",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSave = () => {
    if (modalMode === "edit") {
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant.id === formData.id ? formData : restaurant
        )
      );
    } else if (modalMode === "add") {
      setRestaurants([...restaurants, formData]);
    }
    handleCloseModal();
  };

  return (
    <div className="container mt-2">
      <h2 className="mb-4 text-center">Restaurant Management</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => handleOpenModal("add")}
      >
        Add Restaurant
      </button>

      <div className="row">
        {restaurants.map((restaurant) => (
          <div className="col-12" key={restaurant.id}>
            <div className="card mb-3 shadow-sm w-100">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="img-fluid rounded-start"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text text-muted">
                      {restaurant.categories}
                    </p>
                    <p className="card-text">
                      <strong>Location:</strong> {restaurant.location}
                    </p>
                    <p className="card-text">
                      <strong>Open Hours:</strong> {restaurant.openHours}
                    </p>
                    <p className="card-text">
                      <strong>Price Range:</strong> {restaurant.priceRange}
                    </p>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleOpenModal("view", restaurant)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleOpenModal("edit", restaurant)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "view"
                    ? "Restaurant Details"
                    : modalMode === "edit"
                    ? "Edit Restaurant"
                    : "Add Restaurant"}
                </h5>
               
              </div>

              <div className="modal-body">
                {modalMode === "view" ? (
                  <div>
                    <h5>{formData.name}</h5>
                    <p><strong>Categories:</strong> {formData.categories}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Open Hours:</strong> {formData.openHours}</p>
                    <p><strong>Price Range:</strong> {formData.priceRange}</p>
                    <p>
                      <strong>Ratings:</strong>
                      <ul>
                        <li>Vị trí: {formData.ratings.viTri}</li>
                        <li>Giá cả: {formData.ratings.giaCa}</li>
                        <li>Chất lượng: {formData.ratings.chatLuong}</li>
                        <li>Không gian: {formData.ratings.khongGian}</li>
                        <li>Phục vụ: {formData.ratings.phucVu}</li>
                        <li>Bình luận: {formData.ratings.binhLuan}</li>
                      </ul>
                    </p>
                    <div
  className="d-flex justify-content-center align-items-center"
  style={{
    height: "300px", // Chiều cao khung ảnh
    overflow: "hidden", // Ẩn nội dung vượt khung
  }}
>
  <img
    src={formData.image}
    alt={formData.name}
    className="img-fluid"
    style={{
      maxWidth: "500px", // Giới hạn chiều rộng
      maxHeight: "250px", // Giới hạn chiều cao
      objectFit: "cover", // Cắt ảnh vừa khung
      borderRadius: "10px", // Bo góc nhẹ
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng
    }}
  />
</div>


                  </div>
                ) : (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Restaurant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Categories</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.categories}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categories: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Open Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.openHours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openHours: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price Range</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.priceRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceRange: e.target.value,
                          })
                        }
                      />
                    </div>
                  </form>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {modalMode !== "view" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
