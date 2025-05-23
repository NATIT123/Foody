import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { callVnPayIpn, callVnPayReturn } from "../../services/api";
import { useAppDispatch } from "../../redux/hooks";
import { doPlaceOrderAction } from "../../redux/order/orderSlice";
const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const queryString = location.search;
    const fetchTransaction = async () => {
      try {
        const res = await callVnPayReturn(queryString);
        const res1 = await callVnPayIpn(queryString);

        if (res.status === "success" && res1.status === "success") {
          toast.success("🎉 Thanh toán thành công!");
          dispatch(doPlaceOrderAction());
        } else {
          toast.error("⚠️ Không tìm thấy giao dịch.");
        }
      } catch (err) {
        toast.error(`🚨 ${err.message} .`);
      }
    };

    fetchTransaction();
  }, [location.search]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
        alt="Thanh toán thành công"
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
      <h2 style={{ color: "green", marginBottom: 20 }}>
        Thanh toán thành công!
      </h2>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "6px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default PaymentResult;
