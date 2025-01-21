import { Link } from "react-router-dom";
import { FaComment, FaCamera, FaBookmark, FaUser } from "react-icons/fa";
const ItemList = ({ currentItems, handleShowModal }) => (
  <div className="row">
    {currentItems.map((item) => (
      <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className="card h-100">
          <img
            src={item.image}
            className="card-img-top"
            alt={item.name}
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
                {item.name}
              </h4>
            </Link>

            <h6 className="card-subtitle mb-2 text-muted text-truncate">
              {item.address}
            </h6>
            <hr
              style={{ flex: 1, border: 0, height: "1px", background: "#ccc" }}
            />
            <h6 className="card-subtitle mb-2 text-muted d-flex justify-content-start align-items-center">
              {/* User Avatar */}
              <FaUser
                style={{
                  fontSize: "16px",
                  color: "#333",
                  cursor: "pointer",
                  padding: "3px",
                  borderRadius: "50%",
                  backgroundColor: "#dcdcdc",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              {/* User Name and Description */}
              <span
                className="d-flex align-items-center ms-2"
                style={{
                  color: "#333",
                  maxWidth: "200px", // You can adjust the width as needed
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                sadsad
              </span>
              <span
                className="d-flex align-items-center ms-2 text-muted text-truncate"
                style={{
                  color: "#444",
                }}
              >
                sadsadd
              </span>
            </h6>
            <hr
              style={{ flex: 1, border: 0, height: "1px", background: "#ccc" }}
            />
            <p className="mb-0 d-flex justify-content-between align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ fontSize: "14px" }}
              >
                <i className="bi bi-chat-dots me-2"></i>
                <FaComment
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowModal(item)}
                />
                <span className="ms-1">sadsad</span>
                <i className="bi bi-chat-dots me-2"></i>
                <FaCamera />
                <span className="ms-1">sadsad</span>
              </div>

              <div style={{ backgroundColor: "#f5f5f5" }}>
                <span className="text-muted d-flex align-items-center">
                  <i className="bi bi-heart me-1"></i>
                  <FaBookmark /> {"Lưu"}
                </span>
              </div>
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ItemList;
