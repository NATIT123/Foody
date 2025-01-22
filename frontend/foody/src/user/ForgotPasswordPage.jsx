import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert("Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu!");
    } else {
      alert("Vui lòng nhập email của bạn!");
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
        <h4 className="text-center mb-4">Quên mật khẩu</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Gửi hướng dẫn đặt lại mật khẩu
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-decoration-none">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
      <div className="text-center mt-4 px-3 text-muted" style={{ maxWidth: "500px" }}>
        Chúng tôi không sử dụng thông tin của bạn với bất kỳ mục đích nào. Bằng cách yêu cầu đặt lại mật khẩu,
        bạn đồng ý với{" "}
        <a href="#" className="text-decoration-none">
          Chính sách quy định của Foody
        </a>.
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
