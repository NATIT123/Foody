import { Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteItemCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";

const ViewOrder = (props) => {
  const carts = useSelector((state) => state.order.carts);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

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

  const handleOnChangeInput = (value, food) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: food, _id: food._id })
      );
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={18} xs={24}>
        {carts?.map((food) => {
          const currentFoodPrice =
            food?.detail.priceDiscount === "empty"
              ? food.detail.priceOriginal
              : food.detail.priceDiscount ?? 0;
          return (
            <div className="order-book" key={food?._id}>
              <div className="book-content">
                <img src={food.detail.image} alt={food?.detail.name || ""} />
                <div className="title">{food?.detail?.name}</div>
                <div className="price">{currentFoodPrice}</div>
              </div>
              <div className="action">
                <div className="quantity">
                  <InputNumber
                    onChange={(value) => handleOnChangeInput(value, food)}
                    value={food.quantity}
                  />
                </div>
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
        {carts.length === 0 && (
          <div className="order-book-empty">
            <Empty description={"Không có sản phẩm trong giỏ hàng"} />
          </div>
        )}
      </Col>
      <Col md={6} xs={24}>
        <div className="order-sum">
          <div className="calculate">
            <span> Tạm tính</span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <div className="calculate">
            <span> Tổng tiền</span>
            <span className="sum-final">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice || 0)}
            </span>
          </div>
          <Divider style={{ margin: "10px 0" }} />
          <button
            disabled={carts.length === 0}
            onClick={() => props.setCurrentStep(1)}
          >
            Mua Hàng ({carts?.length ?? 0})
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default ViewOrder;
