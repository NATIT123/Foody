import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom"; // For navigation
import { debounce } from "lodash";
const UserManagement = ({ searchQuery }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // For navigation to the home page
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [fullname, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("user");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { state, addNotification } = useData();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery && state.user.role === "admin") {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/user/findUsersByFields?page=${currentPage}&searchQuery=${debouncedSearchQuery}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data?.data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setTotalPages(data.totalPages);
              setUsers(data.data.data);
            }
          } else if (data.status === 401 || data.status === 403) {
            navigate("/"); // Chỉ navigate nếu lỗi xác thực
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [debouncedSearchQuery, currentPage]);

  useEffect(() => {
    if (!state.accessToken) return;
    if (state.user?.role !== "admin") return;
    fetch(
      `${process.env.REACT_APP_BASE_URL}/user/getAllUsers?page=${currentPage}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${state.accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            setTotalPages(data.totalPages);
            setUsers(data.data.data);
          }
        } else if (data.status === 401 || data.status === 403) {
          navigate("/"); // Chỉ navigate nếu lỗi xác thực
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [state.accessToken, currentPage]); // Loại bỏ `navigate` khỏi dependency nếu không cần thiết

  const handleAddUser = () => {
    setShowModal(true);
    setEmail("");
    setAddress("");
    setFullName("");
    setAddress("");
    setPhone("");
    setRole("user");
    setEditId("Add");
  };

  const handleDeleteUser = (id) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      setId(user._id);
      setFullName(user.fullname);
      setShowModalDelete(true);
    }
  };

  const deleteUser = () => {
    if (!state.accessToken) return;
    fetch(`${process.env.REACT_APP_BASE_URL}/user/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (
            data.status !== "fail" &&
            data.status !== "error" &&
            data.status !== 400
          ) {
            setUsers(users.filter((user) => user._id !== id));
            addNotification(`Delete user ${fullname} successfully`);
            console.log("Delete Success");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setShowModalDelete(false);
  };

  const handleEditUser = (id) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      setPhoto(user.photo);
      setId(user._id);
      setFullName(user.fullname);
      setPhone(user.phone);
      setAddress(user.address);
      setEmail(user.email);
      setRole(user.role);
      setEditId("Edit");
      setShowModal(true);
    }
  };

  const handleSaveUser = () => {
    if (editId === "Edit") {
      // Update user
      if (!email || !address || !phone || !fullname || !role) {
        console.log("Please fill input");
        return;
      }
      // Add new user
      const newUser = {
        _id: id,
        email,
        address,
        phone,
        fullname,
        photo,
        role,
      };
      if (!state.accessToken) return;
      fetch(`${process.env.REACT_APP_BASE_URL}/user/updateUser/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              setUsers(
                users.map((user) => (user._id === id ? { ...newUser } : user))
              );
              addNotification(`Update user ${fullname} successfully`);
              console.log("Update Success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!email || !address || !phone || !fullname || !role) {
        console.log("Please fill input");
        return;
      }
      // Add new user
      const newUser = {
        photo: "default.jpg",
        email,
        address,
        phone,
        fullname,
        password: "Password123",
        confirmPassword: "Password123",
        role,
      };
      if (!state.accessToken) return;
      fetch(`${process.env.REACT_APP_BASE_URL}/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (
              data.status !== "fail" &&
              data.status !== "error" &&
              data.status !== 400
            ) {
              newUser["_id"] = data.data.data;
              setUsers([newUser, ...users]);
              addNotification(`Add user ${fullname} successfully`);
              console.log("Add Success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setShowModal(false);
    setRole("user");
    setEditId("Add");
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };
  const renderPagination = () => {
    if (totalPages <= 1) return null; // Ẩn nếu chỉ có 1 trang

    return (
      <nav>
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => changePage(currentPage - 1)}
            >
              &laquo; Trước
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i + 1}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => changePage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => changePage(currentPage + 1)}
            >
              Sau &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mt-2">
      <h2 className=" text-center">User Management</h2>

      {/* Nút thêm người dùng */}
      <div className="mb-3 text-end">
        <button className="btn btn-primary" onClick={handleAddUser}>
          Add User
        </button>
      </div>

      {/* Danh sách người dùng */}
      <div className="card p-4 shadow-sm h-100 d-flex flex-column">
        <h4 className="text-center mb-3">Users List</h4>
        <div className="table-responsive flex-grow-1 overflow-auto">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Email</th>
                <th>FullName</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="d-flex align-items-center">
                      <img
                        src={
                          user.photo === "default.jpg"
                            ? "/images/default.jpg"
                            : user.photo
                        }
                        alt="Profile"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                        onError={(e) => (e.target.src = "/images/default.jpg")} // Nếu ảnh lỗi, hiển thị ảnh mặc định
                      />
                      {user.email}
                    </td>
                    <td>{user.fullname}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditUser(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-center text-muted">No users found.</p>
        )}
      </div>
      {users && users.length > 0 && renderPagination()}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId === "Edit" ? "Edit User" : "Add User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={editId === "Edit" ? true : false}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">FullName</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    disabled={editId === "Edit" ? true : false}
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveUser}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalDelete && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModalDelete(false)}
                ></button>
              </div>
              <div class="modal-body">
                <p>{`Do you want to delete ${fullname}`} </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModalDelete(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteUser}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
