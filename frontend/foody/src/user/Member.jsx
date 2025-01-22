import React, { useState } from 'react';
import '../css/Member.css'; // Import the CSS for styling
import ImagesAndVideosPage from '../components/VideosAndImagesPage';
import Header from '../components/Header';
import Friends from '../components/Friends';
import Collection from '../components/Collection';

const Member = () => {
  const [activeSection, setActiveSection] = useState('hoatdong'); // State for tracking active section
  const [isExpanded, setIsExpanded] = useState(false); // State for "Xem thêm"

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText =
    'Chán cái chi nhánh này... Ghé hana đc 2 lần rồi và lần này chọn pvt cho gần, 2 lần trc ăn ở mạc đĩnh chi quá tốt nên về đây có phần so sánh thế này 😳';
  const fullText = `Chán cái chi nhánh này...
Ghé hana đc 2 lần rồi và lần này chọn pvt cho gần, 2 lần trc ăn ở mạc đĩnh chi quá tốt nên về đây có phần so sánh thế này 😳
• Điểm trừ :
- ko biết là hana mới thay đổi cách lên món hay sao mà mới vào gọi các kiểu các món thì đc chị pv nói rằng các món chính bọn em mang lên hết , mình hỏi lại ko ăn hết thì sao, c ấy nói ko ăn hết thì chừa lại bọn e mang xuống , ok . Lúc sao mang lên một đống, ôi trời ơi , 2 dĩa thịt , mà bàn mình ăn mỗi bò phô mai, bò kim châm, còn nhiêu ko có nhu cầu , tất nhiên bỏ lại . Lúc đầu mang hết ra mà bàn mình thích ăn mực nên kêu thêm mực, c pv nói a/c vui lòng ăn bớt dùm e 🙂 , bàn đã đầy rồi mà còn mang ra 2 thố xà lách nữa, năn nỉ lắm mới chịu chỉ bỏ 1 thố lên bàn dùm thôi . Lát sau nhìn qua bàn bên thấy ng ta cũng bỏ lại 1 đống 😅
Không biết mấy cái mang thừa ra rồi mang vào lại hana để làm gì nhỉ ? Xếp gọn thịt lại rồi mang ra cho bàn khác hay bỏ hết đây? Đằng sau cuốn menu thấy hana nhắc khách ko làng phí thức ăn mà 😗
- Phục vụ chậm, chắc do ít quá, gọi vài lần đợi mãi, trong lúc đợi thì lôi mấy cái ko có nhu cầu ăn chừa lại ra nướng, ăn trong lúc chờ`;

  const images = [
    'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkeuvlhnmhef@resize_ss180x180',
    'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkeuvlhnmhef@resize_ss180x180',
    'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkeuvlhnmhef@resize_ss180x180',
    'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkeuvlhnmhef@resize_ss180x180',
    'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkeuvlhnmhef@resize_ss180x180',
  ];

  return (
    
    <div>
      <Header/>
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="sidebar-card">
            <div className="profile-section">
              <img
                src="https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss200x200"
                alt="Profile"
                className="profile-img"
              />
              <h5 className="profile-name">Hòa Huỳnh</h5>
            </div>
            <ul className="list-group">
              <li
                className={`list-group-item ${
                  activeSection === 'hoatdongcanhan' ? 'active' : ''
                }`}
                onClick={() => handleSectionChange('hoatdongcanhan')}
              >
                <a href="#" className="sidebar-link">
                  <span className="icon">
                    <i className="fas fa-user-circle"></i>
                  </span>{' '}
                  Hoạt động cá nhân
                </a>
              </li>
              <li
                className={`list-group-item ${
                  activeSection === 'hoatdong' ? 'active' : ''
                }`}
                onClick={() => handleSectionChange('hoatdong')}
              >
                <a href="#" className="sidebar-link">Hoạt động</a>
              </li>
              <li
                className={`list-group-item ${
                  activeSection === 'hinhanhvideo' ? 'active' : ''
                }`}
                onClick={() => handleSectionChange('hinhanhvideo')}
              >
                <a href="#" className="sidebar-link">Hình ảnh & Video</a>
              </li>
              <li
                className={`list-group-item ${
                  activeSection === 'banbe' ? 'active' : ''
                }`}
                onClick={() => handleSectionChange('banbe')}
              >
                <a href="#" className="sidebar-link">Bạn bè</a>
              </li>
              <li
                className={`list-group-item ${
                  activeSection === 'luutru' ? 'active' : ''
                }`}
                onClick={() => handleSectionChange('luutru')}
              >
                <a href="#" className="sidebar-link">
                  <span className="icon">
                    <i className="fas fa-archive"></i>
                  </span>{' '}
                  Lưu trữ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
       
          {activeSection === 'hoatdong' && (
                  <div className="col-md-9">
                  {/* Header */}
                  <div className="header d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h5 className="mb-0">11 Bình luận</h5>
                    <div className="d-flex align-items-center">
                      <div className="dropdown-wrapper me-2">
                        <select className="custom-dropdown">
                          <option>TP.HCM</option>
                          <option>Hà Nội</option>
                          <option>Đà Nẵng</option>
                        </select>
                      </div>
                      <div className="dropdown-wrapper me-2">
                        <select className="custom-dropdown">
                          <option>Bình luận</option>
                          <option>Đánh giá</option>
                          <option>Gợi ý</option>
                        </select>
                      </div>
                      <div className="dropdown-wrapper">
                        <select className="custom-dropdown">
                          <option>Mới nhất</option>
                          <option>Cũ nhất</option>
                          <option>Được thích nhất</option>
                        </select>
                      </div>
                    </div>
                  </div>
        
                  {/* Post Card */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Hòa Huỳnh</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Hana BBQ & Hot Pot Buffet - Phan Văn Trị
                      </h6>
                      <p className="card-text">
                        {isExpanded ? fullText : truncatedText}{' '}
                        <span
                          className="text-primary xem-them"
                          style={{ cursor: 'pointer' }}
                          onClick={toggleExpand}
                        >
                          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                        </span>
                      </p>
                    </div>
        
                    {/* Images */}
                    <div className="card-body image-grid">
                      {images.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Image ${index + 1}`}
                          className="thumbnail"
                        />
                      ))}
                    </div>
        
                    {/* Footer */}
                    <div className="card-footer text-muted">
                      <div className="icon-section d-flex align-items-center py-2">
                        <div className="icon-item me-3">
                          <i className="fas fa-heart"></i> Thích
                        </div>
                        <div className="icon-item me-3">
                          <i className="fas fa-comment-alt"></i> Thảo luận
                        </div>
                        <div className="icon-item">
                          <i className="fas fa-exclamation-triangle"></i> Báo lỗi
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
          )}
          {activeSection === 'hinhanhvideo' && (
            
              <ImagesAndVideosPage/>
        
          )}
          {activeSection === 'banbe' && (
            <Friends/>
          )}
          {activeSection === 'luutru' && (
          <Collection/>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Member;
