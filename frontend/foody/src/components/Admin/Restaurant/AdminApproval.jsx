import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useData } from "../../../context/DataContext";
import { useAppDispatch } from "../../../redux/hooks";
import { addNotification } from "../../../redux/notification/notificationSlice";
import { toast } from "react-toastify";
import {
  callFetchRestaunrantsPending,
  callFindRestaurantsPendingByFields,
} from "../../../services/api";
const AdminRestaurantApproval = ({ searchQuery }) => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const { state, addNotification } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useAppDispatch();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  const getRestaunrantsPending = async () => {
    try {
      const res = await callFetchRestaunrantsPending(currentPage);
      if (res.data.status === "success") {
        setPendingRestaurants(res.data.data.data);
      }
    } catch (error) {
      toast.error("Error fetching pending restaurants:", error);
    }
  };

  const findRestaurantsPendingByFields = async () => {
    if (debouncedSearchQuery) {
      try {
        const res = await callFindRestaurantsPendingByFields(
          currentPage,
          debouncedSearchQuery
        );

        const data = res.data;
        if (
          data.status !== "fail" &&
          data.status !== "error" &&
          data.status !== 400 &&
          data.data?.data
        ) {
          setTotalPages(data.totalPages);
          setPendingRestaurants(data.data.data);
        }
      } catch (error) {
        toast.error("Error fetching restaurants:", error);
      }
    }
  };

  useEffect(() => {
    getRestaunrantsPending();
  }, []);

  useEffect(() => {
    findRestaurantsPendingByFields();
  }, [debouncedSearchQuery, currentPage]);

  const handleApproval = (restaurantId, status) => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/restaurant/updateStatus/${restaurantId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          addNotification(
            `Bạn đã ${
              status === "approved" ? "chấp nhận" : "từ chối"
            }  thành công`
          );
          setPendingRestaurants(
            pendingRestaurants.filter((r) => r._id !== restaurantId)
          );
        }
      })
      .catch((error) => console.error("Error updating status:", error));
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
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Pending Restaurant Approvals</h2>
      <div className="row">
        {pendingRestaurants.length > 0 ? (
          pendingRestaurants.map((restaurant) => (
            <div className="col-12" key={restaurant._id}>
              <div className="card mb-3 shadow-sm w-100">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={
                        restaurant.image || "https://via.placeholder.com/200"
                      }
                      alt={restaurant.name}
                      className="img-fluid rounded-start"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text">
                        <strong>Category:</strong> {restaurant.subCategory}
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
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          handleApproval(restaurant._id, "approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleApproval(restaurant._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No restaurants pending approval.</p>
        )}
      </div>
      {pendingRestaurants &&
        pendingRestaurants.length > 0 &&
        renderPagination()}
    </div>
  );
};

export default AdminRestaurantApproval;
