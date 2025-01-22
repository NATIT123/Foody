import React, { useState } from 'react';


const Collection = () => {
  const [activeTab, setActiveTab] = useState('collections'); // State for active tab

  const categories = [
    { name: 'Muốn đến', count: 24, icon: 'fas fa-bookmark' },
    { name: 'Yêu thích', count: 0, icon: 'fas fa-heart' },
    { name: 'Review', count: 19, icon: 'fas fa-comment' },
    { name: 'Check-in', count: 2, icon: 'fas fa-map-marker-alt' },
  ];

  const savedCollections = [
    {
      title: 'Món Hàn',
      image: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhvdggfxtjtac@resize_ss480x300',
      locations: 1,
    },
  ];

  return (
    <div className="container py-4">
      {/* Tabs */}
      <div className="d-flex mb-3">
        <button
          className={`btn btn-outline-primary me-2 ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          Bộ sưu tập
        </button>
        <button
          className={`btn btn-outline-primary ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Đã lưu
        </button>
      </div>

      {/* Content */}
      {activeTab === 'collections' && (
        <div className="row">
          {categories.map((category, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card text-center p-3 border-0 bg-light">
                <i className={`${category.icon} text-secondary`} style={{ fontSize: '36px' }}></i>
                <h6 className="mt-2">{category.name}</h6>
                <p className="text-muted">{category.count} địa điểm</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="row">
          {savedCollections.map((collection, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={collection.image} alt={collection.title} className="card-img-top" />
                <div className="card-body">
                  <h6 className="card-title">{collection.title}</h6>
                  <p className="text-muted">{collection.locations} địa điểm</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
