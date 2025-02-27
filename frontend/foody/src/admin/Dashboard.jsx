import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminRestaurantApproval from "./AdminApproval";
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
  const { state } = useData();
  const navigate = useNavigate(); // For navigation to the home page
  const [countUsers, setCountUsers] = useState(0);
  const [countRestaurants, setCountRestaurants] = useState(0);
  const [countComments, setCountComments] = useState(0);
  const [countAlbums, setCountAlbums] = useState(0);
  useEffect(() => {
    if (state.loading) return; // Chờ loading hoàn tất

    if (
      !state.user ||
      (state.user?.role !== "admin" && state.user?.role !== "owner")
    ) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 1000);

      return () => clearTimeout(timeout); // Xóa timeout nếu component unmount hoặc state thay đổi
    } else {
      const fetchData = async () => {
        try {
          const [usersRes, albumsRes, restaurantsRes, commentsRes] =
            await Promise.all([
              fetch(`${process.env.REACT_APP_BASE_URL}/user/count`),
              fetch(`${process.env.REACT_APP_BASE_URL}/album/count`),
              fetch(`${process.env.REACT_APP_BASE_URL}/restaurant/count`),
              fetch(`${process.env.REACT_APP_BASE_URL}/comment/count`),
            ]);

          const [users, albums, restaurants, comments] = await Promise.all([
            usersRes.json(),
            albumsRes.json(),
            restaurantsRes.json(),
            commentsRes.json(),
          ]);

          if (users && albums && restaurants && comments) {
            setCountUsers(users.results);
            setCountAlbums(albums.results);
            setCountRestaurants(restaurants.results);
            setCountComments(comments.results);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [state.loading, state.user, navigate]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [searchQuery, setSearchQuery] = useState("");

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
          {state.user?.role === "admin" && activeTab === "dashboard" && (
            <div>
              <h2 className="mb-4">Dashboard</h2>

              {/* Cards */}
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Restaurants</h6>
                    <h3>{countRestaurants}</h3>
                    <p className="text-success">+55% than last week</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Users</h6>
                    <h3>{countUsers}</h3>
                    <p className="text-success">+3% than last month</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Comments</h6>
                    <h3>{countComments}</h3>
                    <p className="text-danger">-2% than yesterday</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="card p-3 shadow-sm">
                    <h6>Today's Albums</h6>
                    <h3>{countAlbums}</h3>
                    <p className="text-success">+5% than yesterday</p>
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
          {state.user?.role === "admin" &&
            activeTab === "Xét duyệt nhà hàng" && (
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
