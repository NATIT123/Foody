
const LoginModal = ({ show, onClose, onLogin }) => {
    if (!show) return null;
  
    return (
      <div
        className="modal fade show d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1051,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="modal-dialog"  style={{
            marginTop: "100px", // Tạo khoảng cách từ trên xuống
            transform: "translateY(20px)", // Dịch chuyển modal xuống thêm
          }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Đăng nhập hệ thống</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>Vui lòng đăng nhập để thực hiện chức năng này.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onLogin}>
                Đăng nhập
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default LoginModal;
  