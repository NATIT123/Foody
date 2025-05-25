import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Gird.css";
import { useNavigate } from "react-router-dom";
import CategoryFilters from "../Category/CategoryFilters";
import CategoryFiltersEat from "../Category/CategoryFiltersEat";
import ItemList from "../Item/ItemList";
import ItemsEat from "../Item/ItemsEat";
import Comments from "../Comment/Comments";
import Blogs from "../Blog/Blogs";
import LoginModal from "../Login/LoginModal";
import Modal from "../Comment/Modal";
import { useAppSelector } from "../../redux/hooks";
import {
  callFetchFavoriteRestaurantByUserId,
  callfetchFavoriteRestaurantsEat,
  callFetchListRestaurant,
  callfetchMostViewed,
  callFetchNearestRestaurant,
  callFetchRestaurantsByRate,
  callFetchTopDeals,
} from "../../services/api";
import { toast } from "react-toastify";
const categoriesEat = ["Mới nhất", "Lượt xem", "Phổ biến", "Đã lưu"];

const categories = ["Mới nhất", "Gần tôi", "Đã lưu", "Đánh giá"];
const filters = ["- Danh mục -", "- Ẩm thực -", "- Quận/Huyện -"];
const itemsPerPage = 100;

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = ["Khám phá", "Ăn gì", "Blogs", "Bình luận"];

  return (
    <div
      className="p-4 border-end bg-white d-none d-lg-block"
      style={{
        width: "250px",
        minHeight: "100%",
        overflowY: "auto",
        position: "sticky",
        top: "56px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="d-flex align-items-center mb-4"
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#FFA500",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
          }}
        >
          <img
            src="https://www.foody.vn/asset/styles/images/icons/icon-foody-60x60.png"
            alt="Logo"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
            }}
          />
        </div>
        <h5 className="ms-3 text-primary mb-0">Khám phá</h5>
      </div>

      <ul className="list-unstyled">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`d-flex align-items-center my-3 p-2 ${
              activeTab === item ? "active-item" : ""
            }`}
            style={{
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              backgroundColor: activeTab === item ? "#e0f7fa" : "transparent",
            }}
            onClick={() => setActiveTab(item)}
          >
            <span
              className="text-decoration-none text-dark w-100"
              style={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Grid = () => {
  const navigate = useNavigate(); // Hook điều hướng
  const [itemsEat, setItemEat] = useState([]);
  const [activeCategoryEat, setActiveCategoryEat] = useState(categories[0]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filtersState, setFiltersState] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Khám phá");
  const [selectedItem, setSelectedItem] = useState(null); // Lưu trữ mục được chọn
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesEat, setTotalPagesEat] = useState(0);
  const [currentPageEat, setCurrentPageEat] = useState(1);
  const [currentItems, setCurrentItems] = useState([]); // Dữ liệu sau khi lọc
  const [showLoginModal, setShowLoginModal] = useState(false);
  const user = useAppSelector((state) => state.account.user);
  const isLoading = useAppSelector((state) => state.account.loading);
  const selectedCity = useAppSelector((state) => state.resource.selectedCity);
  const selectedCategory = useAppSelector(
    (state) => state.resource.selectedCategory
  );
  const handleShowModalLogin = () => {
    if (!isLoading && !user) {
      setShowLoginModal(true);
      return;
    }
  };
  const [isPending, setIsPending] = useState(false);
  const [isPendingEat, setIsPendingEat] = useState(false);
  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const fetchRestaurants = useCallback(async () => {
    setCurrentItems([]);
    try {
      setIsPending(true);
      const res = await callFetchListRestaurant(currentPage, {
        selectedCity: selectedCity?._id || "",
        selectedCategory: selectedCategory?._id || "",
        subCategory: filtersState[0],
        cuisines: filtersState[1],
        district: filtersState[2],
      });
      if (res.status === "success") {
        setIsPending(false);
        setTotalPages(res.data.totalPages);
        setCurrentItems(res.data.data);
      }
    } catch (err) {
      toast.error("Error fetching restaurants:");
    }
  }, [currentPage, selectedCity, selectedCategory, filtersState]);

  const fetchFavoriteRestaurants = useCallback(async () => {
    setCurrentItems([]);
    setIsPending(true);
    if (user) {
      try {
        const res = await callFetchFavoriteRestaurantByUserId(
          user._id,
          currentPage,
          {
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }
        );
        if (res.status === "success") {
          setIsPending(false);
          setTotalPages(res.data.totalPages);
          setCurrentItems(res.data.data);
        }
      } catch (err) {
        toast.error("Error fetching restaurants:");
      }
    }
  }, [currentPage, filtersState, user]);

  const fetchNearestRestaurants = useCallback(() => {
    setCurrentItems([]);
    setIsPending(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await callFetchNearestRestaurant(currentPage, {
          subCategory: filtersState[0],
          cuisines: filtersState[1],
          district: filtersState[2],
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          maxDistance: 1000,
        });
        if (res.status === "success") {
          setIsPending(false);
          setTotalPages(res.data.totalPages);
          setCurrentItems(res.data.data);
        }
      } catch (err) {
        toast.error("Error fetching restaurants:");
      }
    });
  }, [currentPage, filtersState]);

  const fetchRateRestaurants = useCallback(async () => {
    setCurrentItems([]);
    setIsPending(true);
    try {
      const res = await callFetchRestaurantsByRate(currentPage, {
        selectedCity: selectedCity?._id || "",
        selectedCategory: selectedCategory?._id || "",
        subCategory: filtersState[0],
        cuisines: filtersState[1],
        district: filtersState[2],
      });
      if (res.status === "success") {
        setIsPending(false);
        setTotalPages(res.data.totalPages);
        setCurrentItems(res.data.data);
      }
    } catch (err) {
      toast.error("Error fetching restaurants:");
    }
  }, [currentPage, selectedCategory, selectedCity, filtersState]);

  useEffect(() => {
    if (activeCategory === categories[0]) {
      fetchRestaurants();
    } else if (activeCategory === categories[2]) {
      handleShowModalLogin();
      fetchFavoriteRestaurants();
    } else if (activeCategory === categories[1]) {
      fetchNearestRestaurants();
    } else if (activeCategory === categories[3]) {
      fetchRateRestaurants();
    }
  }, [
    filtersState,
    activeCategory,
    currentPage,
    selectedCity,
    selectedCategory,
  ]);

  // Fetch API lấy danh sách restaurant

  const fetchAllRestaurants = useCallback(async () => {
    setItemEat([]);
    setIsPendingEat(true);
    try {
      const res = await callFetchListRestaurant(currentPageEat, {
        selectedCity: selectedCity?._id || "",
        selectedCategory: selectedCategory?._id || "",
        subCategory: filtersState[0],
        cuisines: filtersState[1],
        district: filtersState[2],
      });
      if (res.status === "success") {
        setIsPendingEat(false);
        setTotalPagesEat(res.data.totalPages);
        setItemEat(res.data.data);
      }
    } catch (err) {
      toast.error("Error fetching restaurants:");
    }
  }, [currentPageEat, selectedCategory, selectedCity, filtersState]);

  const fetchTopDeals = useCallback(async () => {
    setItemEat([]);
    setIsPendingEat(true);
    try {
      const res = await callFetchTopDeals(currentPageEat, {
        selectedCity: selectedCity?._id || "",
        selectedCategory: selectedCategory?._id || "",
        subCategory: filtersState[0],
        cuisines: filtersState[1],
        district: filtersState[2],
      });
      if (res.status === "success") {
        setIsPendingEat(false);
        setTotalPagesEat(res.data.totalPages);
        setItemEat(res.data.data);
      }
    } catch (err) {
      toast.error("Error fetching restaurants:");
    }
  }, [currentPageEat, selectedCategory, selectedCity, filtersState]);

  const fetchMostViewed = useCallback(async () => {
    setItemEat([]);
    setIsPendingEat(true);
    try {
      const res = await callfetchMostViewed(currentPageEat, {
        selectedCity: selectedCity?._id || "",
        selectedCategory: selectedCategory?._id || "",
        subCategory: filtersState[0],
        cuisines: filtersState[1],
        district: filtersState[2],
      });
      if (res.status === "success") {
        setIsPendingEat(false);
        setTotalPagesEat(res.data.totalPages);
        setItemEat(res.data.data);
      }
    } catch (err) {
      toast.error("Error fetching restaurants:");
    }
  }, [currentPageEat, selectedCity, selectedCategory, filtersState]);

  const fetchFavoriteRestaurantsEat = useCallback(async () => {
    setItemEat([]);
    setIsPendingEat(true);
    if (user) {
      try {
        const res = await callfetchFavoriteRestaurantsEat(
          user._id,
          currentPageEat,
          {
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }
        );
        if (res.status === "success") {
          setIsPendingEat(false);
          setTotalPagesEat(res.data.totalPages);
          setItemEat(res.data.data);
        }
      } catch (err) {
        toast.error("Error fetching restaurants:");
      }
    }
  }, [currentPageEat, user, filtersState]);

  useEffect(() => {
    if (activeCategoryEat === categoriesEat[0]) {
      fetchAllRestaurants();
    } else if (activeCategoryEat === categoriesEat[2]) {
      fetchTopDeals();
    } else if (activeCategoryEat === categoriesEat[1]) {
      fetchMostViewed();
    } else if (activeCategoryEat === categoriesEat[3]) {
      handleShowModalLogin();
      fetchFavoriteRestaurantsEat();
    }
  }, [
    activeCategoryEat,
    currentPageEat,
    filtersState,
    selectedCity,
    selectedCategory,
  ]);

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const changePage = (page) => {
    setCurrentPageEat(page);
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => changePage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => changePage(currentPage - 1)}
            >
              &laquo; Trước
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => changePage(currentPage + 1)}
            >
              Sau &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container py-4 mt-2 d-flex flex-column flex-lg-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className="ms-lg-2 p-3 flex-grow-1"
        style={{
          minWidth: "200px", // Đặt chiều rộng tối thiểu để tránh bị thu nhỏ quá mức
          flexBasis: "0", // Đảm bảo thành phần này chia không gian linh hoạt
          overflow: "hidden", // Ngăn cuộn ngang không mong muốn
        }}
      >
        {activeTab === "Khám phá" && (
          <>
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filters={filters}
              filtersState={filtersState}
              setFiltersState={setFiltersState}
            />

            <ItemList
              setShowLoginModal1={setShowLoginModal}
              showLoginModal1={showLoginModal}
              activeCategory={activeCategory}
              categories={categories}
              currentItems={currentItems}
              handleShowModal={handleShowModal}
              isPending={isPending}
            />

            {/* Pagination */}
            {currentItems && currentItems.length > 0 && renderPagination()}
          </>
        )}

        {activeTab === "Ăn gì" && (
          <>
            <CategoryFiltersEat
              categories={categoriesEat}
              activeCategory={activeCategoryEat}
              setActiveCategory={setActiveCategoryEat}
            />

            <ItemsEat
              activeCategoryEat={activeCategoryEat}
              categoriesEat={categoriesEat}
              showLoginModal={showLoginModal}
              setShowLoginModal={setShowLoginModal}
              categories={categories}
              totalPages={totalPagesEat}
              items={itemsEat} // Truyền danh sách dữ liệu gốc
              itemsPerPage={itemsPerPage} // Truyền số mục mỗi trang
              handleShowModal={handleShowModal}
              isPendingEat={isPendingEat}
            />
          </>
        )}

        {activeTab === "Bình luận" && (
          <>
            <Comments />
          </>
        )}
        {activeTab === "Blogs" && (
          <>
            <Blogs />
          </>
        )}

        {showLoginModal && (
          <LoginModal
            show={showLoginModal}
            onClose={() => {
              setShowLoginModal(false);
            }}
            onLogin={handleLogin}
          />
        )}

        {/* Modal */}
        {selectedItem && (
          <Modal
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            show={showModal}
            onClose={handleCloseModal}
            item={selectedItem}
          />
        )}
      </div>
    </div>
  );
};

export default Grid;
