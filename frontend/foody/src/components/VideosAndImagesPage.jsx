import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../css/ImagesAndVideosPage.css"; // Add your custom styles here

const ImagesAndVideosPage = ({ albums }) => {
  return (
    <div className="col-md-9 ">
      {/* Content */}
      <div>
        <div className="row">
          {albums && albums.length > 0 ? (
            albums.map((album, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <img
                    src={album.thumbnail}
                    alt={album.title}
                    className="card-img-top fixed-image"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{album.title}</h6>
                    <p className="card-text text-muted">
                      {album.imagesCount} hình ảnh | {album.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <strong className="text-center w-100">
              Không có hình ảnh nào.
            </strong>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesAndVideosPage;
