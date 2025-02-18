import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../css/ImagesAndVideosPage.css"; // Add your custom styles here
const timeAgo = (timestamp) => {
  const givenTime = new Date(timestamp);
  const currentTime = new Date();
  const timeDifference = Math.floor((currentTime - givenTime) / 1000); // Chênh lệch (giây)

  if (timeDifference < 60) return `${timeDifference} giây trước`;
  if (timeDifference < 3600)
    return `${Math.floor(timeDifference / 60)} phút trước`;
  if (timeDifference < 86400)
    return `${Math.floor(timeDifference / 3600)} giờ trước`;

  return `${Math.floor(timeDifference / 86400)} ngày trước`;
};

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
                    src={album.image}
                    alt={album.type}
                    className="card-img-top fixed-image"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{album.restaurantName}</h6>
                    <p className="card-text text-muted">
                      {timeAgo(album.createdAt)}
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
