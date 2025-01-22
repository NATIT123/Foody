import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/ImagesAndVideosPage.css'; // Add your custom styles here

const ImagesAndVideosPage = () => {
  const [activeTab, setActiveTab] = useState('albums'); // State for active tab

  const albums = [
    {
      title: 'Hana BBQ & Hot Pot Buffet - Phan Văn Trị',
      imagesCount: 21,
      date: '2016/8/9',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9g1wj1xnff2b@resize_ss214x214',
    },
    {
      title: 'Hỷ Lạc Quán - Món Chay',
      imagesCount: 4,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'Moon Fast Food - Món Hàn - Tr.',
      imagesCount: 5,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'Mì Cay Naga - 224 Phạm Văn D...',
      imagesCount: 10,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'Food Court - AEON Mall Tân Phú',
      imagesCount: 8,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'Gà rán và Mì Ý - Jollibee - Past...',
      imagesCount: 3,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'King BBQ - Vua Nướng Hàn Q...',
      imagesCount: 48,
      date: '2016/8/2',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
    {
      title: 'Hoa Ly - Trà Sữa Nhà Làm',
      imagesCount: 3,
      date: '2016/5/28',
      thumbnail: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb9nerlw4wr5c@resize_ss214x214',
    },
  ];

  return (
    <div className="col-md-9 ">
      {/* Tabs */}
      <div className="d-flex mb-3">
        <button
          className={`btn btn-outline-primary me-2 ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          Albums
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'albums' && (
          <div className="row">
            {albums.map((album, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <img
                    src={album.thumbnail}
                    alt={album.title}
                    className="card-img-top fixed-image"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{album.title}</h6>
                    <p className="card-text text-muted">
                      {album.imagesCount} hình ảnh | {album.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary">Xem thêm</button>
      </div>
    </div>
  );
};

export default ImagesAndVideosPage;
