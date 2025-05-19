import { useState, useEffect } from "react";
import FoodModal from "./FoodModal";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { addNotification } from "../../../redux/notification/notificationSlice";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import {
  callFetchDistrictsByCity,
  callFetchOwners,
  callFetchSubCategories,
} from "../../../services/api";
import {
  createRestaurant,
  fetchOwnerRestaurants,
  fetchRestaurants,
  fetchRestaurantsByFields,
  updateRestaurant,
  deleteRestaurant,
  fetchRestaurantsOwnerByFields,
} from "../../../redux/restaurant/restaurantSlice";
const RestaurantManagement = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add", "edit", "view"
  const [formData, setFormData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const [owners, setOwners] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const restaurants = useAppSelector((state) => state.restaurant.restaurants);
  const cuisines = useAppSelector((state) => state.resource.cuisines);
  const cities = useAppSelector((state) => state.resource.cities);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await callFetchSubCategories();
        const data = response.data;
        if (response.status === "success") {
          setSubCategories(data.data.data);
        }
      } catch (error) {
        toast.error("Fetch owners error:", error);
      }
    };

    fetchSubCategories();

    const fetchOwners = async () => {
      try {
        const response = await callFetchOwners();
        const data = response.data;
        if (response.status === "success") {
          setOwners(data.data);
        }
      } catch (error) {
        toast.error("Fetch owners error:", error);
      }
    };

    fetchOwners();
  }, []);
  useEffect(() => {
    if (user?.role === "admin") {
      const fetchData = async () => {
        try {
          const result = await dispatch(fetchRestaurants(currentPage)).unwrap();
          setTotalPages(result.totalPages);
        } catch (err) {
          toast.error("Error is encounterd");
        }
      };
      fetchData();
    } else if (user?.role === "owner") {
      const fetchRestaurants = async () => {
        try {
          const result = await dispatch(
            fetchOwnerRestaurants(user?._id, currentPage)
          ).unwrap();
          setTotalPages(result.totalPages);
        } catch (err) {
          toast.error("Error is encounterd");
        }
      };
      fetchRestaurants();
    }
  }, [currentPage, user]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      if (user.role === "admin") {
        const fetchRestaurants = async () => {
          try {
            const result = await dispatch(
              fetchRestaurantsByFields(currentPage, debouncedSearchQuery)
            ).unwrap();
            setTotalPages(result.totalPages);
          } catch (err) {
            toast.error("Error is encounterd");
          }
        };
        fetchRestaurants();
      } else if (user?.role === "owner") {
        try {
          const result = dispatch(
            fetchRestaurantsOwnerByFields(currentPage, debouncedSearchQuery)
          ).unwrap();
          setTotalPages(result.totalPages);
        } catch (err) {
          toast.error("Error is encounterd");
        }
      }
    }
  }, [debouncedSearchQuery, dispatch, currentPage, user]);

  const fetchDistrictsByCity = async (cityId) => {
    if (!cityId) {
      setDistricts([]);
      return;
    }

    try {
      const result = await callFetchDistrictsByCity(cityId);
      if (result.status === "success") {
        setDistricts(result.data.data);
      }
    } catch (err) {
      toast.error("Error is encounterd");
    }
  };

  const handleOpenModal = (mode, restaurant = null) => {
    setModalMode(mode);
    setIsModalOpen(true);
    if (mode === "food") {
      setRestaurant(restaurant);
    }
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

  const deleteRestaurantNow = () => {
    try {
      dispatch(deleteRestaurant(formData._id));
      dispatch(addNotification());
      addNotification(
        `You have successfully deleted the restaurant ${formData.name}`
      );
      toast.success(`Delete restaurant ${formData.name} successfully`);
    } catch (err) {
      toast.error("Error is encouterd");
    }

    setShowModalDelete(false);
    setFormData({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSave = () => {
    if (modalMode === "edit") {
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
      try {
        dispatch(updateRestaurant(formData._id, formDataToSend));
        dispatch(
          addNotification(
            `You have successfully edited the restaurant ${formData.name}`,
            user._id
          )
        );

        toast.success(
          `You have successfully edited the restaurant ${formData.name}`
        );
      } catch (err) {
        toast.error("Error is encouterd");
      }
    } else if (modalMode === "add") {
      let status = "approved";
      let ownerId = formData.ownerId;
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("timeOpen", formData.timeOpen);
      formDataToSend.append("priceRange", formData.priceRange);
      formDataToSend.append("image", formData.image);
      if (user?.role === "owner") ownerId = user?._id.toString();
      formDataToSend.append("ownerId", ownerId);
      formDataToSend.append("subCategoryId", formData.subCategoryId);
      formDataToSend.append("cuisinesId", formData.cuisinesId);
      formDataToSend.append("districtId", formData.districtId);
      if (user?.role === "owner") status = "pending";
      formDataToSend.append("status", status);

      try {
        dispatch(createRestaurant(formDataToSend));
        dispatch(
          addNotification(
            `You have successfully added the restaurant ${formData.name}`,
            user._id
          )
        );

        toast.success(
          `You have successfully added the restaurant ${formData.name}`
        );
      } catch (err) {
        toast.error("Error is encouterd");
      }
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
                      {user?.role === "admin" && (
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteRestaurant(restaurant)}
                        >
                          Delete
                        </button>
                      )}
                      {user?.role === "owner" && (
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
                  onClick={deleteRestaurantNow}
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
                    {user?.role === "admin" && (
                      <div className="mb-3">
                        <label className="form-label">Owner</label>
                        <select
                          className="form-control"
                          value={formData.ownerId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ownerId: e.target.value,
                            })
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
                    )}

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
