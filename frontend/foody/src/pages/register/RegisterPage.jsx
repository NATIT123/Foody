import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdAttachEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { callRegister } from "../../services/api";
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate(); // For navigation to the home page

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleChecked = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    document.title = "Đăng ký";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !email ||
      !fullName ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please input fields");
    } else {
      if (!isChecked) {
        toast.error("Please accept the terms.");
      } else {
        try {
          const res = await callRegister({
            fullname: fullName,
            email,
            password,
            phone,
            address,
            confirmPassword,
          });
          if (res.status === "success") {
            toast.success("Register successully. Please sign in.");
            navigate("/");
          }
        } catch (err) {
          toast.error("Error register user.");
        }
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
        <h4 className="text-center mb-4">Đăng ký tài khoản Foody.vn</h4>
        <form onSubmit={handleSubmit}>
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
                onChange={handleEmailChange}
                type="email"
                className="form-control"
                placeholder="Email của bạn"
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
              <FaUser
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                onChange={handleFullNameChange}
                type="text"
                className="form-control"
                placeholder="FullName của bạn"
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
              <FaPhone
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                min={0}
                onChange={handlePhoneChange}
                type="number"
                className="form-control"
                placeholder="Phone của bạn"
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
              <FaRegAddressBook
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                onChange={handleAddressChange}
                type="text"
                className="form-control"
                placeholder="Address của bạn"
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
                onChange={handlePasswordChange}
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
              <RiLockPasswordFill
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
                id="termsAndConditions"
                checked={isChecked}
                onChange={handleChecked}
              />
              <label htmlFor="termsAndConditions" className="ms-2">
                Tôi đồng ý với{" "}
                <a href="/" className="text-decoration-none">
                  Chính sách quy định của Foody
                </a>
              </label>
            </div>
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Đăng ký
          </button>
        </form>
        <div className="text-center mt-4">
          Đã có tài khoản tại Foody.vn?{" "}
          <a href="/login" className="text-decoration-none">
            Đăng nhập
          </a>
        </div>
      </div>
      <div
        className="text-center mt-4 px-3 text-muted"
        style={{ maxWidth: "500px" }}
      >
        Chúng tôi không sử dụng thông tin của bạn với bất kỳ mục đích nào. Bằng
        cách đăng ký, bạn đồng ý với{" "}
        <a href="/" className="text-decoration-none">
          Chính sách quy định của Foody
        </a>
        .
      </div>
    </div>
  );
};

export default RegisterPage;
