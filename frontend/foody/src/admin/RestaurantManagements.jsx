import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useData } from "../context/DataContext";
import FoodModal from "./FoodModal";
const RestaurantManagement = ({ searchQuery }) => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // For navigation to the home page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add", "edit", "view"
  const [formData, setFormData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [foodData, setFoodData] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [owners, setOwners] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const handleUpdateFood = (updatedFood) => {
    setFoodData((prev) =>
      prev.map((food) => (food._id === updatedFood._id ? updatedFood : food))
    );
  };
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/subCategory/getSubCategoryByCategorySpecific`
        );
        const data = await response.json();
        if (data.status === "success") {
          setSubCategories(data.data.data);
        }
      } catch (error) {
        console.error("Fetch owners error:", error);
      }
    };

    fetchSubCategories();
  }, []);
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/user/findUsersByRole`
        );
        const data = await response.json();
        if (data.status === "success") {
          setOwners(data.data);
        }
      } catch (error) {
        console.error("Fetch owners error:", error);
      }
    };

    fetchOwners();
  }, []);
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/cuisines/getAllCuisines`
        );
        const data = await response.json();
        if (data.status === "success") {
          setCuisines(data.data.data);
        }
      } catch (error) {
        console.error("Fetch owners error:", error);
      }
    };

    fetchCuisines();
  }, []);
  const { state, addNotification } = useData();
  useEffect(() => {
    if (state.user.role === "admin") {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getAllRestaurants?page=${currentPage}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data && Array.isArray(data.data.data)) {
            if (!["fail", "error", 400].includes(data.status)) {
              setTotalPages(data.totalPages);
              setRestaurants(data.data.data);
            }
          } else {
            console.error("Invalid API response:", data);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
          if (error.response && [401, 403].includes(error.response.status)) {
            navigate("/");
          }
        });
    } else if (state.user.role === "owner") {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/getOwnerRestaurants/${state.user._id}?page=${currentPage}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data && Array.isArray(data.data.data)) {
            if (!["fail", "error", 400].includes(data.status)) {
              setTotalPages(data.totalPages);
              setRestaurants(data.data.data);
            }
          } else {
            console.error("Invalid API response:", data);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
          if (error.response && [401, 403].includes(error.response.status)) {
            navigate("/");
          }
        });
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/findRestaurantsByFields?page=${currentPage}&searchQuery=${searchQuery}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data?.data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setTotalPages(data.totalPages);
              setRestaurants(data.data.data);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/city/getAllCity`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCities(data.data.data);
        }
      })
      .catch((error) => console.log("Fetch error: ", error));
  }, []);

  const fetchDistrictsByCity = (cityId) => {
    if (!cityId) {
      setDistricts([]);
      return;
    }

    fetch(
      `${process.env.REACT_APP_BASE_URL}/district/getDistrictsByCity/${cityId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDistricts(data.data.data);
        }
      })
      .catch((error) => console.log("Fetch error: ", error));
  };

  const handleOpenModal = (mode, restaurant = null) => {
    if (mode === "food") {
      setShowModal(true);
      if (restaurant) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}/food/getFoodsByRestaurant/${restaurant._id}`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              if (
                data.status !== "error" &&
                data.status !== "fail" &&
                data.status !== 400
              ) {
                setRestaurant(restaurant);
                setFoodData(data.data.data);
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching restaurants:", error);
          });
      }
      return;
    }
    setModalMode(mode);
    setIsModalOpen(true);
    if (restaurant) {
      setFormData({ ...restaurant, imagePreview: restaurant.image });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Tạo URL tạm để xem trước ảnh
      setFormData({
        ...formData,
        image: file,
        imagePreview: imageURL,
      });
    }
  };

  const handleDeleteRestaurant = (value) => {
    const restaurant = restaurants.find((u) => u._id === value._id);
    if (restaurant) {
      setFormData(restaurant);
      setShowModalDelete(true);
    }
  };

  const deleteRestaurant = () => {
    if (!state.accessToken) return;
    fetch(
      `${process.env.REACT_APP_BASE_URL}/restaurant/deleteRestaurant/${formData._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            setRestaurants(
              restaurants.filter(
                (restaurant) => restaurant._id !== formData._id
              )
            );
            addNotification(`Bạn đã xóa nhà hàng ${formData.name} thành công`);
            console.log("Delete Success");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setShowModalDelete(false);
    setFormData({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSave = () => {
    if (modalMode === "edit") {
      const updatedRestaurant = {
        name: formData.name,
        address: formData.address,
        timeOpen: formData.timeOpen,
        priceRange: formData.priceRange,
        image: foodData.image,
        ownerId: formData.ownerId,
        cuisinesId: formData.cuisinesId,
        subCategoryId: formData.subCategoryId,
        districtId: formData.districtId,
      };
      if (!state.accessToken) return;
      fetch(
        `${process.env.REACT_APP_BASE_URL}/restaurant/updateRestaurant/${formData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.accessToken}`,
          },
          body: JSON.stringify(updatedRestaurant),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setRestaurants(
                restaurants.map((restaurant) =>
                  restaurant._id === formData._id
                    ? {
                        ...updatedRestaurant,
                        _id: data.data._id.toString(),
                        image: data.data.image,
                      }
                    : restaurant
                )
              );
              addNotification(
                `Bạn đã sửa nhà hàng ${formData.name} thành công`
              );
              console.log("Update Success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (modalMode === "add") {
      let status = "approved";
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("timeOpen", formData.timeOpen);
      formDataToSend.append("priceRange", formData.priceRange);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("ownerId", formData.ownerId);
      formDataToSend.append("subCategoryId", formData.subCategoryId);
      formDataToSend.append("cuisinesId", formData.cuisinesId);
      formDataToSend.append("districtId", formData.districtId);
      if (state.user.role === "owner") status = "pending";
      formDataToSend.append("status", status);
      const addRestaurant = {
        name: formData.name,
        address: formData.address,
        timeOpen: formData.timeOpen,
        priceRange: formData.priceRange,
        image: foodData.image,
        ownerId: formData.ownerId,
        status: status,
        cuisinesId: formData.cuisinesId,
        subCategoryId: formData.subCategoryId,
        districtId: formData.districtId,
      };
      if (!state.accessToken) return;
      fetch(`${process.env.REACT_APP_BASE_URL}/restaurant/addRestaurant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              if (state.user.role === "admin") {
                setRestaurants([
                  {
                    ...addRestaurant,
                    _id: data.restaurant._id.toString(),
                    image: data.restaurant.image,
                  },
                  ...restaurants,
                ]);
              }
              addNotification(
                `Bạn đã thêm nhà hàng ${formData.name} thành công`
              );
              console.log("Add Success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleCloseModal();
  };
  const changePage = (page) => {
    setCurrentPage(page);
  };
  const renderPagination = () => {
    if (totalPages <= 1) return null; // Ẩn nếu chỉ có 1 trang

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

          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => changePage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

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
    <div className="container mt-2">
      <h2 className="mb-4 text-center">Restaurant Management</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => handleOpenModal("add")}
      >
        Add Restaurant
      </button>

      <div className="row">
        {restaurants &&
          restaurants.map((restaurant) => (
            <div className="col-12" key={restaurant._id}>
              <div className="card mb-3 shadow-sm w-100">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="img-fluid rounded-start"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text text-muted">
                        {restaurant.subCategory}
                      </p>
                      <p className="card-text">
                        <strong>Location:</strong> {restaurant.address}
                      </p>
                      <p className="card-text">
                        <strong>Open Hours:</strong> {restaurant.timeOpen}
                      </p>
                      <p className="card-text">
                        <strong>Price Range:</strong> {restaurant.priceRange}
                      </p>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleOpenModal("view", restaurant)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleOpenModal("edit", restaurant)}
                      >
                        Edit
                      </button>
                      {state.user.role === "admin" && (
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteRestaurant(restaurant)}
                        >
                          Delete
                        </button>
                      )}
                      {state.user.role === "owner" && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleOpenModal("food", restaurant)}
                        >
                          Manage Food
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {showModalDelete && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Restaurant</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalDelete(false)}
                ></button>
              </div>
              <div class="modal-body">
                <p>{`Do you want to delete ${formData.name} `} </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalDelete(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteRestaurant}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {restaurants && restaurants.length > 0 && renderPagination()}
      <FoodModal
        restaurant={restaurant}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        foods={foodData}
        onUpdateFood={handleUpdateFood}
      />
      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "view"
                    ? "Restaurant Details"
                    : modalMode === "edit"
                    ? "Edit Restaurant"
                    : "Add Restaurant"}
                </h5>
              </div>

              <div className="modal-body">
                {modalMode === "view" ? (
                  <div>
                    <h5>{formData.name}</h5>
                    <p>
                      <strong>Categories:</strong> {formData.subCategory || ""}
                    </p>
                    <p>
                      <strong>Location:</strong> {formData.address || ""}
                    </p>
                    <p>
                      <strong>Open Hours:</strong> {formData.timeOpen || ""}
                    </p>
                    <p>
                      <strong>Price Range:</strong> {formData.priceRange}
                    </p>
                    <p>
                      <strong>Ratings:</strong>
                      <ul>
                        <li>Vị trí: {formData?.locationRate || ""}</li>
                        <li>Giá cả: {formData?.priceRate || ""}</li>
                        <li>Chất lượng: {formData?.qualityRate || ""}</li>
                        <li>Không gian: {formData?.spaceRate || ""}</li>
                        <li>Phục vụ: {formData?.serviceRate || ""}</li>
                      </ul>
                    </p>
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "300px", // Chiều cao khung ảnh
                        overflow: "hidden", // Ẩn nội dung vượt khung
                      }}
                    >
                      <img
                        src={formData.image}
                        alt={formData.name}
                        className="img-fluid"
                        style={{
                          maxWidth: "500px", // Giới hạn chiều rộng
                          maxHeight: "250px", // Giới hạn chiều cao
                          objectFit: "cover", // Cắt ảnh vừa khung
                          borderRadius: "10px", // Bo góc nhẹ
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Restaurant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Restaurant Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    {formData.imagePreview && (
                      <div className="mb-3">
                        <label className="form-label">Preview</label>
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px", marginTop: "10px" }}
                        />
                      </div>
                    )}
                    {/* Chọn Thành Phố */}
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <select
                        className="form-control"
                        value={formData.cityId}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            cityId: e.target.value,
                            districtId: formData?.districtId || "",
                          });
                          fetchDistrictsByCity(e.target.value);
                        }}
                      >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                          <option key={city._id} value={city._id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chọn Quận */}
                    <div className="mb-3">
                      <label className="form-label">District</label>
                      <select
                        className="form-control"
                        value={formData.districtId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            districtId: e.target.value,
                          })
                        }
                        disabled={!formData.cityId}
                      >
                        <option value="">Select a district</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district._id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Owner</label>
                      <select
                        className="form-control"
                        value={formData.ownerId}
                        onChange={(e) =>
                          setFormData({ ...formData, ownerId: e.target.value })
                        }
                      >
                        <option value="">Select an owner</option>
                        {owners.map((owner) => (
                          <option key={owner._id} value={owner._id}>
                            {owner.fullname}
                          </option>
                        ))}
                      </select>{" "}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subcategory</label>
                      <select
                        className="form-control"
                        value={formData.subCategoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategoryId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a subcategory</option>
                        {subCategories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cuisines</label>
                      <select
                        className="form-control"
                        value={formData.cuisinesId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cuisinesId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a cuisine</option>
                        {cuisines.map((cuisine) => (
                          <option key={cuisine._id} value={cuisine._id}>
                            {cuisine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Open Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.timeOpen || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeOpen: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price Range</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.priceRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceRange: e.target.value,
                          })
                        }
                      />
                    </div>
                  </form>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {modalMode !== "view" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
