import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import { addNotification } from "../../redux/notification/notificationSlice";
import { callAddComment } from "../../services/api";
const CommentModal = ({
  show,
  onClose,
  restaurant,
  setMyComments,
  setCurrentItems,
  myComments,
}) => {
  const [title, setTitle] = useState(restaurant.name);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(1); // Default rate as 1
  const user = useAppSelector((state) => state.account.user);
  const isLoading = useAppSelector((state) => state.account.loading);
  const dispatch = useAppDispatch();
  const formatDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const handleSubmit = async (name) => {
    if (!title || !description || !rate) {
      toast.error("Please input all required fields");
      return;
    }

    if (!user || !restaurant || isLoading) return;

    const commentData = {
      title,
      time: formatDate(),
      description,
      rate,
    };

    try {
      const res = await callAddComment(user._id, restaurant._id, commentData);
      const data = res.data;
      console.log("Data", data);
      if (data?.data && res.status !== "fail" && res.status !== "error") {
        const commentId = data.data.data;

        const newComment = {
          ...commentData,
          type: "Via Web",
          _id: commentId,
          user: [
            {
              _id: user._id,
              fullname: user.fullname,
              photo: user.photo,
            },
          ],
        };

        setMyComments([newComment, ...myComments]);

        setCurrentItems((prevItems) =>
          prevItems.map((el) =>
            el._id.toString() === restaurant._id.toString()
              ? {
                  ...el,
                  comments: [
                    {
                      ...commentData,
                      type: "Via Web",
                      _id: commentId,
                      user: {
                        _id: user._id,
                        fullname: user.fullname,
                        photo: user.photo,
                      },
                    },
                    ...el.comments,
                  ],
                  commentCount: el.commentCount + 1,
                }
              : el
          )
        );

        dispatch(
          addNotification({
            message: `Add comment restaurant ${name} successfully.`,
            userId: user._id,
          })
        );
        toast.success(`Add comment restaurant ${name} successfully.`);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Error adding comment.");
    }

    setDescription(""); // Reset description
    setRate(1); // Reset rate
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
            <button
              className="btn btn-primary"
              onClick={() => handleSubmit(restaurant.name)}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
