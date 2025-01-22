import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import CommentModal from "./CommentModal";


const Modal = ({ show, onClose, item }) => {
    const navigate = useNavigate(); // Hook điều hướng

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const handleLogin = () => {
   
      setShowLoginModal(false);
      setShowCommentModal(false); 
      navigate("/login"); // Chuyển hướng sang trang đăng nhập
    };

    const handleCommentSubmit = (comment) => {
      console.log("New Comment:", comment);
      // Thêm xử lý lưu bình luận nếu cần
    };
    const handleOpenCommentModal = () => {
      const userEmail = sessionStorage.getItem("userEmail");
      if (!userEmail) {
        // Hiển thị modal đăng nhập nếu chưa có userEmail
        setShowLoginModal(true);
      } else {
        // Mở modal thêm bình luận nếu đã đăng nhập
        setShowCommentModal(true);
      }
    };
    if (!show) return null;
    
    // Mock đánh giá chi tiết
    const ratings = [
      { category: "Vị trí", value: 7.0 },
      { category: "Giá cả", value: 7.0 },
      { category: "Chất lượng", value: 7.0 },
      { category: "Phục vụ", value: 7.0 },
      { category: "Không gian", value: 7.0 },
    ];
  
    return (
      <div
        className="modal fade show d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{item.title}</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
            <div
  className="d-flex gap-4 mb-4"
  style={{
    alignItems: "flex-start", // Căn chỉnh các thành phần đầu hàng trên
  }}
>
  {/* Ảnh và mô tả */}
  <div
  className="d-flex flex-column align-items-start"
  style={{
    width: "210px", // Đặt chiều rộng cố định cho phần ảnh và mô tả
    flexShrink: 0, // Ngăn không cho phần này bị co lại
  }}
>
  {/* Hình ảnh */}
  <img
    src={item.imgSrc}
    alt={item.title}
    className="img-fluid"
    style={{
      width: "100%", // Chiều rộng chiếm toàn bộ container
      height: "150px", // Chiều cao cố định
      objectFit: "cover", // Đảm bảo ảnh không bị méo
      borderRadius: "8px",
      marginBottom: "10px", // Khoảng cách giữa ảnh và mô tả
    }}
  />

  {/* Mô tả */}
  <div className="mb-3">
    <p
      style={{
        fontSize: "12px",
        marginBottom: "4px",
      }}
    >
      {item.subtitle}
    </p>
    <p style={{ margin: 0 }}>{item.description}</p>
  </div>

  {/* Nút Viết bình luận */}
  <button
    className="btn btn-primary w-100"
    onClick={handleOpenCommentModal}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px", // Khoảng cách giữa icon và text
      fontSize: "14px",
    }}
  >
    <i className="bi bi-chat-dots"></i>
    Viết bình luận
  </button>

  <h6 className="mt-2">Đánh giá</h6>
              <div className="mb-3">
              <div className="d-flex justify-content-evenly" style={{ fontSize: "12px", width: "100%" }}>
  <div className="d-flex flex-column align-items-center">
    <span>0</span>
    <span>Tuyệt vời</span>
  </div>
  <div className="d-flex flex-column align-items-center">
    <span>1</span>
    <span>Khá tốt</span>
  </div>
  <div className="d-flex flex-column align-items-center">
    <span>0</span>
    <span>Trung bình</span>
  </div>
  <div className="d-flex flex-column align-items-center">
    <span>0</span>
    <span>Kém</span>
  </div>
</div>

  <hr />
  <div style={{ width: "100%" }}>
    {ratings.map((rating, index) => (
      <div
        key={index}
        className="d-flex justify-content-between align-items-center mb-2"
        style={{ fontSize: "12px", width: "100%" }}
      >
        <span style={{ width: "70px", fontSize: "12px" }}>{rating.category}</span> {/* Giảm width ở đây */}
        <div className="progress" style={{ height: "8px", width: "100px" }}> {/* Giảm chiều rộng của thanh progress */}
          <div
            className="progress-bar bg-danger"
            role="progressbar"
            style={{ width: `${rating.value * 10}%` }}
          />
        </div>
        <span style={{ width: "20px", textAlign: "right", fontSize: "12px" }}>{rating.value.toFixed(1)}</span> {/* Giảm width ở đây */}
      </div>
    ))}
  </div>
</div>
</div>


  {/* Phần bình luận */}
  <div style={{ flex: 1 }}>
  {/* Bình luận */}
  <h6 className="mb-3" style={{ fontWeight: "bold", color: "#333" }}>Bình luận</h6>
  <div
    style={{
     
      maxHeight :"415px",
      overflowY: "auto", // Thêm thanh cuộn dọc nếu nội dung vượt quá chiều cao
      padding: "10px", // Khoảng cách nội dung
      border: "1px solid #ddd", // Viền xung quanh cho phần bình luận
      borderRadius: "8px", // Bo tròn viền
      backgroundColor: "#ffffff", // Màu nền sáng
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
    }}
  >
    {item.reviews && item.reviews.length > 0 ? (
      item.reviews.map((review, index) => (
        <div
          key={index}
          className="p-3 mb-3"
          style={{
            borderRadius: "8px", // Bo tròn mỗi bình luận
            backgroundColor: "#f9f9f9", // Nền nhạt cho từng bình luận
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Hiệu ứng nổi nhẹ
          }}
        >
          {/* Avatar và thông tin người dùng */}
          <div className="d-flex align-items-center mb-2">
            <img
              src="https://via.placeholder.com/40" // Đường dẫn avatar (thay thế khi cần)
              alt="Avatar"
              className="rounded-circle me-3"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                border: "1px solid #ddd",
              }}
            />
            <div>
              <strong style={{ fontSize: "14px", color: "#333" }}>
                {review.user}
              </strong>
              <span
                className="text-muted ms-2"
                style={{ fontSize: "12px", display: "block" }}
              >
                {review.time}
              </span>
            </div>
          </div>

          {/* Nội dung bình luận */}
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              marginBottom: "8px",
              lineHeight: "1.5",
            }}
          >
            {review.comment}
          </p>

          {/* Tùy chọn (Thích, Thảo luận, Báo lỗi) */}
          <div
            className="d-flex gap-4 mt-2"
            style={{ fontSize: "12px", color: "#888", cursor: "pointer" }}
          >
            <span style={{ fontWeight: "bold" }}>Thích</span>
            <span style={{ fontWeight: "bold" }}>Thảo luận</span>
            <span style={{ fontWeight: "bold" }}>Báo lỗi</span>
          </div>
        </div>
      ))
    ) : (
      <p
        style={{
          fontSize: "14px",
          textAlign: "center",
          color: "#999",
          marginTop: "20px",
        }}
      >
        Chưa có bình luận nào.
      </p>
    )}
  </div>
</div>

</div>




        
            </div>
            <div className="modal-footer">
              
            </div>
          </div>
        </div>

        <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
        <CommentModal
        show={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleCommentSubmit}
      />
      </div>
    );
  };
  export default Modal;