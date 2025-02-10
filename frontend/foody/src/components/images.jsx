import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageGallery = ({ currentAlbums }) => {
  const [activeTab, setActiveTab] = useState("all"); // State for active tab

  const categories = [
    { name: "Tất cả hình", count: currentAlbums.length, id: "all" },
  ];

  return (
    <div className="col-md-9">
      {/* Tabs */}
      <div className="d-flex mb-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-link text-decoration-none me-3 ${
              activeTab === category.id ? "text-danger fw-bold" : ""
            }`}
            onClick={() => setActiveTab(category.id)}
          >
            {category.name}{" "}
            <span className="text-muted">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="row">
        {currentAlbums &&
          currentAlbums.map((image, index) => (
            <div
              className="col-6 col-md-3 mb-4 d-flex justify-content-center"
              key={index}
            >
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={image.src}
                  alt={`Image ${index + 1}`}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageGallery;
