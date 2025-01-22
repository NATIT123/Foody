import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CommentsSection = () => {
  const [activeTab, setActiveTab] = useState('latest'); // State for active tab

  const tabs = [
    { name: 'Mới nhất', count: 774, id: 'latest' },
    { name: 'Bình luận từ bạn bè', count: 0, id: 'friends' },
    { name: 'Của tôi', count: 0, id: 'mine' },
  ];

  const comments = [
    {
      user: 'Foodee_pxjetfee',
      device: 'via iPhone',
      date: '02/12/2024 17:00',
      rating: '10',
      comment: 'Mì dầu hào ngon. Rất tốt cho sức khỏe',
      details: 'Số người: 10+',
      restaurant: 'Mì Dầu Hào HongKong Thượng Hạng',
    },
    {
      user: 'Anna Truong',
      device: 'via iPhone',
      date: '01/12/2024 19:34',
      rating: '5.0',
      comment: 'c',
      restaurant: 'Mì Dầu Hào HongKong Thượng Hạng',
    },
  ];

  return (
    <div className="col-md-9">
      {/* Tabs */}
      <div className="d-flex mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn btn-link text-decoration-none me-3 ${
              activeTab === tab.id ? 'text-danger fw-bold' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name} <span className="text-muted">({tab.count})</span>
          </button>
        ))}

        <div className="ms-auto">
          <select className="form-select form-select-sm w-auto">
            <option>Bình luận</option>
            <option>Đánh giá</option>
          </select>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-3">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="p-3 mb-3"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          >
            {/* Header */}
            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-2">
<div className="d-flex flex-column">
  <strong>{comment.user}</strong>
  <span className="text-muted small">
    {comment.device} - {comment.date}
  </span>
</div>
<span
    className={`badge ${
      parseFloat(comment.rating) >= 7 ? 'bg-success' : 'bg-danger'
    }`}
    style={{
      fontSize: '14px',
      padding: '4px 8px',
      borderRadius: '8px',
    }}
  >
    {comment.rating}
  </span>
</div>
            <div className="d-flex align-items-center my-2">
             
              <span className=" fw-bold">{comment.restaurant}</span>
            </div>
            {/* Comment Text */}
            <p className="mb-1">{comment.comment}</p>
            <p className="text-muted small">{comment.details}</p>

            {/* Footer */}
            <div className="text-muted small">
              - Đây là nhận xét từ Thành Viên trên Foody, không phải từ Foody Corp. -
            </div>

            {/* Action Buttons */}
            <div className="d-flex align-items-center mt-3">
              <button
                className="btn btn-link p-0 me-3 text-muted"
                style={{ textDecoration: 'none', fontSize: '14px' }}
              >
                <i className="fas fa-heart me-1"></i> Thích
              </button>
              <button
                className="btn btn-link p-0 me-3 text-muted"
                style={{ textDecoration: 'none', fontSize: '14px' }}
              >
                <i className="fas fa-comment-alt me-1"></i> Thảo luận
              </button>
              <button
                className="btn btn-link p-0 text-muted"
                style={{ textDecoration: 'none', fontSize: '14px' }}
              >
                <i className="fas fa-exclamation-triangle me-1"></i> Báo lỗi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
