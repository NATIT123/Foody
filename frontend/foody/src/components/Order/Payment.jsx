import { Col, Divider, Form, Radio, Row, message, notification } from "antd";
import { DeleteTwoTone, LoadingOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import { Input } from "antd";
import { callFetchListBanks, callPlaceOrder } from "../../services/api";
import axios from "axios";
import "../../css/Payment.css";
import { toast } from "react-toastify";
const { TextArea } = Input;

const Payment = (props) => {
  const carts = useAppSelector((state) => state.order.carts);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useAppDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const user = useAppSelector((state) => state.account.user);
  const [form] = Form.useForm();
  const paymentMethod = Form.useWatch("paymentMethod", form);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [initialBanks, setInitialBanks] = useState([]);
  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      let currentPrice = 0;
      carts.map((item) => {
        currentPrice =
          item.detail.priceDiscount === "empty"
            ? item.detail.priceOriginal
            : item.detail.priceDiscount;
        sum +=
          item.quantity *
          Number(
            currentPrice
              .substring(0, currentPrice.length - 1)
              .replace(/\./g, "")
          );
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  useEffect(() => {
    const getAllBanks = async () => {
      try {
        const res = await callFetchListBanks();

        if (res.status === "success") {
          setBanks(res.data);
          setInitialBanks(res.data);
        }
      } catch (error) {
        toast.error("Error fetching banks:", error);
      }
    };
    getAllBanks();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      const filteredBanks = banks.filter((bank) =>
        bank.bank_name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setBanks(filteredBanks);
    } else {
      setBanks(initialBanks);
    }
  }, [searchKeyword]);

  const handleChange = (e) => {
    setSelectedBank(e.target.value);
  };

  // const handlePlaceOrder = () => {
  //     if (!address) {
  //         notification.error({
  //             message: "Đã có lỗi xảy ra",
  //             description: "Thông tin địa chỉ không được để trống!"
  //         })
  //         return;
  //     }
  //     props.setCurrentStep(2);
  // }

  const onFinish = async (values) => {
    setIsSubmit(true);
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    if (values.paymentMethod === "vnpay") {
      // Gọi API tạo thanh toán VNPay
      try {
        const res = await axios.post("http://localhost:5000/api/payment", {
          amountInput: totalPrice,
          contentPayment: "Thanh toán đơn hàng",
          productTypeSelect: "other",
          bankSelect: values.bankCode,
          langSelect: "vn",
        });

        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          return;
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tạo thanh toán VNPay",
          });
        }
      } catch (e) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tạo thanh toán VNPay",
        });
      }
    } else {
      // Thanh toán khi nhận hàng
      const res = await callPlaceOrder(data);
      if (res && res.data) {
        message.success("Đặt hàng thành công !");
        dispatch(doPlaceOrderAction());
        props.setCurrentStep(2);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res.message,
        });
      }
    }

    setIsSubmit(false);
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {carts?.map((food, index) => {
          const currentFoodPrice =
            food?.detail.priceDiscount === "empty"
              ? food.detail.priceOriginal
              : food.detail.priceDiscount ?? 0;
          return (
            <div className="order-book" key={food._id}>
              <div className="book-content">
                <img src={food.detail.image} alt={food?.detail.name || ""} />
                <div className="title">{food?.detail?.name}</div>
                <div className="price">{currentFoodPrice}</div>
              </div>
              <div className="action">
                <div className="quantity">Số lượng: {food?.quantity}</div>
                <div className="sum">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    Number(
                      currentFoodPrice
                        .substring(0, currentFoodPrice.length - 1)
                        .replace(/\./g, "")
                    ) * (food?.quantity ?? 0)
                  )}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(doDeleteItemCartAction({ _id: food._id }))
                  }
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
      </Col>
      <Col md={8} xs={24}>
        <div className="order-sum">
          <Form onFinish={onFinish} form={form} layout="vertical">
            {paymentMethod === "vnpay" ? (
              <Form.Item
                name="bankCode"
                label="Chọn ngân hàng"
                rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
              >
                <Input
                  placeholder="Tìm ngân hàng..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
                <Radio.Group
                  className="bank-list-wrapper"
                  value={selectedBank}
                  onChange={handleChange}
                >
                  <div className="bank-card-grid">
                    {banks.map((bank) => (
                      <Radio
                        value={bank.bank_code}
                        key={bank.bank_code}
                        className="bank-card"
                      >
                        <img src={bank.logo_link} alt={bank.bank_name} />
                        <div>{`${bank.bank_code} - ${bank.bank_name}`}</div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Tên người nhận"
                  name="name"
                  initialValue={user?.fullname}
                  rules={[
                    {
                      required: true,
                      message: "Tên người nhận không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Số điện thoại"
                  name="phone"
                  initialValue={user?.phone}
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Chỉ được nhập số!",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      e.target.value = onlyNums;
                    }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ margin: 0 }}
                  labelCol={{ span: 24 }}
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: "Địa chỉ không được để trống!" },
                  ]}
                >
                  <TextArea autoFocus rows={4} />
                </Form.Item>
              </>
            )}
            <Form.Item
              name="paymentMethod"
              label="Hình thức thanh toán"
              initialValue="cod"
              style={{ marginBottom: 12 }}
            >
              <Radio.Group>
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                <Radio value="vnpay">Thanh toán qua VNPay</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          <Divider style={{ margin: "5px 0" }} />
          <div className="calculate">
            <span> Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <button onClick={() => form.submit()} disabled={isSubmit}>
            {isSubmit && (
              <span>
                <LoadingOutlined /> &nbsp;
              </span>
            )}
            Đặt Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Payment;
