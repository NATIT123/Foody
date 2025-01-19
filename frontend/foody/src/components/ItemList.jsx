import { Link } from "react-router-dom";

const ItemList = ({ currentItems, handleShowModal }) => (
  <div className="row">
    {currentItems.map((item) => (
      <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className="card h-100">
          <img
            src={item.imgSrc}
            className="card-img-top"
            alt={item.title}
            style={{ objectFit: "cover", height: "180px" }}
          />
          <div className="card-body">
            <Link to="/details" style={{ textDecoration: "none" }}>
              <h4
                className="card-title text-truncate"
                style={{
                  fontSize: "14px",
                  textAlign: "left",
                  margin: "0",
                }}
              >
                {item.title}
              </h4>
            </Link>

            <h6 className="card-subtitle mb-2 text-muted text-truncate">
              {item.subtitle}
            </h6>
            <p className="mb-0 d-flex justify-content-between align-items-center">
              <span
                className="text-muted d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleShowModal(item)}
              >
                <i className="bi bi-chat-dots me-1"></i>
                {item.comments}
              </span>
              <span className="text-muted d-flex align-items-center">
                <i className="bi bi-heart me-1"></i>
                {item.likes}
              </span>
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ItemList;
