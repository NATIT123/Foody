import React from "react";

const Navbar = () => {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
      <a href="/" className="navbar-brand fw-bold text-primary">
        <i className="bi bi-speedometer2 me-2"></i>My Dashboard
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <div className="d-flex align-items-center ms-auto gap-3">
          {/* Tìm kiếm */}
          <form className="d-flex flex-grow-1 flex-lg-grow-0">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Search..."
              style={{ maxWidth: "300px" }}
            />
            <button
              className="btn btn-outline-primary rounded-pill ms-2"
              type="submit"
            >
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Thông báo */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary rounded-circle position-relative"
              type="button"
              id="notificationsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="notificationsDropdown"
            >
              <li>
                <h6 className="dropdown-header">Notifications</h6>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  You have 3 new messages
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Server rebooted
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  New user registered
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item text-center" href="#">
                  View all
                </a>
              </li>
            </ul>
          </div>

          {/* User */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary rounded-circle"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item text-danger" href="#">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
