import "bootstrap/dist/css/bootstrap.min.css";

const ProductSuggestion = ({ suggestRestaurants }) => {
  return (
    <div className="container">
      <h3 className="text-center text-primary my-4">Nhà hàng liên quan</h3>
      <div className=" col-md-9"></div>
      <div className="row">
        {suggestRestaurants &&
          suggestRestaurants.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top img-fluid"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">
                    <a
                      href={`/details/${product._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.name}
                    </a>
                  </h5>

                  <p className="card-text text-muted mb-1">{product.address}</p>
                  <div
                    className="d-flex align-items-center gap-3 mt-3"
                    style={{ flexWrap: "wrap" }} // Cho phép xuống dòng
                  >
                    <span className="badge bg-warning text-dark">
                      Rating: {Math.floor(product.average_score)}
                    </span>
                    <span className="badge bg-info text-dark">
                      Time Open: {product.timeOpen}
                    </span>
                    <span className="badge bg-success">
                      Price Range: {product.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductSuggestion;
