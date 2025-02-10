import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Đảm bảo bạn đã liên kết file CSS
import Header from "../components/Header";
import Grid from "../components/Grid";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
const DeliveryCategories = [
  "Deal hôm nay",
  "Tất cả",
  "Đồ ăn",
  "Đồ uống",
  "Đồ chay",
  "Bánh kem",
  "Tráng miệng",
  "Xem thêm",
];

const moreCategories = [
  "Pizza/Burger",
  "Món lẩu",
  "Sushi",
  "Mì phở",
  "Cơm hộp",
];
const items = [
  {
    title: "Bánh Mì Tuhu Bread",
    subtitle: "99 Phố Nguyễn Sơn, P. Ngọc Lâm",
    category: "Bakery",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7r98o-lsu8cj5c745g20@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Hủ Tiếu Thái Lan",
    subtitle: "136 Vũ Phạm Hàm, P. Yên Hòa",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7ras8-m4iqnrmr23gn57@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Hủ Tiếu Thái Lan",
    subtitle: "136 Vũ Phạm Hàm, P. Yên Hòa",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7ras8-m4iqnrmr23gn57@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Dakgalbi - Tiệm Gà Rán",
    subtitle: "59 Nguyễn Phong Sắc, P. Dịch Vọng",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7r98o-lsvcfu4hmnbtf3@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Quán Ăn Hợp Tác Xã",
    subtitle: "15 Ngõ 252 Tây Sơn, Trung Liệt",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7r98o-lsv4g2zazcm1cf@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Mì Cay Oi Shii",
    subtitle: "93 Ngõ 164 Phố Vương Thừa Vũ",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134259-7r98o-lwdhfaegx5gbdc@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Gà Rán & Gà Ủ Muối",
    subtitle: "29 Nguyễn Sơn, P. Long Biên",
    category: "Bistro",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7r98o-lsua0lz49hg9e2@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Mokchang - Đồ Ăn Hàn",
    subtitle: "Số 5 Đội Cấn, P. Ba Đình",
    category: "Korean",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134513-7ras8-m3fum7rji2eg63@resize_ss750x400!@crop_w750_h400_cT",
  },
  {
    title: "Le Castella Hà Nội",
    subtitle: "47 Nguyễn Thị Định, Cầu Giấy",
    category: "Bakery",
    imgSrc:
      "https://mms.img.susercontent.com/vn-11134259-7r98o-lw94dui96l7f8a@resize_ss750x400!@crop_w750_h400_cT",
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("Deal hôm nay"); // State for active tab
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerRow = 4; // Số lượng mục mỗi dòng
  const itemsPerPage = itemsPerRow * 2; // Hiển thị 2 dòng (8 mục)
  const [searchQuery, setSearchQuery] = useState(""); // State lưu từ khóa tìm kiếm
  const [selectedProvince, setSelectedProvince] = useState([]); // Tỉnh được chọn với id và name
  const [selectedCategory, setSelectedCategory] = useState({}); // Category được chọn với id và name

  const [selectedDistricts, setSelectedDistricts] = useState([]); // Quận/huyện được chọn

  const handleSearch = (query) => {
    setSearchQuery(query); // Cập nhật state từ khóa tìm kiếm
  };

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < items.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div>
      <Header
        selectedDistricts={selectedDistricts}
        onSearch={handleSearch}
        selectedProvince={selectedProvince}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedProvince={setSelectedProvince}
        setSelectedDistricts={setSelectedDistricts}
      />

      <div
        className="container py-4 mt-2"
        style={{
          border: "1px solid #ddd", // Viền màu xám nhạt

          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
        }}
      >
        {/* Header + Categories */}
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          {/* Logo + Title */}
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <img
              src="https://www.foody.vn/asset/styles/images/icons/icon-delivery-60x60-3.png"
              alt="Logo"
              className="me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <h4 className="mb-0">Giao Tận Nơi</h4>
          </div>
          {/* Categories */}
          <nav className="nav flex-wrap">
            {DeliveryCategories.map((category, index) => {
              if (category === "Xem thêm") {
                return (
                  <div key={index} className="dropdown">
                    <button
                      className="btn btn-link nav-link text-dark dropdown-toggle"
                      type="button"
                      onClick={toggleDropdown}
                    >
                      {category}
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu show">
                        {moreCategories.map((moreCategory, i) => (
                          <a
                            key={i}
                            href="/"
                            className="dropdown-item"
                            onClick={() => setActiveTab(moreCategory)} // Cập nhật activeTab khi chọn
                          >
                            {moreCategory}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <a
                  key={index}
                  href="/"
                  className={`nav-link ${
                    activeTab === category
                      ? "text-danger fw-bold active"
                      : "text-dark"
                  }`}
                  style={{ marginRight: "8px" }}
                  onClick={() => setActiveTab(category)} // Cập nhật trạng thái activeTab
                >
                  {category}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Grid */}
        <div className="position-relative">
          {/* Icon Left */}
          <button
            className="btn btn-light position-absolute start-0 top-50 translate-middle-y"
            style={{ zIndex: 10 }}
            onClick={prevSlide}
          >
            &#8249; {/* Left arrow icon */}
          </button>

          {/* Items */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {visibleItems
              .filter(
                (item) =>
                  activeTab === "Deal hôm nay" || item.category === activeTab
              ) // Lọc dựa trên activeTab
              .map((item, index) => (
                <div
                  key={index}
                  className="card"
                  style={{
                    width: "250px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={item.imgSrc}
                    className="card-img-top"
                    alt={item.title}
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.title}
                    </h5>
                    <h6
                      className="card-subtitle mb-2 text-muted"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.subtitle}
                    </h6>
                    <p className="card-category text-danger">{item.category}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Icon Right */}
          <button
            className="btn btn-light position-absolute end-0 top-50 translate-middle-y"
            style={{ zIndex: 10 }}
            onClick={nextSlide}
          >
            &#8250; {/* Right arrow icon */}
          </button>
        </div>
      </div>

      <Grid searchQuery={searchQuery} />
      <ChatBox />
      <Footer />
    </div>
  );
};

export default Index;
