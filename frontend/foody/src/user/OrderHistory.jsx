import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OrderHistory = () => {
  const [status, setStatus] = useState("All"); // Dropdown value for order status
  const [startDate, setStartDate] = useState(""); // Start date
  const [endDate, setEndDate] = useState(""); // End date
  const [orders, setOrders] = useState([]); // Order data (mock data or fetched from API)

  useEffect(() => {
    setOrders([
      {
        id: 1,
        orderCode: "SF12345",
        date: "06-01-2025",
        location: "Hà Nội",
        staff: "Nguyễn Văn A",
        total: "200,000đ",
        status: "Hoàn thành",
      },
      {
        id: 2,
        orderCode: "SF12346",
        date: "07-01-2025",
        location: "TP. HCM",
        staff: "Trần Thị B",
        total: "350,000đ",
        status: "Đang xử lý",
      },
    ]);
  }, []); // Empty dependency array ensures this runs only once

  

  const handleSearch = () => {
    // Add logic here to fetch data based on filters
    console.log("Search orders with:", { status, startDate, endDate });
    // Mock data
    setOrders([
      {
        id: 1,
        orderCode: "SF12345",
        date: "06-01-2025",
        location: "Hà Nội",
        staff: "Nguyễn Văn A",
        total: "200,000đ",
        status: "Hoàn thành",
      },
      {
        id: 2,
        orderCode: "SF12346",
        date: "07-01-2025",
        location: "TP. HCM",
        staff: "Trần Thị B",
        total: "350,000đ",
        status: "Đang xử lý",
      },
    ]);
  };

  return (
    <div>
        <Header/>
    <div className="container mt-5">
      {/* Header */}
      <h2 className="text-center mb-4">Lịch sử đơn hàng</h2>

      {/* Filter Section */}
      <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
        <div className="me-3">
          <label htmlFor="status" className="form-label">
            Trạng thái
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Hủy">Hủy</option>
          </select>
        </div>
        <div className="me-3">
          <label htmlFor="startDate" className="form-label">
            Từ ngày
          </label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="me-3">
          <label htmlFor="endDate" className="form-label">
            Đến ngày
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <button className="btn btn-primary mt-4" onClick={handleSearch}>
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Order History Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Thời gian</th>
            <th>Địa điểm</th>
            <th>Nhân viên</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.orderCode}</td>
                <td>{order.date}</td>
                <td>{order.location}</td>
                <td>{order.staff}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>
                  <button className="btn btn-link text-decoration-none">
                    Xem
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <Footer/>
    </div>
  );
};

export default OrderHistory;
