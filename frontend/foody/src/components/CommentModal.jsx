import { useState } from "react";

const CommentModal = ({ show, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment);
    setComment(""); // Reset comment sau khi gửi
    onClose(); // Đóng modal
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)", // Làm mờ nền
        zIndex: 1051,
        display: "flex", // Đảm bảo modal được căn giữa
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="modal-dialog"
        style={{
          marginTop: "100px", // Tạo khoảng cách từ trên xuống
          transform: "translateY(20px)", // Dịch chuyển modal xuống thêm
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm bình luận</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommentModal;
