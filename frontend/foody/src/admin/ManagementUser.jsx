import React, { useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, email: "user1@example.com", role: "admin" },
    { id: 2, email: "user2@example.com", role: "user" },
  ]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddUser = () => {
    setShowModal(true);
    setEmail("");
    setRole("user");
    setEditId(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditUser = (id) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setEditId(id);
      setShowModal(true);
    }
  };

  const handleSaveUser = () => {
    if (editId) {
      // Update user
      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, email, role } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        email,
        role,
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setEmail("");
    setRole("user");
    setEditId(null);
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
      <div className="card p-4 shadow-sm">
        <h4 className="text-center mb-3">Users List</h4>
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditUser(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-muted">No users found.</p>
        )}
      </div>

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
                  {editId ? "Edit User" : "Add User"}
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
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
};

export default UserManagement;
