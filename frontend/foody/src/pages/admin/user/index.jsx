import UserManagement from "../../../components/Admin/User/ManagementUser";

const ManageUserPage = ({ searchQuery }) => {
  return (
    <div className="manage-user-page">
      <UserManagement searchQuery={searchQuery} />
    </div>
  );
};

export default ManageUserPage;
