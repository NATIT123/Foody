import React from "react";

const Collection = ({ saved }) => {
  return (
    <div className="container py-4">
      <div className="row">
        {saved && saved.length > 0 ? (
          saved.map((collection, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img
                  src={collection.restaurantInfo.image}
                  alt={collection.restaurantInfo.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <a href={`/details/${collection.restaurantInfo._id}`}>
                    {" "}
                    <h6 className="card-title">
                      {collection.restaurantInfo.name}
                    </h6>
                  </a>

                  <p className="text-muted">
                    {collection.restaurantInfo.address} địa điểm
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <strong className="text-center w-100">Không có nhà hàng nào.</strong>
        )}
      </div>
    </div>
  );
};

export default Collection;
