import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-light py-4">
      <div className="container">
        <div className="row">
          {/* Khám phá */}
          <div className="col-12 col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Khám phá</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Ứng dụng Mobile
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Tạo bộ sưu tập
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Quy định
                </a>
              </li>
            </ul>
          </div>

          {/* Công ty */}
          <div className="col-12 col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Công ty</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Việc làm
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Quy chế
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Thỏa thuận sử dụng dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Tham gia trên */}
          <div className="col-12 col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Tham gia trên</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Youtube
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  Google
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-dark">
                  ShopeeFood.vn - Giao đồ ăn tận nơi
                </a>
              </li>
            </ul>
          </div>

          {/* Giấy phép */}
          <div className="col-12 col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Giấy phép</h6>
            <p className="mb-1">
              MXH 363/GP-BTTTT
            </p>
            <img
  style={{ width: "100px" }} // Lưu ý: Dùng dấu hai chấm (:) thay vì dấu bằng (=)
  src="https://www.foody.vn/style/images/gov_seals.jpg"
  alt="Đã đăng ký Bộ Công Thương"
  className="img-fluid"
/>

          </div>
        </div>

        {/* Dòng bản quyền */}
       
      </div>
    </footer>
  );
};

export default Footer;
