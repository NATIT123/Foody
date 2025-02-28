import React, { useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";

const FoodModal = ({
  isOpen,
  onClose,
  foods,
  onUpdateFood,
  restaurant,
  onDeleteFood,
}) => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [priceDiscount, setPirceDiscount] = useState(0);
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // For Add Food modal
  const [deleteFoodId, setDeleteFoodId] = useState(null);

  const handleEditClick = (food) => {
    setShowEditModal(true);
    setId(food._id);
    setName(food.name);
    setPriceOriginal(food.priceOriginal.replace("đ", ""));
    setPirceDiscount(
      food.priceDiscount !== "empty" ? food.priceDiscount.replace("đ", "") : 0
    );
    setPreviewImage(food.image || "");
    setImage(null); // Reset image input
  };

  const handleDeleteClick = (foodId) => {
    setDeleteFoodId(foodId);
    setShowDeleteModal(true);
  };

  const confirmDeleteFood = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/food/deleteFood/${deleteFoodId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          onDeleteFood(deleteFoodId);
          console.log("Food deleted successfully");
        }
      })
      .catch((error) => console.error("Error deleting food:", error));

    setShowDeleteModal(false);
  };

  const handleAddFoodClick = () => {
    setShowAddModal(true);
    setName("");
    setPriceOriginal(0);
    setPirceDiscount(0);
    setPreviewImage("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Handle input change for both edit and add
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "originalPrice") {
      setPriceOriginal(value);
    } else if (name === "discountPrice") {
      setPirceDiscount(value);
    } else {
      setName(value);
    }
  };

  // Save new food item
  const handleSave = (restaurant) => {
    if (!name || !priceOriginal) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("priceOriginal", `${priceOriginal}đ`);
    formData.append("priceDiscount", `${priceDiscount}đ`);
    formData.append("restaurantId", restaurant._id);
    if (image) {
      formData.append("image", image);
    }

    fetch(
      `${process.env.REACT_APP_BASE_URL}/food/${
        id ? `updateFood/${id}` : "addFood"
      }`,
      {
        method: id ? "PATCH" : "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (
          data &&
          data.status !== "fail" &&
          data.status !== "error" &&
          data.status !== 400
        ) {
          const updatedFood = {
            _id: data.data.food._id,
            restaurantId: restaurant._id,
            name,
            priceOriginal: `${priceOriginal}đ`,
            priceDiscount: `${priceDiscount}đ`,
            image: data.data.food.image,
          };
          onUpdateFood(updatedFood);
          console.log("Food saved successfully");
        }
      })
      .catch((error) => console.error("Error saving food:", error));

    setShowEditModal(false);
    setShowAddModal(false);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{restaurant.name} - Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button
          variant="success"
          className="mb-3"
          onClick={() => handleAddFoodClick(restaurant)}
        >
          Add New Food
        </Button>
        <div className="row">
          {foods && foods.length > 0 ? (
            foods.map((food) => (
              <div key={food._id} className="col-md-6 mb-3">
                <Card>
                  <Card.Img
                    variant="top"
                    src={food.image}
                    alt={food.name}
                    style={{ height: "250px", objectFit: "contain" }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{food.name}</Card.Title>
                    <p className="text-danger fw-bold">
                      {food.priceOriginal} VND
                    </p>
                    <p className="text-muted text-decoration-line-through">
                      {food.priceDiscount !== "empty"
                        ? `${food.priceDiscount} VND`
                        : ""}{" "}
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleEditClick(food)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(food._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>Hiện tại không có món ăn nào.</p>
          )}
        </div>
      </Modal.Body>

      {/* Edit Food Modal */}
      {showEditModal && (
        <Modal show={true} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa món ăn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              {previewImage && (
                <div className="text-center mb-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Tên món ăn</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá gốc (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={priceOriginal}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá giảm (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="discountPrice"
                  value={priceDiscount}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="success" onClick={handleSave}>
                Lưu
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Add New Food Modal */}
      {showAddModal && (
        <Modal show={true} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Thêm món ăn mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              {previewImage && (
                <div className="text-center mb-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Tên món ăn</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá gốc (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={priceOriginal}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá giảm (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="discountPrice"
                  value={priceDiscount}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="success" onClick={() => handleSave(restaurant)}>
                Lưu
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {showDeleteModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Restaurant</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div class="modal-body">
                <p>{`Do you want to delete  `} </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDeleteFood}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FoodModal;
