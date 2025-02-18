import React, { useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";

const FoodModal = ({ isOpen, onClose, food, name }) => {
  const [editFood, setEditFood] = useState(null);
  const handleEditClick = (food) => {
    setEditFood({ ...food }); // Copy thông tin món ăn để chỉnh sửa
  };

  // Xử lý cập nhật giá trị input
  const handleChange = (e) => {
    setEditFood({ ...editFood, [e.target.name]: e.target.value });
  };

  // Xử lý lưu chỉnh sửa
  const handleSave = () => {
    setEditFood(null); // Đóng form edit
  };
  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{food?.name} - Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {food && food.length > 0 ? (
            food.map((food) => (
              <div key={food.id} className="col-md-6 mb-3">
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
      {editFood && (
        <Modal show={true} onHide={() => setEditFood(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa món ăn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên món ăn</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editFood.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá gốc (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={editFood.priceOriginal}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá giảm (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="discountPrice"
                  value={editFood.priceDiscount}
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
    </Modal>
  );
};

export default FoodModal;
