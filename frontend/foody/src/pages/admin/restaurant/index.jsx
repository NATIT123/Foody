import RestaurantManagement from "../../../components/Admin/Restaurant/RestaurantManagements";

const ManageRestaurantPage = ({ searchQuery }) => {
  return (
    <div>
      <RestaurantManagement searchQuery={searchQuery} />
    </div>
  );
};

export default ManageRestaurantPage;
