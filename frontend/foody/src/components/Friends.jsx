import React, { useState } from 'react';


const Friends = () => {
  const [activeTab, setActiveTab] = useState('following'); // State for active tab

  const friendsList = [
    {
      name: 'Yến Nhi Ngô',
      comments: 0,
      photos: 0,
      friends: 0,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Hao Mi',
      comments: 0,
      photos: 0,
      friends: 0,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Phương Ngọc Trân',
      comments: 0,
      photos: 0,
      friends: 230,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Linh Tran',
      comments: 1,
      photos: 2,
      friends: 61,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Tramy Nguyen',
      comments: 0,
      photos: 0,
      friends: 0,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Thuy Tu Nguyen',
      comments: 0,
      photos: 0,
      friends: 0,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Nguyễn Tú',
      comments: 0,
      photos: 0,
      friends: 0,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
    {
      name: 'Nguyen L Binh',
      comments: 0,
      photos: 0,
      friends: 65,
      avatar: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjguk9pf4rdb5',
    },
  ];

  return (
    <div className="container ">
      {/* Tabs */}
      <div className="d-flex mb-3">
        <button
          className={`btn btn-outline-primary me-2 ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Quan tâm
        </button>
        <button
          className={`btn btn-outline-primary ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          Được quan tâm
        </button>
      </div>

      {/* Friends List */}
      <div className="row">
        {friendsList.map((friend, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div className="d-flex align-items-center border rounded p-3">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <h6 className="mb-1">{friend.name}</h6>
                <p className="mb-1 text-muted">
                  {friend.comments} Bình luận {friend.photos} hình ảnh
                </p>
                <p className="mb-0 text-muted">{friend.friends} Bạn bè</p>
              </div>
              <button className="btn btn-outline-primary btn-sm">+ Quan tâm</button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary">Xem thêm</button>
      </div>
    </div>
  );
};

export default Friends;
