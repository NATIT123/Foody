import Slide from "../../components/Grid/Slide";
import ProductSuggestion from "../../components/Item/ProductSuggestion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoMapSharp } from "react-icons/io5";

import axios from "axios";
import { useData } from "../../context/DataContext";
const DetailPage = () => {
  const { id } = useParams();
  const { state } = useData();
  const [totalRate, setTotalRate] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState([]); // Dữ liệu sau khi lọc
  const [currentFood, setCurrentFood] = useState([]); // Dữ liệu sau khi lọc
  const [currentComment, setCurrentComment] = useState([]); // Dữ liệu sau khi lọc
  const [currentAlbum, setCurrentAlbum] = useState([]); // Dữ liệu sau khi lọc
  const [suggestRestaurants, setSuggestRestaurants] = useState([]); // Dữ liệu sau khi lọc

  function checkTime(openTime, closeTime) {
    const now = new Date();
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();

    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    let currentTotalMinutes = currentHour * 60 + currentMinute;
    let openTotalMinutes = openHour * 60 + openMinute;
    let closeTotalMinutes = closeHour * 60 + closeMinute;

    if (closeTotalMinutes < openTotalMinutes) {
      closeTotalMinutes += 24 * 60;
      if (currentTotalMinutes < openTotalMinutes) {
        currentTotalMinutes += 24 * 60;
      }
    }

    return (
      currentTotalMinutes >= openTotalMinutes &&
      currentTotalMinutes < closeTotalMinutes
    );
  }

  function isOpen(time) {
    if (time && time !== "empty") {
      if (time.includes("|")) {
        const timeFirst = time.split("|")[0];
        const timeSecond = time.split("|")[1];

        if (timeFirst === "Cả ngày") return true;

        const timeFirstOpen = timeFirst.split(" - ")[0];
        const timeFirstClose = timeFirst.split(" - ")[1];

        const timeSecondOpen = timeSecond.split(" - ")[0];
        const timeSecondClose = timeSecond.split(" - ")[1];

        return (
          checkTime(timeFirstOpen, timeFirstClose) ||
          checkTime(timeSecondOpen, timeSecondClose)
        );
      } else {
        const openTime = time.split(" - ")[0];
        const closeTime = time.split(" - ")[1];

        return checkTime(openTime, closeTime);
      }
    }
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/restaurant/getRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.data) {
          setCurrentRestaurant(data.data.data); // Lưu danh sách restaurant vào state
          const restaurant = data.data.data;
          let total =
            restaurant.qualityRate +
            restaurant.serviceRate +
            restaurant.locationRate +
            restaurant.priceRate +
            restaurant.spaceRate;
          total /= 5;
          setTotalRate(Math.floor(total));
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  useEffect(() => {
    if (currentRestaurant.name) {
      document.title = `${currentRestaurant.name} ${currentRestaurant.address}`;
    }
  }, [currentRestaurant]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/food/getFoodsByRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.data) {
          if (data.status === "success") {
            setCurrentFood(data.data.data); // Lưu danh sách restaurant vào state
          }
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
        if (data.data?.data) {
          if (data.status === "success") {
            setCurrentComment(data.data.data); // Lưu danh sách restaurant vào state
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/album/getAlbumsByRestaurant/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.data) {
          if (data.status === "success") {
            setCurrentAlbum(data.data.data); // Lưu danh sách restaurant vào state
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, [id]);

  // Fetch API lấy detail restaurant
  useEffect(() => {
    if (!state.user) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            "http://127.0.0.1:8005/recommendations",
            {
              params: {
                user_id: state.user._id,
                current_restaurant_id: id,
                top_n: 5,
                user_lat: latitude,
                user_lon: longitude,
              },
            }
          );

          console.log("API gợi ý nhà hàng:", response);

          if (
            response.data &&
            response.data.recommended_restaurants.length > 0
          ) {
            setSuggestRestaurants(response.data.recommended_restaurants);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API gợi ý nhà hàng:", error);
        }
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
      }
    );
  }, [id, state.user]);

  return (
    <div>
      {/* <Header
        selectedSubCategories={selectedSubCategories}
        setSelectedSubCategories={setSelectedSubCategories}
        selectedCuisines={selectedCuisines}
        setSelectedCuisines={setSelectedCuisines}
        selectedDistricts={selectedDistricts}
        setSelectedDistricts={setSelectedDistricts}
      /> */}

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

                <p className="text-secondary fs-5 fw-bold fw-light mb-2">
                  <span className="fw-bold">
                    {currentRestaurant?.cuisinesId?.name || ""}
                  </span>
                  {" - "}
                  {currentRestaurant.audiences === "empty" ? (
                    <span className="text-primary">
                      Ăn vặt/vỉa hè - Món Việt - Sinh viên, Cặp đôi, Nhóm bạn
                    </span>
                  ) : (
                    <span className="text-success">
                      {currentRestaurant.audiences}
                    </span>
                  )}
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
                      {totalRate}
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
                      {" "}
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
                    <i
                      className={`fas fa-clock ${
                        isOpen(currentRestaurant?.timeOpen)
                          ? "text-success"
                          : "text-danger"
                      }  me-2`}
                    ></i>
                    <span>
                      {isOpen(currentRestaurant?.timeOpen)
                        ? "Đang mở cửa"
                        : "Đóng cửa"}{" "}
                      {currentRestaurant?.timeOpen}{" "}
                    </span>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-money-bill-wave text-success me-2"></i>
                    <span>{currentRestaurant.priceRange}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Slide
        setCurrentAlbum={setCurrentAlbum}
        setCurrentComment={setCurrentComment}
        currentRestaurant={currentRestaurant}
        currentFood={currentFood}
        currentComment={currentComment}
        currentAlbum={currentAlbum}
      />
      <ProductSuggestion suggestRestaurants={suggestRestaurants} />
    </div>
  );
};

export default DetailPage;
