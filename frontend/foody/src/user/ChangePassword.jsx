import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { RiLockPasswordFill } from "react-icons/ri";
import { useData } from "../context/DataContext";

const ChangePasswordPage = () => {
  const { resetToken } = useParams();
  const { state, logout } = useData();
  const navigate = useNavigate(); // For navigation to the home page
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    if (!state.loading && state.user) {
      if (state.user.role === "admin" || state.user.role === "owner")
        navigate("/dashboard");
      if (state.user.role === "user") navigate("/");
    }
  }, [navigate, state.user, state.loading]);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    document.title = `Thay đổi mật khẩu`;
  }, []);

  useEffect(() => {
    if (resetToken) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/user/checkPassword/${resetToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (data.status === "fail" || data.status === "error") {
              navigate("/forgot");
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          navigate("/forgot");
        });
    }
  }, [resetToken, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password && confirmPassword) {
      if (resetToken) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}/user/resetPassword/${resetToken}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password,
              confirmPassword,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setMessage(data.message);
              setShowModal(true);
              setStatus(data.status);
              if (data.status !== "fail" && data.status !== "error") {
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                  logout();
                  navigate("/");
                }, 3000);
              } else {
                navigate("/forgot");
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            setMessage("Something went wrong, please try again.");
            setShowModal(true);
            navigate("/forgot");
          });
      } else {
        setStatus("fail");
        setShowModal(true);
        setMessage("Reset token is missing.");
      }
    } else {
      setStatus("fail");
      setShowModal(true);
      setMessage("Please enter your password!");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {showModal ? (
        <Alert
          className="d-flex flex-column align-items-center text-center"
          variant={`${
            status === "fail" || status === "error" ? "danger" : "success"
          }`}
          onClick={() => setShowModal(false)}
          dismissible
        >
          <Alert.Heading>
            {" "}
            {`${status === "fail" || status === "error" ? "Error" : "Success"}`}
          </Alert.Heading>
          <p>{message}</p>
        </Alert>
      ) : (
        <div></div>
      )}
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
        <h4 className="text-center mb-4">Thay đổi mật khẩu</h4>
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
              <TbLockPassword
                style={{ marginRight: "8px", color: "#888", fontSize: "20px" }}
              />
              <input
                type="Password"
                className="form-control"
                placeholder="Nhập mật khẩu mới của bạn"
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
                type="Password"
                className="form-control"
                placeholder="Xác nhận mật khẩu mới của bạn"
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

          <button className="btn btn-primary w-100" type="submit">
            Thay đổi mật khẩu
          </button>
        </form>
      </div>
      <div
        className="text-center mt-4 px-3 text-muted"
        style={{ maxWidth: "500px" }}
      >
        Chúng tôi không sử dụng thông tin của bạn với bất kỳ mục đích nào. Bằng
        cách yêu cầu đặt lại mật khẩu, bạn đồng ý với{" "}
        <button
          className="text-decoration-none btn btn-link"
          onClick={() => alert("Chính sách quy định của Foody")}
        >
          Chính sách quy định của Foody
        </button>
        .
      </div>
    </div>
  );
};

export default ChangePasswordPage;
