import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState(""); // To store email input
  const [password, setPassword] = useState(""); // To store password input
  const navigate = useNavigate(); // For navigation to the home page

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation (you can replace this with an actual API call)
    if (email && password) {
      // Save email to session storage
      sessionStorage.setItem("userEmail", email);

      // Redirect to home page
      navigate("/");
    } else {
      alert("Vui lòng nhập đầy đủ thông tin đăng nhập.");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="text-center mb-4">
        <img
          src="https://id.foody.vn/Content/images/foody-corp.png"
          alt="Foody Logo"
          style={{ width: "120px" }}
        />
      </div>
      <div
        className="p-4 rounded shadow-sm bg-white"
        style={{ width: "400px", maxWidth: "90%" }}
      >
        <h4 className="text-center mb-4">Đăng nhập FDID</h4>
        <button className="btn btn-success w-100 mb-2">
          <i className="bi bi-phone-fill me-2"></i>
          ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI
        </button>
        <button className="btn btn-primary w-100 mb-3">
          <i className="bi bi-facebook me-2"></i>
          ĐĂNG NHẬP BẰNG FACEBOOK
        </button>
        <div className="text-center text-muted mb-3">hoặc bằng email</div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Tên đăng nhập hoặc email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="ms-2">
                Lưu đăng nhập
              </label>
            </div>
            <a href="/forgot" className="text-decoration-none">
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>
        <div className="text-center mt-4">
          Chưa có tài khoản tại Foody.vn?{" "}
          <a href="/register" className="text-decoration-none">
            Đăng ký
          </a>
        </div>
      </div>
      <div
        className="text-center mt-4 px-3 text-muted"
        style={{ maxWidth: "500px" }}
      >
        Chúng tôi không sử dụng thông tin của bạn với bất kỳ mục đích nào. Bằng
        cách đăng nhập hoặc đăng ký, bạn đồng ý với{" "}
        <a href="/" className="text-decoration-none">
          Chính sách quy định của Foody
        </a>
        .
      </div>
    </div>
  );
};

export default LoginPage;
