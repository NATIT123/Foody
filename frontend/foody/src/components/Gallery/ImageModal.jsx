import React, { useState } from "react";
import { useData } from "../../context/DataContext";
const ImageModal = ({ restaurant, item, onClose, setItem }) => {
  const { state } = useData();
  const [newImage, setNewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmUpload = () => {
    if (!state.loading && !state.user) return;
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", newImage);
      formData.append("userId", state.user._id);
      formData.append("restaurantId", restaurant._id);
      fetch(`${process.env.REACT_APP_BASE_URL}/album/addAlbum`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setItem([{ image: selectedImage }, ...item]);
              console.log("Success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      setSelectedImage(null);
      setNewImage(null);
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1051,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content p-3">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Thêm hình ảnh</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-center">
            <h6 className="mb-1">{restaurant.name}</h6>
            <p className="text-muted mb-3">{restaurant.address}</p>

            {/* Image Upload Section */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            {selectedImage && (
              <div className="mb-3">
                <img
                  src={selectedImage}
                  alt="Xem trước"
                  className="rounded"
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                    padding: "5px",
                  }}
                />
              </div>
            )}

            {selectedImage && (
              <button
                className="btn btn-primary w-100"
                onClick={handleConfirmUpload}
              >
                Xác nhận thêm ảnh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
