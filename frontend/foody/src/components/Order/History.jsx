import { Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import ReactJson from "react-json-view";
import { toast } from "react-toastify";

const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await callOrderHistory();
        if (res && res.status === "success") {
          console.log(res);
          setOrderHistory(res.data);
        }
      } catch (error) {
        toast.error(`🚨 ${error.message} .`);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "Thời gian ",
      dataIndex: "createdAt",
      render: (item, record, index) => {
        return moment(item).format(FORMAT_DATE_DISPLAY);
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      render: (item, record, index) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item);
      },
    },
    {
      title: "Trạng thái",
      render: (_, { tags }) => <Tag color={"green"}>Thành công</Tag>,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <ReactJson
          src={record.orderItems}
          name={"Chi tiết đơn mua"}
          collapsed={true}
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</div>
      <Table columns={columns} dataSource={orderHistory} pagination={false} />
    </div>
  );
};

export default History;
