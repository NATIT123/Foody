import OrderApproval from "../../../components/Admin/Order/OrderApproval";

const ManageOrderPage = ({ searchQuery }) => {
  return (
    <div>
      <OrderApproval searchQuery={searchQuery} />
    </div>
  );
};

export default ManageOrderPage;
