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
const categoriesEat = ["Mới nhất", "Lượt xem", "Phổ biến", "Đã lưu"];

const categories = ["Mới nhất", "Gần tôi", "Đã lưu"];
const filters = ["- Danh mục -", "- Ẩm thực -", "- Quận/Huyện -"];
const itemsPerPage = 12;
const itemsEat = [
  {
    id: 1,
    title: "Phở Bò Hà Nội",
    subtitle: "Số 10, Đường Láng, Hà Nội",
    imgSrc:
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgecy7t793taa@resize_ss400x400",
    review: "Phở bò thơm ngon, nước dùng đậm đà.",
    rating: 4.5,
    commentCount: 12,
    likes: 150,
    userAvatar:
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60", // Avatar người dùng
    userName: "Nguyễn Văn A", // Tên người dùng
  },
  {
    id: 2,
    title: "Cơm gà",
    subtitle: "Số 5, Nguyễn Huệ, TP. Hồ Chí Minh",
    imgSrc:
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh0ggp4ai8p1d@resize_ss400x400",
    review: "Bánh mì giòn rụm, nhân đa dạng.",
    rating: 4.7,
    commentCount: 8,
    likes: 200,
    userAvatar:
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60",
    userName: "Trần Văn B",
  },
];

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
  const [activeCategoryEat, setActiveCategoryEat] = useState(categories[0]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filtersState, setFiltersState] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Khám phá");
  const [selectedItem, setSelectedItem] = useState(null); // Lưu trữ mục được chọn
  const [showModal, setShowModal] = useState(false);

  const [currentItems, setCurrentItems] = useState([]); // Dữ liệu sau khi lọc

  // Fetch API lấy danh sách restaurant
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/restaurant/getAllRestaurants?page=${currentPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCurrentItems(data.data.data); // Lưu danh sách tỉnh vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [currentPage]);

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
    for (let i = 1; i <= currentItems.totalPages; i++) {
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
              currentPage === currentItems.totalPages ? "disabled" : ""
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
              currentItems={currentItems}
              handleShowModal={handleShowModal}
            />

            {/* Pagination */}
            {renderPagination()}
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
