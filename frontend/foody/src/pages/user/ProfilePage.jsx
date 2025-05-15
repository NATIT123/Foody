import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  callUpdateAvatar,
  callUpdatePassword,
  callUpdateUserInfo,
} from "../../services/api";
import {
  doLogoutAction,
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../redux/account/accountSlice";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.account.user);
  const isLoading = useAppSelector((state) => state.account.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const tempPhoto = useAppSelector((state) => state.account.tempPhoto);
  const [imageUrl, setImageUrl] = useState(tempPhoto || user?.photo);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // For password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    document.title = "Thông tin cá nhân";
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setName(user.fullname);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const onFinish = async () => {
    const isChangingPassword =
      currentPassword || newPassword || confirmPassword;

    if (isChangingPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Password confirmation does not match.");
        return;
      }
    }

    try {
      // Gọi API cập nhật thông tin và đổi mật khẩu nếu cần
      const promises = [callUpdateUserInfo(phone, name, user.photo)];

      if (isChangingPassword) {
        promises.push(
          callUpdatePassword(user.email, currentPassword, newPassword)
        );
      }

      const [resUserInfo, resPassword] = await Promise.all(promises);

      if (resUserInfo && resUserInfo.data) {
        console.log(resUserInfo);
        dispatch(
          doUpdateUserInfoAction({
            photo: user.photo,
            phone,
            name,
          })
        );
        localStorage.removeItem("access_token");
        navigate("/login");
        toast.success("Update user info successfully");
      }

      if (resPassword && resPassword.data) {
        toast.success("Update password successfully. Please log in again.");
        dispatch(doLogoutAction());
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error when updating user info.");
    }
  };

  const handleUploadAvatar = async (file) => {
    if (!file) {
      toast.error("Please choose image to update.");
      return;
    }
    const res = await callUpdateAvatar(file);
    if (res && res.data) {
      const newAvatar = res.data.photo;
      dispatch(doUploadAvatarAction({ photo: newAvatar }));
      setImageUrl(newAvatar);
      setProfilePic("");
      toast.success("Upload photo successfully");
    } else {
      toast.error("Upload photo failed");
    }
  };

  return (
    <div>
      {/* <Header
        selectedSubCategories={selectedSubCategories}
        setSelectedSubCategories={setSelectedSubCategories}
        selectedCuisines={selectedCuisines}
        setSelectedCuisines={setSelectedCuisines}
        selectedDistricts={selectedDistricts}
        setSelectedDistricts={setSelectedDistricts}
      /> */}
      <div className="container mt-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="list-group">
              <button className="list-group-item list-group-item-action active">
                <i className="bi bi-person-fill me-2"></i>Cập nhật tài khoản
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="col-md-9 mb-2">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">Thông tin người dùng</h5>
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Tải Ảnh đại diện</label>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        imageUrl === "default.jpg"
                          ? "/images/default.jpg"
                          : imageUrl
                      }
                      alt="Profile"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#6c757d",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        marginRight: "15px",
                      }}
                    ></img>
                    <div>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                      <small className="text-muted">
                        Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5MB.
                      </small>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => handleUploadAvatar(profilePic)}
                  >
                    Cập nhật
                  </button>
                </div>

                <hr />

                {/* User Information */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name && name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email && user.email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Mật khẩu</label>
                  {!showPasswordFields ? (
                    <>
                      <input
                        type="password"
                        className="form-control"
                        value="********"
                        disabled
                      />
                      <button
                        style={{ fontWeight: "bold" }}
                        className="btn btn-link"
                        onClick={() => setShowPasswordFields(true)}
                      >
                        Đổi mật khẩu
                      </button>
                    </>
                  ) : (
                    <div>
                      <label className="form-label">
                        Nhập mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <label className="form-label">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <label className="form-label">
                        Nhập lại mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <button className="btn btn-primary" onClick={onFinish}>
                  Lưu thay đổi
                </button>

                <hr />

                {/* Phone Number Management */}
                <div className="mb-3">
                  <h6 className="fw-bold">Quản lý số điện thoại</h6>

                  <input
                    type="email"
                    className="form-control"
                    value={user.phone && user.phone}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
