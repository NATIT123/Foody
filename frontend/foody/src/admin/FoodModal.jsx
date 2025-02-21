import React, { useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";

const FoodModal = ({ isOpen, onClose, foods, onUpdateFood, restaurant }) => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [priceDiscount, setPirceDiscount] = useState(0);
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditClick = (food) => {
    setShowEditModal(true);
    setId(food._id);
    setName(food.name);
    setPriceOriginal(food.priceOriginal.replace("đ", ""));
    setPirceDiscount(
      food.priceDiscount !== "empty" ? food.priceDiscount.replace("đ", "") : 0
    );

    // Nếu có ảnh, lưu vào previewImage
    setPreviewImage(food.image || "");
    setImage(null); // Đặt lại file ảnh
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
    }
  };

  // Xử lý cập nhật giá trị input
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

  // Xử lý lưu chỉnh sửa
  const handleSave = () => {
    if (!id) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("priceOriginal", `${priceOriginal}đ`);
    formData.append("priceDiscount", `${priceDiscount}đ`);

    if (image) {
      formData.append("image", image); // Chỉ gửi ảnh nếu người dùng chọn mới
    }

    fetch(`${process.env.REACT_APP_BASE_URL}/food/updateFood/${id}`, {
      method: "PATCH",
      body: formData,
    })
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
          onUpdateFood(updatedFood); // Cập nhật món ăn trong danh sách
          console.log("Update food successfully");
        }
      })
      .catch((error) => console.error("Error updating food:", error));

    setShowEditModal(false);
  };
  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{restaurant.name} - Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleEditClick(food)}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>Hiện tại không có món ăn nào.</p>
          )}
        </div>
      </Modal.Body>

      {/* Form Edit */}
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
              <Button variant="success" onClick={() => handleSave()}>
                Lưu
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Modal>
  );
};

export default FoodModal;
