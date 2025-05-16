
const GalleryModal = ({ item, onClose }) => {
  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1051,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{
          maxWidth: "90%", // Chiếm 90% chiều rộng màn hình
          width: "90%",
        }}
      >
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header d-flex flex-column align-items-start">
            <h5 className="modal-title">{item.name}</h5>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              {item.address}
            </p>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body" style={{ backgroundColor: "#f8f9fa" }}>
            {item.albums && item.albums.length > 0 ? (
              <div className="row">
                {item.albums.map((image, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-3 mb-3">
                    <img
                      src={image.image}
                      alt={`Ảnh ${index + 1}`}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted fw-bold text-center fs-4">
                Hiện tại không có hình ảnh nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
