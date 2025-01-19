import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Gird.css"
import { Link, useNavigate } from 'react-router-dom';
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
    imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgecy7t793taa@resize_ss400x400",
    review: "Phở bò thơm ngon, nước dùng đậm đà.",
    rating: 4.5,
    commentCount: 12,
    likes: 150,
    userAvatar: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60", // Avatar người dùng
    userName: "Nguyễn Văn A", // Tên người dùng
  },
  {
    id: 2,
    title: "Cơm gà",
    subtitle: "Số 5, Nguyễn Huệ, TP. Hồ Chí Minh",
    imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh0ggp4ai8p1d@resize_ss400x400",
    review: "Bánh mì giòn rụm, nhân đa dạng.",
    rating: 4.7,
    commentCount: 8,
    likes: 200,
    userAvatar: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60",
    userName: "Trần Văn B",
  },
];


const items = [
    {
      id: 1,
      title: "Chè Sầu - Văn Cao",
      subtitle: "44 Văn Cao, Quận Ba Đình, Hà Nội",
      comments: 3,
      likes: 42,
      minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbt9sfun7x7c2@resize_ss640x400",
      reviews: [
        {
          user: "Lê Văn A",
          time: "2025-01-12 14:30",
          title: "Tuyệt vời",
          comment: "Chè sầu thơm ngon, rất đáng thử. Quán sạch sẽ và nhân viên thân thiện.",
        },
        {
          user: "Nguyễn Văn B",
          time: "2025-01-13 10:00",
          title: "Khá tốt",
          comment: "Chè ngon nhưng giá hơi cao một chút.",
        },
      ],
    },
    {
      id: 2,
      title: "Chị Linh - Bánh Giò Nóng",
      subtitle: "Đối Diện 175 Yên Hòa, Quận Cầu Giấy",
      comments: 10,
      likes: 150,
      minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvhtyi9m8p0f@resize_ss640x400",
      reviews: [
        {
          user: "Trần Văn C",
          time: "2025-01-11 09:15",
          title: "Ngon",
          comment: "Bánh giò rất nóng và đầy đặn. Hương vị tuyệt vời!",
        },
      ],
    },
    {
      id: 3,
      title: "Bít Tết Ngọc Hiếu - Trần Duy Hưng",
      subtitle: "71 Trần Duy Hưng, P. Trung Hòa, Quận Cầu Giấy",
      comments: 25,
      likes: 220,
      minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdb0z5tu195e2@resize_ss640x400",
      reviews: [
        {
          user: "Hoàng D",
          time: "2025-01-13 19:00",
          title: "Chất lượng ổn",
          comment: "Thịt bít tết mềm, sốt ngon nhưng phục vụ hơi chậm.",
        },
      ],
    },
    {
      id: 4,
      title: "Lòng 'Chát' - Trần Thái Tông",
      subtitle: "18 Trần Thái Tông, P. Dịch Vọng Hậu, Quận Cầu Giấy",
      comments: 15,
      likes: 180,
      minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb49ljwcul72a@resize_ss640x400",
      reviews: [],
    },
    {
      id: 5,
      title: "Bếp Nhà Bụi - Cơm Gà Xối Mỡ",
      subtitle: "119 Ngõ 79 Cầu Giấy, P. Yên Hòa, Quận Cầu Giấy",
      comments: 30,
      likes: 300,
      minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134513-7r98o-m0bif0zc61736c@resize_ss640x400",
      reviews: [
        {
          user: "Phạm E",
          time: "2025-01-10 12:45",
          title: "Rất ngon",
          comment: "Cơm gà giòn rụm, ăn kèm nước chấm rất ngon. Quán sạch sẽ và phục vụ nhanh.",
        },
      ],
    },
    {
      id: 6,
      title: "Tuyết Nhung - Cơm Gà Phú Yên",
      subtitle: "243 Tô Hiệu, P. Nghĩa Tân, Quận Cầu Giấy",
      comments: 18,
      likes: 270,
       minPrice: 70000,
        maxPrice: 150000,
        openTime: "10:00",
        closeTime: "22:00",
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu35ythu01wb3@resize_ss640x400",
      reviews: [],
    },
    {
      id: 7,
      title: "Cơm Sườn Đào Duy Từ",
      subtitle: "267 Tô Hiệu, P. Nghĩa Tân, Quận Cầu Giấy",
      comments: 20,
      likes: 320,
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8yo6rnp3vde2@resize_ss640x400",
      reviews: [
        {
          user: "Lê Thị F",
          time: "2025-01-11 16:30",
          title: "Xuất sắc",
          comment: "Cơm sườn rất ngon, phần ăn đầy đủ, giá cả hợp lý. Phục vụ tốt.",
        },
      ],
    },
    {
      id: 8,
      title: "Highlands Coffee - Trà, Cà Phê",
      subtitle: "222 Trần Duy Hưng, P. Trung Hòa, Quận Cầu Giấy",
      comments: 45,
      likes: 500,
      imgSrc: "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m4cxbs4n6cb3a5@resize_ss640x400",
      reviews: [
        {
          user: "Nguyễn Văn G",
          time: "2025-01-12 08:00",
          title: "Thức uống ngon",
          comment: "Trà rất thơm, cà phê đậm vị. Không gian thoải mái, phù hợp làm việc.",
        },
        {
          user: "Trần Văn H",
          time: "2025-01-13 14:20",
          title: "Không gian đẹp",
          comment: "Không gian quán thoáng mát, phù hợp để thư giãn. Phục vụ nhanh nhẹn.",
        },
      ],
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
        <div className="d-flex align-items-center mb-4" style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
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
  
    
    const [filteredItems, setFilteredItems] = useState(items); // Dữ liệu sau khi lọc


  // Tính toán số trang và items hiện tại
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Lọc dữ liệu khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery) {
      const results = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(results);
      setCurrentPage(1); // Reset về trang đầu
    } else {
      setFilteredItems(items); // Hiển thị tất cả nếu không có từ khóa
    }
  }, [searchQuery]);

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
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
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
    <ItemList currentItems={currentItems} handleShowModal={handleShowModal} />

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
<Comments/>
          </>
        )}
  {activeTab === "Blogs" && (
          <>
<Blogs/>
          </>
        )}
     
  
      {/* Modal */}
      {selectedItem && (
        <Modal show={showModal} onClose={handleCloseModal} item={selectedItem} />
      )}
    </div>
  </div>
  );
};
  
  export default Grid;