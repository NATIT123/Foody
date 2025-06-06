import { useAppSelector } from "../../redux/hooks";
const Sidebar = ({ setActiveTab }) => {
  const user = useAppSelector((state) => state.account.user);
  return (
    <>
      {/* Sidebar cố định trên màn hình lớn */}
      <div
        className="d-none d-lg-flex flex-column vh-100 p-3 bg-white shadow"
        style={{ width: "250px", borderRight: "1px solid #ddd" }}
      >
        {/* Navigation Links */}
        <ul className="nav flex-column mb-auto">
          {user?.role === "admin" && (
            <li className="nav-item">
              <button
                onClick={() => setActiveTab("dashboard")}
                className="btn nav-link text-dark d-flex align-items-center w-100"
              >
                <i className="bi bi-grid-fill me-2 text-primary"></i>
                <span>Dashboard</span>
              </button>
            </li>
          )}
          {user?.role === "admin" && (
            <li className="nav-item">
              <button
                onClick={() => setActiveTab("Quản lí người dùng")}
                className="btn nav-link text-dark d-flex align-items-center w-100"
              >
                <i className="bi bi-people-fill me-2 text-primary"></i>
                <span>Quản lí người dùng</span>
              </button>
            </li>
          )}
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("Quản lí nhà hàng")}
              className="btn nav-link text-dark d-flex align-items-center w-100"
            >
              {/* Thay đổi icon ở đây */}
              <i className="bi bi-shop me-2 text-success"></i>
              <span>Quản lí nhà hàng</span>
            </button>
          </li>
          {user?.role === "admin" && (
            <li className="nav-item">
              <button
                onClick={() => setActiveTab("Xét duyệt nhà hàng")}
                className="btn nav-link text-dark d-flex align-items-center w-100"
              >
                {/* Thay đổi icon ở đây */}
                <i className="bi bi-check2-circle me-2 text-danger"></i>
                <span>Xét duyệt nhà hàng</span>
              </button>
            </li>
          )}
          {user?.role === "admin" && (
            <li className="nav-item">
              <button
                onClick={() => setActiveTab("Xét duyệt đơn hàng")}
                className="btn nav-link text-dark d-flex align-items-center w-100"
              >
                {/* Thay đổi icon ở đây */}
                <i className="bi bi-cart-check-fill me-2 text-danger"></i>
                <span>Xét duyệt đơn hàng</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Sidebar cho màn hình nhỏ */}
      <div className="d-lg-none">
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
        >
          <i className="bi bi-list"></i> Menu
        </button>
        <div
          className="offcanvas offcanvas-start"
          id="sidebarOffcanvas"
          tabIndex="-1"
          aria-labelledby="sidebarOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <h5 id="sidebarOffcanvasLabel" className="fw-bold text-primary">
              Creative Tim
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav flex-column mb-auto">
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="btn nav-link text-dark d-flex align-items-center w-100"
                >
                  <i className="bi bi-grid-fill me-2 text-primary"></i>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("Quản lí người dùng")}
                  className="btn nav-link text-dark d-flex align-items-center w-100"
                >
                  <i className="bi bi-table me-2 text-secondary"></i>
                  <span>Quản lí người dùng</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("Quản lí nhà hàng")}
                  className="btn nav-link text-dark d-flex align-items-center w-100"
                >
                  <i className="bi bi-bell-fill me-2 text-secondary"></i>
                  <span>Quản lí nhà hàng</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab("Xét duyệt nhà hàng")}
                  className="btn nav-link text-dark d-flex align-items-center w-100"
                >
                  {/* Thay đổi icon ở đây */}
                  <i className="bi bi-check2-circle me-2 text-danger"></i>
                  <span>Xét duyệt nhà hàng</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
