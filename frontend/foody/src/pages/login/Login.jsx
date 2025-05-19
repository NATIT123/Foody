import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "bootstrap/dist/css/bootstrap.min.css";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callLogin } from "../../services/api";
import { useAppDispatch } from "../../redux/hooks";
import { doLoginAction } from "../../redux/account/accountSlice";
import { notification } from "antd";
const LoginPage = () => {
  const [email, setEmail] = useState(""); // To store email input
  const [password, setPassword] = useState(""); // To store password input
  const navigate = useNavigate(); // For navigation to the home page
  const [isSaved, setIsSaved] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleChecked = (event) => {
    setIsSaved(event.target.checked);
  };
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation (you can replace this with an actual API call)
    if (email && password) {
      // Redirect to home page
      const res = await callLogin(email, password);
      if (res?.data) {
        if (isSaved) {
          localStorage.setItem("email", email);
        }
        localStorage.setItem("access_token", res.access_token);
        dispatch(doLoginAction(res.data));
        toast.success("Login Successfully");
        navigate("/");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description:
            res.message && Array.isArray(res.message)
              ? res.message[0]
              : res.message,
          duration: 5,
        });
      }
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
        <h4 className="text-center mb-4">Đăng nhập </h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <MdAttachEmail
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="Tên đăng nhập hoặc email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                required
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  flex: "1",
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <RiLockPasswordLine
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />

              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                required
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  flex: "1",
                }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                checked={isSaved}
                onChange={handleChecked}
              />
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
