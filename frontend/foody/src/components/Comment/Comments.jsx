import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { callFetchListComment } from "../../services/api";
import { toast } from "react-toastify";
import Loading from "../Loading";
const Comments = () => {
  const [activeTab, setActiveTab] = useState("new"); // State for active tab
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [comments, setComments] = useState([]);
  const itemsPerPage = 10; // Số bình luận hiển thị trên mỗi trang
  const [isPending, setIsPending] = useState(false);
  const getAllComments = async () => {
    try {
      setIsPending(true);
      const res = await callFetchListComment();
      if (res?.data?.status !== "fail" && res?.data?.status !== "error") {
        setIsPending(false);
        setComments(res.data.data);
      } else {
        toast.error(
          "Failed to fetch comments:",
          res.data.message || "Unknown error"
        );
      }
    } catch (err) {
      toast.error("Error fetching comments:", err.message || err);
    }
  };
  useEffect(() => {
    getAllComments();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComments = comments.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <div className="container">
          {/* Tabs */}
          <div className="d-flex mb-3">
            <button
              className={`btn btn-outline-primary me-2 ${
                activeTab === "new" ? "active" : ""
              }`}
              onClick={() => setActiveTab("new")}
            >
              Bình luận mới
            </button>
          </div>

          {/* Comments */}
          <div className="comment-list">
            {currentComments && currentComments.length > 0 ? (
              currentComments.map((comment, index) => (
                <div className="card mb-4" key={index}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          src={
                            comment?.user.photo === "default.jpg"
                              ? "/images/default.jpg"
                              : comment?.user.photo
                          }
                          alt="User Avatar"
                          className="rounded-circle"
                          width="50"
                          height="50"
                        />
                      </div>
                      <div>
                        <h6 className="mb-1" style={{ fontWeight: "bold" }}>
                          {comment.user.fullname}
                        </h6>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontWeight: "bold" }}
                          to={`/details/${comment.restaurant._id}`}
                          className="text-decoration-none text-dark mb-2 d-block"
                        >
                          {comment.restaurant.name}
                        </Link>{" "}
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                        >
                          {comment.type} | {comment.time}
                        </p>
                      </div>
                      <span className="ms-auto badge bg-success fs-5">
                        {comment.rate}
                      </span>
                    </div>

                    <p className="mt-3" style={{ fontWeight: "bold" }}>
                      {comment.title}
                    </p>

                    <p className="mt-3">{comment.description}</p>

                    {/* Images */}
                    <div className="d-flex">
                      {comment.restaurant?.albums &&
                        comment.restaurant?.albums.map((image, i) => (
                          <img
                            key={i}
                            src={image.image}
                            alt={comment.restaurant.name}
                            className="img-thumbnail me-2"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <h5 className="text-muted mt-3">
                  Hiện tại không có bình luận nào.
                </h5>
              </div>
            )}
          </div>

          {/* Pagination */}
          {comments && comments.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <button
                className="btn btn-outline-primary mx-2"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                &laquo; Trước
              </button>
              <span className="mx-3 text-muted">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-outline-primary mx-2"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Sau &raquo;
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Comments;
