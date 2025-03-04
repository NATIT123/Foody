import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

const AdminRestaurantApproval = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const { state, addNotification } = useData();

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/restaurant/getRestaunrantsPending`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${state.accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPendingRestaurants(data.data.data);
        }
      })
      .catch((error) =>
        console.error("Error fetching pending restaurants:", error)
      );
  }, []);

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
    </div>
  );
};

export default AdminRestaurantApproval;
