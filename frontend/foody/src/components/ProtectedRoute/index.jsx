import { useAppSelector } from "../../redux/hooks";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useAppSelector((state) => state.account.user);
  const userRole = user.role;

  if (
    (isAdminRoute && userRole === "admin") ||
    (!isAdminRoute && (userRole === "user" || userRole === "admin"))
  ) {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedRoute = (props) => {
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  return (
    <>
      {isAuthenticated === true ? (
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;
