import { useState, useEffect } from "react";
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
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom"; // For navigation
import ManageUserPage from "./user";
import ManageRestaurantPage from "./restaurant";
import AdminRestaurantApproval from "../../components/Admin/Restaurant/AdminApproval";
import { useAppSelector } from "../../redux/hooks";
import Sidebar from "../../components/Admin/Sidebar";
import {
  callFetchAlbumCount,
  callFetchCommentCount,
  callFetchRestaurantCount,
  callFetchUserCount,
} from "../../services/api";
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

const AdminPage = () => {
  const navigate = useNavigate(); // For navigation to the home page
  const [countUsers, setCountUsers] = useState(0);
  const [countRestaurants, setCountRestaurants] = useState(0);
  const [countComments, setCountComments] = useState(0);
  const [countAlbums, setCountAlbums] = useState(0);
  const user = useAppSelector((state) => state.account.user);
  useEffect(() => {
    document.title = `Dashboard`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, albums, restaurants, comments] = await Promise.all([
          callFetchUserCount(),
          callFetchAlbumCount(),
          callFetchRestaurantCount(),
          callFetchCommentCount(),
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
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (user?.role === "owner") {
      setActiveTab("Quản lí nhà hàng");
    }
  }, [user]);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
          {user?.role === "admin" && activeTab === "dashboard" && (
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
              <ManageUserPage searchQuery={searchQuery} />
            </div>
          )}
          {activeTab === "Quản lí nhà hàng" && (
            <div>
              <ManageRestaurantPage searchQuery={searchQuery} />
            </div>
          )}
          {user?.role === "admin" && activeTab === "Xét duyệt nhà hàng" && (
            <div>
              <AdminRestaurantApproval searchQuery={searchQuery} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
