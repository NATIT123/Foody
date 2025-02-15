import { useState } from "react";
import { useData } from "../context/DataContext";
const CommentModal = ({
  show,
  onClose,
  restaurant,
  currentItems,
  setCurrentItems,
}) => {
  const [title, setTitle] = useState(restaurant.name);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(1); // Default rate as 1
  const { state } = useData();
  const handleSubmit = () => {
    const formatDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0-11
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    if (!title || !description || !rate) {
      console.log("Please input ");
      return;
    }

    const commentData = {
      title,
      time: formatDate(),
      description,
      rate,
    };
    if (!state.loading && !state.user) return;
    if (!restaurant) return;
    fetch(
      `${process.env.REACT_APP_BASE_URL}/comment/addComment/user/${state.user._id}/restaurant/${restaurant._id}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.data) {
          if (
            data.data.status !== "fail" &&
            data.data.status !== "error" &&
            data.data.status !== 400
          ) {
            console.log("Success");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });

    setTitle(""); // Reset title
    setDescription(""); // Reset description
    setRate(1); // Reset rate to default
    onClose(); // Close modal
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)", // Background opacity
        zIndex: 1051,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="modal-dialog"
        style={{
          marginTop: "100px", // Spacing from the top
          transform: "translateY(20px)", // Adjust the modal position
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm bình luận</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-3">
              <label htmlFor="title">Tiêu đề</label>
              <input
                id="title"
                className="form-control"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả..."
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="rate">Đánh giá</label>
              <input
                id="rate"
                className="form-control"
                type="number"
                min="1"
                max="10"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                placeholder="Đánh giá từ 1 đến 10"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
