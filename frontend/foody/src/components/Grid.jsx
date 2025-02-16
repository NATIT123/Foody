import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Gird.css";
import ItemList from "./ItemList";
import CategoryFilters from "./CategoryFilters";
import CategoryFiltersEat from "./CategoryFiltersEat";
import ItemsEat from "./ItemsEat";
import Comments from "./Comments.jsx";
import Blogs from "./Blogs.jsx";
import Modal from "./Modal.jsx";
import { useData } from "../context/DataContext.js";
const categoriesEat = ["Mới nhất", "Lượt xem", "Phổ biến", "Đã lưu"];

const categories = ["Mới nhất", "Gần tôi", "Đã lưu"];
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

const Grid = ({ searchQuery }) => {
  const [itemsEat, setItemEat] = useState([]);
  const { state } = useData();
  const [activeCategoryEat, setActiveCategoryEat] = useState(categories[0]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filtersState, setFiltersState] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Khám phá");
  const [selectedItem, setSelectedItem] = useState(null); // Lưu trữ mục được chọn
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]); // Dữ liệu sau khi lọc
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShowModalLogin = () => {
    if (!state.loading && !state.user) {
      setShowLoginModal(true);
      return;
    }
  };

  // Fetch API lấy danh sách restaurant
  useEffect(() => {
    if (activeCategory === categories[0]) {
      setCurrentItems([]);
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getAllRestaurants?page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            selectedCity: state.selectedCity?._id || "",
            selectedCategory: state.selectedCategory?._id || "",
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setTotalPages(data.totalPages);
            setCurrentItems(data.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    } else if (activeCategory === categories[2]) {
      setCurrentItems([]);
      handleShowModalLogin();
      if (showLoginModal) return;
      if (state.user && state.user._id) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}/favorite/getFavoriteRestaurantByUserId/${state.user._id}?page=${currentPage}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data?.data) {
              setTotalPages(data.totalPages); // Lưu tổng số trang
              setCurrentItems(data.data.data); // Lưu danh sách restaurant vào state
            }
          })
          .catch((error) => {
            console.error("Error fetching restaurants:", error);
          });
      }
    } else if (categories[1] === activeCategory) {
      setCurrentItems([]);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetch(
            `${process.env.REACT_APP_BASE_URL}/restaurant/getNearestRestaurants?page=${currentPage}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                latitude,
                longitude,
                maxDistance: 1000,
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              if (data?.data) {
                setTotalPages(data.totalPages); // Lưu tổng số trang
                setCurrentItems(data.data.data); // Lưu danh sách restaurant vào state
              }
            })
            .catch((error) => {
              console.error("Error fetching restaurants:", error);
            });
        },
        (error) => {
          console.error("Lỗi lấy vị trí: ", error);
        }
      );
    }
  }, [currentPage, activeCategory, state, filtersState]);

  // Fetch API lấy danh sách restaurant
  useEffect(() => {
    setItemEat([]);
    if (activeCategoryEat === categoriesEat[0]) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getAllRestaurants?page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            selectedCity: state.selectedCity?._id || "",
            selectedCategory: state.selectedCategory?._id || "",
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setTotalPages(data.totalPages);
            setItemEat(data.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    } else if (activeCategoryEat === categoriesEat[2]) {
      setItemEat([]);
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurantTopDeals?page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            selectedCity: state.selectedCity?._id || "",
            selectedCategory: state.selectedCategory?._id || "",
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.data) {
            setTotalPages(data.totalPages); // Lưu tổng số trang
            setItemEat(data.data.data); // Lưu danh sách restaurant vào state
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    } else if (categoriesEat[1] === activeCategoryEat) {
      setItemEat([]);

      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurantByViews?page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            selectedCity: state.selectedCity?._id || "",
            selectedCategory: state.selectedCategory?._id || "",
            subCategory: filtersState[0],
            cuisines: filtersState[1],
            district: filtersState[2],
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.data) {
            setTotalPages(data.totalPages); // Lưu tổng số trang
            setItemEat(data.data.data); // Lưu danh sách restaurant vào state
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    } else if (categoriesEat[3] === activeCategoryEat) {
      setItemEat([]);
      handleShowModalLogin();
      if (showLoginModal) return;
      if (state.user && state.user._id) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}/favorite/getFavoriteRestaurantByUserId/${state.user._id}?page=${currentPage}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data?.data) {
              setTotalPages(data.totalPages); // Lưu tổng số trang
              setItemEat(data.data.data); // Lưu danh sách restaurant vào state
            }
          })
          .catch((error) => {
            console.error("Error fetching restaurants:", error);
          });
      }
    }
  }, [currentPage, activeCategoryEat, state, filtersState]);

  // Lọc dữ liệu khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery) {
      const results = currentItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCurrentItems(results);
      setCurrentPage(1); // Reset về trang đầu
    } else {
      setCurrentItems(currentItems); // Hiển thị tất cả nếu không có từ khóa
    }
  }, [currentItems, searchQuery]);

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const changePage = (page) => {
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
          minWidth: "300px", // Đặt chiều rộng tối thiểu để tránh bị thu nhỏ quá mức
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
              totalPages={totalPages}
              items={itemsEat} // Truyền danh sách dữ liệu gốc
              itemsPerPage={itemsPerPage} // Truyền số mục mỗi trang
              handleShowModal={handleShowModal}
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
