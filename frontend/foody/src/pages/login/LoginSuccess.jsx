import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { doLoginGoogleAction } from "../../redux/account/accountSlice";
import { callFetchAccount } from "../../services/api";
const LoginSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const token = query.get("token");
        if (token) {
          localStorage.setItem("access_token", token);
        } else {
          navigate("/login");
        }
        const response = await callFetchAccount();
        if (response.status === "success") {
          dispatch(doLoginGoogleAction(response.data));
          toast.success("Đăng nhập thành công!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        toast.error("Đã xảy ra lỗi khi đăng nhập.");
        navigate("/login");
      }
    };
    fetchAccount();
  }, []);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default LoginSuccess;
