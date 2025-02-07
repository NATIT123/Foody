import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const { state } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false); // For phone number modal
  const [newPhone, setNewPhone] = useState(""); // New phone number input
  const [showPasswordFields, setShowPasswordFields] = useState(false); // For password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.user && !state.loading) {
        navigate("/");
      } else if (state.user) {
        const currentUser = state.user;
        setName(currentUser.fullname);
        setEmail(currentUser.email);
        setPhone(currentUser.phone);
        setProfilePic(currentUser.photo);
      }
    }, 100);

    return () => clearTimeout(timer); // Cleanup tránh memory leak
  }, [navigate, state.user, state.loading]);

  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const handleSaveChanges = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Mật khẩu đã được thay đổi!");
    setShowPasswordFields(false); // Hide password fields
  };

  const handleChangePhone = () => {
    setShowModal(true); // Show phone number modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close phone number modal
  };

  const handleSavePhone = () => {
    setPhone(newPhone); // Save phone number
    setShowModal(false); // Close modal
    alert("Số điện thoại đã được cập nhật!");
  };

  const handleSavePassword = () => {};

  const handleDeleteAccount = () => {
    alert("Xóa tài khoản!");
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="list-group">
              <button className="list-group-item list-group-item-action active">
                <i className="bi bi-person-fill me-2"></i>Cập nhật tài khoản
              </button>
              <button className="list-group-item list-group-item-action">
                <i className="bi bi-basket-fill me-2"></i>Thông tin đơn hàng
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="col-md-9 mb-2">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Thông tin người dùng</h5>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleDeleteAccount}
                  >
                    Xóa tài khoản
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Tải Ảnh đại diện</label>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        profilePic === "default.jpg"
                          ? "/images/default.jpg"
                          : profilePic
                      }
                      alt="Profile"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#6c757d",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        marginRight: "15px",
                      }}
                    ></img>
                    <div>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                      <small className="text-muted">
                        Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5MB.
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3">Cập nhật</button>
                </div>

                <hr />

                {/* User Information */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name && name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email && email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Mật khẩu</label>
                  {!showPasswordFields ? (
                    <>
                      <input
                        type="password"
                        className="form-control"
                        value="********"
                        disabled
                      />
                      <button
                        className="btn btn-link"
                        onClick={() => setShowPasswordFields(true)}
                      >
                        Đổi mật khẩu
                      </button>
                    </>
                  ) : (
                    <div>
                      <label className="form-label">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <label className="form-label">
                        Nhập lại mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Lưu thay đổi
                </button>

                <hr />

                {/* Phone Number Management */}
                <div className="mb-3">
                  <h6 className="fw-bold">Quản lý số điện thoại</h6>
                  <p>{phone && phone}</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleChangePhone}
                  >
                    Cập nhật số điện thoại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cập nhật số điện thoại</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Số điện thoại mới</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePhone}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProfilePage;
