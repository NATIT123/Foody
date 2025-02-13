import React, { useState } from "react";
import { Link } from "react-router-dom";

const ItemsEat = ({ items, itemsPerPage, totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {/* Items Section */}
      <div className="row mt-3">
        {currentItems &&
          currentItems.map((item) => (
            <div
              key={item._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                {/* Image */}
                <div
                  className="position-relative"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={
                      item.albums?.length ? item.albums[0]?.image : item.image
                    }
                    alt={item.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="position-absolute top-0 start-0 bg-success text-white px-2 py-1"
                    style={{
                      fontSize: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    {item.averageRate}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  {/* Title */}
                  <Link
                    to={`/details/${item._id}`}
                    className="text-decoration-none text-dark mb-2 d-block"
                  >
                    <h5
                      className="card-title text-truncate"
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      {item.name}
                    </h5>
                  </Link>

                  {/* Subtitle */}
                  <p
                    className="text-muted text-truncate mb-2"
                    style={{ fontSize: "14px" }}
                  >
                    {item.address}
                  </p>

                  {/* User Review */}
                  <div className="d-flex align-items-center mb-3">
                    <span
                      className="text-muted text-truncate"
                      style={{ fontSize: "14px" }}
                    >
                      {"dasdsa"}
                    </span>
                  </div>

                  {/* Interactions */}
                  {item.comments.length > 0 ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <a href="/member">
                        <img
                          src={
                            item.comments[0]?.user.photo === "default.jpg"
                              ? "/images/default.jpg"
                              : item.comments[0].user.photo
                          }
                          alt={item.name}
                          className="rounded-circle me-2"
                          style={{
                            width: "32px",
                            height: "32px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <span
                        className=""
                        style={{
                          color: "#333",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.comments[0]?.user?.fullname
                          ? item.comments[0]?.user?.fullname.substring(0, 5)
                          : "Ẩn danh"}{" "}
                      </span>
                      <div className="text-muted d-flex align-items-center">
                        <span
                          className="d-flex align-items-center ms-2 text-muted text-truncate"
                          style={{ color: "#444" }}
                        >
                          {item.comments[0]?.description
                            ? item.comments[0].description.substring(0, 15)
                            : "Không có tiêu đề"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">Hiện tại không có bình luận</p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
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
    </>
  );
};

export default ItemsEat;
