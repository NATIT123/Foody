import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addNotification } from "../../../redux/notification/notificationSlice";
import { toast } from "react-toastify";
import {
  callFetchPendingOrders,
  callSearchPendingOrders,
  callUpdateOrderStatus,
} from "../../../services/api";
import Loading from "../../Loading";

const OrderApproval = ({ searchQuery }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  const fetchPendingOrders = async () => {
    try {
      setIsPending(true);
      const res = await callFetchPendingOrders(currentPage);
      if (res.status === "success") {
        setIsPending(false);
        setPendingOrders(res.data);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      toast.error("Error fetching pending orders");
    }
  };

  const searchOrders = async () => {
    if (!debouncedSearchQuery) return;
    try {
      const res = await callSearchPendingOrders(
        currentPage,
        debouncedSearchQuery
      );
      if (res.status === "success") {
        setPendingOrders(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      toast.error("Error searching orders");
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      searchOrders();
    } else {
      fetchPendingOrders();
    }
  }, [debouncedSearchQuery, currentPage]);

  const handleApproval = async (orderId, status) => {
    try {
      const res = await callUpdateOrderStatus(orderId, { status });
      if (res.status === "success") {
        dispatch(
          addNotification({
            message: `You have ${
              status === "paid" ? "approved" : "rejected"
            } an order`,
            userId: user._id,
          })
        );
        toast.success(`Order ${status}`);
        setPendingOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
      }
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <nav>
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &laquo; Prev
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
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
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const formatToVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <div className="container mt-4">
          <h2 className="mb-4 text-center">Pending Order Approvals</h2>
          <div className="row">
            {pendingOrders && pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <div className="col-12" key={order._id}>
                  <div className="card mb-3 shadow-sm w-100">
                    <div className="card-body">
                      <h5 className="card-title">Order {order._id}</h5>
                      <p className="card-text">
                        <strong>Customer:</strong> {order.fullName}
                      </p>
                      <p className="card-text">
                        <strong>Address:</strong> {order.address}
                      </p>
                      <p className="card-text">
                        <strong>Phone Number:</strong> {order.phoneNumber}
                      </p>
                      <p className="card-text">
                        <strong>Total Amount: </strong>
                        {formatToVND(order.totalAmount)}
                      </p>
                      <p className="card-text">
                        <strong>Items:</strong>{" "}
                        {order.orderItems
                          .map(
                            (item) =>
                              `${item.productId.name} - (${item.restaurantId.name})`
                          )
                          .join(", ")}
                      </p>
                      <p className="card-text">
                        <strong>Created At:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApproval(order._id, "paid")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleApproval(order._id, "failed")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No orders pending approval.</p>
            )}
          </div>
          {pendingOrders && pendingOrders.length > 0 && renderPagination()}
        </div>
      )}
    </>
  );
};

export default OrderApproval;
