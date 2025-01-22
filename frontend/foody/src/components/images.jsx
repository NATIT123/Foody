import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageGallery = () => {
  const [activeTab, setActiveTab] = useState('all'); // State for active tab

  const images = [
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpc2nj6h87@resize_ss180x180', category: 'all' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccn4d7ef@resize_ss180x180', category: 'all' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'all' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'all' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'space' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'menu' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'food' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'summary' },
    { src: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxmvbpccoixnc7@resize_ss180x180', category: 'professional' },
  ];

  const categories = [
    { name: 'Tất cả hình', count: 174, id: 'all' },
    { name: 'Không gian', count: 0, id: 'space' },
    { name: 'Món ăn', count: 0, id: 'food' },
    { name: 'Thực đơn', count: 0, id: 'menu' },
    { name: 'Tổng hợp', count: 174, id: 'summary' },
    { name: 'Professional', count: 0, id: 'professional' },
  ];

  return (
    <div className="col-md-9">
      {/* Tabs */}
      <div className="d-flex mb-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-link text-decoration-none me-3 ${
              activeTab === category.id ? 'text-danger fw-bold' : ''
            }`}
            onClick={() => setActiveTab(category.id)}
          >
            {category.name} <span className="text-muted">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="row">
        {images
          .filter((image) => activeTab === 'all' || image.category === activeTab)
          .map((image, index) => (
            <div className="col-6 col-md-3 mb-4 d-flex justify-content-center" key={index}>
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={image.src}
                  alt={`Image ${index + 1}`}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageGallery;
