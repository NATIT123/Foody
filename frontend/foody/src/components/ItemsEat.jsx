import React, { useState } from "react";
import { Link } from "react-router-dom";

const ItemsEat = ({ items, itemsPerPage, handleShowModal }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
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
        {currentItems.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
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
                  src={item.imgSrc}
                  alt={item.title}
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
                  {item.rating}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-3">
                {/* Title */}
                <Link
                  to="/details"
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
                    {item.title}
                  </h5>
                </Link>

                {/* Subtitle */}
                <p
                  className="text-muted text-truncate mb-2"
                  style={{ fontSize: "14px" }}
                >
                  {item.subtitle}
                </p>

                {/* User Review */}
                <div className="d-flex align-items-center mb-3">
                  <span
                    className="text-muted text-truncate"
                    style={{ fontSize: "14px" }}
                  >
                    {item.review}
                  </span>
                </div>

                {/* Interactions */}
                <div className="d-flex justify-content-between align-items-center">
                  <a href="/member">
                    <img
                      src={item.userAvatar}
                      alt={item.review}
                      className="rounded-circle me-2"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                  <div className="text-muted d-flex align-items-center">
                    <i
                      className="bi bi-heart me-1"
                      style={{ color: "#f00" }}
                    ></i>
                    <span style={{ fontSize: "14px" }}>{item.likes}</span>
                  </div>
                </div>
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
