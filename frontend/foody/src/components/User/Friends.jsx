const Friends = ({ items }) => {
  return (
    <div className="container ">
      <div className="row">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="d-flex align-items-center border rounded p-3">
                <a href={`/member/${item._id}`}>
                  <img
                    src={
                      item.photo === "default.jpg"
                        ? "/images/default.jpg"
                        : item.photo
                    }
                    alt={item.photo}
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </a>

                <div className="flex-grow-1">
                  <a href={`/member/${item._id}`}>
                    {" "}
                    <h6 className="mb-1">{item.fullname}</h6>
                  </a>

                  <p className="mb-1 text-muted">
                    {item.totalComments} Bình luận {item.totalAlbums} hình ảnh
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">
            Hiện tại không có người dùng nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default Friends;
