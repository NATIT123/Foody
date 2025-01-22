import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class ProductSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          id: 1,
          title: "Phở Bò Hà Nội",
          subtitle: "Số 10, Đường Láng, Hà Nội",
          imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgecy7t793taa@resize_ss400x400",
          review: "Phở bò thơm ngon, nước dùng đậm đà.",
          rating: 4.5,
          commentCount: 12,
          likes: 150,
          userAvatar: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60",
          userName: "Nguyễn Văn A",
        },
        {
          id: 2,
          title: "Cơm gà",
          subtitle: "Số 5, Nguyễn Huệ, TP. Hồ Chí Minh",
          imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh0ggp4ai8p1d@resize_ss400x400",
          review: "Bánh mì giòn rụm, nhân đa dạng.",
          rating: 4.7,
          commentCount: 8,
          likes: 200,
          userAvatar: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60",
          userName: "Trần Văn B",
        },
        {
          id: 3,
          title: "Bánh Mì Thịt",
          subtitle: "Số 3, Đường CMT8, TP. Đà Nẵng",
          imgSrc: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh0ggp4ai8p1d@resize_ss400x400",
          review: "Bánh mì giòn tan, thịt tươi ngon.",
          rating: 4.8,
          commentCount: 20,
          likes: 300,
          userAvatar: "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8w1ku4l3vc7@resize_ss60x60",
          userName: "Lê Văn C",
        },
      ],
    };
  }

  render() {
    const { products } = this.state;

    return (
      <div className="container">
        <h3 className="text-center text-primary my-4">Gợi ý sản phẩm</h3>
        <div className=" col-md-9"></div>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.imgSrc}
                  alt={product.title}
                  className="card-img-top img-fluid"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">{product.title}</h5>
                  <p className="card-text text-muted mb-1">{product.subtitle}</p>
                  <p className="card-text">{product.review}</p>
                  <div className="d-flex align-items-center gap-3 mt-3">
                    <span className="badge bg-warning text-dark">Rating: {product.rating}</span>
                    <span className="badge bg-info text-dark">Comments: {product.commentCount}</span>
                    <span className="badge bg-success">Likes: {product.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductSuggestion;