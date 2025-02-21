import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminRestaurantApproval from "./AdminApproval";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UserManagement from "./ManagementUser";
import Navbar from "../components/Navbar";
import RestaurantManagement from "./RestaurantManagements";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom"; // For navigation
// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { state, logout } = useData();
  const navigate = useNavigate(); // For navigation to the home page
  useEffect(() => {
    if (!state.loading) {
      if (
        !state.user ||
        (state.user.role !== "admin" && state.user.role !== "owner")
      ) {
        navigate("/");
      }
    }
  }, [state.loading, state.user, navigate]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [searchQuery, setSearchQuery] = useState("");

  const dataLine = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [100, 200, 300, 400, 500, 600],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const dataBar = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Website Views",
        data: [50, 60, 70, 80, 90, 100, 110],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar setSearchQuery={setSearchQuery} />

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-sm-12">
          <div className="d-none d-md-block">
            <Sidebar setActiveTab={setActiveTab} />
          </div>
          {/* Offcanvas Sidebar for small screens */}
          <div className="d-md-none">
            <button
              className="btn btn-primary mb-3"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasSidebar"
            >
              Open Sidebar
            </button>
            <div
              className="offcanvas offcanvas-start"
              id="offcanvasSidebar"
              tabIndex="-1"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Menu</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                ></button>
              </div>
              <div className="offcanvas-body">
                <Sidebar setActiveTab={setActiveTab} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9 col-sm-12 p-4">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="mb-4">Dashboard</h2>

              {/* Cards */}
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Restaurants</h6>
                    <h3>$53k</h3>
                    <p className="text-success">+55% than last week</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Users</h6>
                    <h3>2300</h3>
                    <p className="text-success">+3% than last month</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Ads Views</h6>
                    <h3>3,462</h3>
                    <p className="text-danger">-2% than yesterday</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Sales</h6>
                    <h3>$103,430</h3>
                    <p className="text-success">+5% than yesterday</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Website Views</h6>
                    <Bar data={dataBar} />
                    <p className="text-muted">Campaign sent 2 days ago</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Daily Sales</h6>
                    <Line data={dataLine} />
                    <p className="text-muted">Updated 4 min ago</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Completed Tasks</h6>
                    <Line data={dataLine} />
                    <p className="text-muted">Just updated</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Các tab khác */}
          {activeTab === "Quản lí người dùng" && (
            <div>
              <UserManagement searchQuery={searchQuery} />
            </div>
          )}
          {activeTab === "Quản lí nhà hàng" && (
            <div>
              <RestaurantManagement searchQuery={searchQuery} />
            </div>
          )}
          {activeTab === "Xét duyệt nhà hàng" && (
            <div>
              <AdminRestaurantApproval />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
