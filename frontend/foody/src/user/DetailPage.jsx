import React from "react";
import Header from "../components/Header";
import Slide from "../components/Slide";
import Footer from "../components/Footer";
import ProductSuggestion from "../components/ProductSuggestion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaLocationArrow, FaClock } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoIosPricetag } from "react-icons/io";
import { IoMapSharp } from "react-icons/io5";

const DetailPage = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState(""); // State lưu từ khóa tìm kiếm
  const [provinces, setProvinces] = useState([]); // Lưu danh sách tỉnh
  const [categories, setCategories] = useState([]); // Lưu danh sách tỉnh
  const [selectedProvince, setSelectedProvince] = useState([]); // Tỉnh được chọn với id và name
  const [selectedCategory, setSelectedCategory] = useState({}); // Category được chọn với id và name
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [selectedDistricts, setSelectedDistricts] = useState([]); // Quận/huyện được chọn
  const [subcategories, setSubCategories] = useState([]); // Danh sách quận/huyện
  const [currentRestaurant, setCurrentRestaurant] = useState([]); // Dữ liệu sau khi lọc
  const [currentFoods, setCurrentFoods] = useState([]); // Dữ liệu sau khi lọc
  const [currentComments, setCurrentComments] = useState([]); // Dữ liệu sau khi lọc
  const [currentAlbums, setCurrentAlbums] = useState([]); // Dữ liệu sau khi lọc
  const [suggestRestaurants, setSuggestRestaurants] = useState([]); // Dữ liệu sau khi lọc
  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCurrentRestaurant(data.data.data); // Lưu danh sách restaurant vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/food/getFoodsByRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCurrentFoods(data.data.data); // Lưu danh sách restaurant vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/comment/getCommentsByRestaurant/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCurrentComments(data.data.data); // Lưu danh sách restaurant vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/album/getAlbumsByRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCurrentAlbums(data.data.data); // Lưu danh sách restaurant vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
<<<<<<< HEAD
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurantByRecommendation/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setSuggestRestaurants(data.data.data); // Lưu danh sách restaurant vào state
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, [id]);
=======
  // useEffect(() => {
  //   fetch(
  //     `${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurantByRecommendation/${id}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.data.data) {
  //         setSuggestRestaurants(data.data.data); // Lưu danh sách restaurant vào state
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching restaurants:", error);
  //     });
  // }, [id]);
>>>>>>> c9aa10a (Update)

  const handleSearch = (query) => {
    setSearchQuery(query); // Cập nhật state từ khóa tìm kiếm
  };

  // Fetch API lấy danh sách tỉnh
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/city/getAllCity`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          const province = data.data.data.find((el) => {
            return el.name === "Hà Nội"; // Return the element to satisfy the find method
          });
          setProvinces(data.data.data); // Lưu danh sách tỉnh vào state
          setSelectedProvince(province); // Chọn tỉnh Hà Nội mặc định
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  // Fetch API lấy danh sách category
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/category/getAllCategory`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.data) {
          setCategories(data.data.data); // Lưu danh sách category vào category
          setSelectedCategory(data.data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Fetch API lấy danh sách subcategory khi category được chọn
  useEffect(() => {
    if (selectedCategory._id) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/subCategory/getSubCategoryByCategory/${selectedCategory._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data.data) {
            setSubCategories(data.data.data); // Lưu danh sách quận/huyện vào state
          }
        })
        .catch((error) => {
          console.error("Error fetching subCategories:", error);
        });
    }
  }, [selectedCategory]);

  // Fetch API lấy danh sách quận/huyện khi tỉnh thành được chọn
  useEffect(() => {
    if (selectedProvince._id) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/district/getDistrictsByCity/${selectedProvince._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data.data) {
            setDistricts(data.data.data); // Lưu danh sách quận/huyện vào state
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedProvince]);
  return (
    <div>
      <Header
        selectedDistricts={selectedDistricts}
        onSearch={handleSearch}
        provinces={provinces}
        categories={categories}
        selectedProvince={selectedProvince}
        selectedCategory={selectedCategory}
        districts={districts}
        subcategories={subcategories}
        setSelectedCategory={setSelectedCategory}
        setSelectedProvince={setSelectedProvince}
        setSelectedDistricts={setSelectedDistricts}
      />

      <div className="container mt-5">
        <div className="card shadow">
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-md-4">
              <img
                src={currentRestaurant.image}
                alt={currentRestaurant.name}
                className="img-cover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensures the image covers the container
                }}
              />
            </div>

            {/* Content Section */}
            <div className="col-md-8">
              <div className="card-body">
                <h1 className="card-title">{currentRestaurant.name}</h1>
                <p className="text-muted">
                  {currentRestaurant.audiences === "empty"
                    ? "Ăn vặt/vỉa hè - Món Việt - Sinh viên, Cặp đôi, Nhóm bạn"
                    : currentRestaurant.audiences}
                </p>

                {/* Ratings */}
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-center">
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "white",
                        cursor: "pointer",
                        padding: "3px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {currentRestaurant.locationRate}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.locationRate}
                    </span>
                    <p className="text-muted small mb-0">Vị trí</p>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.priceRate}
                    </span>
                    <p className="text-muted small mb-0">Giá cả</p>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.qualityRate}
                    </span>
                    <p className="text-muted small mb-0">Chất lượng</p>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.spaceRate}
                    </span>
                    <p className="text-muted small mb-0">Không gian</p>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.serviceRate}
                    </span>
                    <p className="text-muted small mb-0">Phục vụ</p>
                  </div>
                  <div className="text-center">
                    <span className="fw-bold text-success">
                      {currentRestaurant.qualityRate}
                    </span>
                    <p className="text-muted small mb-0">Bình luận</p>
                  </div>
                </div>

                {/* Information */}
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>
                      <FaLocationArrow />{" "}
                      {currentRestaurant.address &&
                        currentRestaurant.address
                          .split(",")
                          .slice(
                            0,
                            currentRestaurant.address.split(",").length - 2
                          )
                          .join(",")}
                      {","}
                      <IoMapSharp />
                      {currentRestaurant.address &&
                        currentRestaurant.address
                          .split(",")
                          .slice(
                            currentRestaurant.address.split(",").length - 2
                          )
                          .join(",")}
                    </span>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-clock text-success me-2"></i>
                    <span>
                      <FaClock /> Đang mở cửa {currentRestaurant.timeOpen}{" "}
                      <MdError />
                    </span>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-money-bill-wave text-success me-2"></i>
                    <span>
                      <IoIosPricetag /> {currentRestaurant.priceRange}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Slide
        currentRestaurants={currentRestaurant}
        currentFoods={currentFoods}
        currentComments={currentComments}
        currentAlbums={currentAlbums}
      />
      <ProductSuggestion suggestRestaurants={suggestRestaurants} />
      <Footer />
    </div>
  );
};

export default DetailPage;
