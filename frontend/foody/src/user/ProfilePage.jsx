import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Alert from "react-bootstrap/Alert";
const ProfilePage = () => {
  const { state, logout } = useData();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false); // For password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.loading && !state.user) {
        navigate("/");
      } else if (state.user) {
        const currentUser = state.user;
        setName(currentUser.fullname);
        setEmail(currentUser.email);
        setPhone(currentUser.phone);
        setImageUrl(currentUser.photo);
      }
    }, 100);

    return () => clearTimeout(timer); // Cleanup tránh memory leak
  }, [navigate, state.user, state.loading]);

  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const handleSaveChanges = () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      setMessage("Vui lòng nhập mật khẩu");
      setShowModal(true);
      setStatus("fail");
      return;
    } else if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không trùng khớp");
      setShowModal(true);
      setStatus("fail");
      return;
    } else {
      fetch(`${process.env.REACT_APP_BASE_URL}/user/updatePassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({
          password: currentPassword,
          newPassword,
          confirmPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setMessage(data.message);
            setShowModal(true);
            setStatus(data.status);
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setNewPassword("");
              setConfirmPassword("");
              setCurrentPassword("");
              setShowPasswordFields(false);
              logout();
              window.location.reload();
            }
          }
        })
        .catch((error) => {
          setStatus("error");
          setShowModal(true);
          setMessage(error.message);
        });
    }
  };

  const handleUploadPhoto = async () => {
    if (!profilePic) {
      setMessage("Vui lòng chọn ảnh");
      setShowModal(true);
      setStatus("fail");
      return;
    }
    const formData = new FormData();
    formData.append("image", profilePic);
    fetch(`${process.env.REACT_APP_BASE_URL}/user/uploadPhoto`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setMessage(data.message);
          setShowModal(true);
          setStatus(data.status);
          if (
            data.status === "fail" ||
            data.status !== "error" ||
            data.status !== 400
          ) {
            setImageUrl(data.data.photo);
          }
        }
      })
      .catch((error) => {
        setStatus("error");
        setShowModal(true);
        setMessage(error.message);
      });
  };

  return (
    <div>
      <Header />
      {showModal ? (
        <Alert
          className="d-flex flex-column align-items-center text-center"
          variant={`${
            status === "fail" || status === "error" || status === 400
              ? "danger"
              : "success"
          }`}
          onClick={() => setShowModal(false)}
          dismissible
        >
          <Alert.Heading>
            {status === "fail" || status === "error" || status === 400
              ? "Error"
              : "Success"}
          </Alert.Heading>
          <p>{message}</p>
        </Alert>
      ) : (
        <div></div>
      )}
      <div className="container mt-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="list-group">
              <button className="list-group-item list-group-item-action active">
                <i className="bi bi-person-fill me-2"></i>Cập nhật tài khoản
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="col-md-9 mb-2">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Thông tin người dùng</h5>
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Tải Ảnh đại diện</label>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        imageUrl === "default.jpg"
                          ? "/images/default.jpg"
                          : imageUrl
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
                  <button
                    className="btn btn-primary mt-3"
                    onClick={handleUploadPhoto}
                  >
                    Cập nhật
                  </button>
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
                      <label className="form-label">
                        Nhập mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
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

                  <input
                    type="email"
                    className="form-control"
                    value={phone && phone}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
