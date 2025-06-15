import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import DetailPage from "./pages/user/DetailPage";
import ProfilePage from "./pages/user/ProfilePage";
import Member from "./pages/user/Member";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/RegisterPage";
import ChangePasswordPage from "./pages/user/ChangePassword";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import Order from "./pages/order/Order";
import HistoryPage from "./pages/history/HistoryPage";
import LayoutUser from "./components/LayoutUser/LayoutUser";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import PaymentResult from "./pages/order/PaymentResult";
import LoginSuccess from "./pages/login/LoginSuccess";
import { useEffect } from "react";
import { callFetchAccount } from "./services/api";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import RevenueDashboard from "./components/Admin/Restaurant/RevenueDashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutUser />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "details/:id", element: <DetailPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "member/:id",
        element: (
          <ProtectedRoute>
            <Member />
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot",
        element: <ForgotPasswordPage />,
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/revenue-dashboard", element: <RevenueDashboard /> },
  { path: "/login-success", element: <LoginSuccess /> },
  { path: "/payment-result", element: <PaymentResult /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/changePassword/:resetToken", element: <ChangePasswordPage /> },
  {
    path: "/admin",
    index: true,
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    future: {
      v7_startTransition: true,
    },
  },
]);

const App = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    if (localStorage.getItem("access_token")) {
      const res = await callFetchAccount();
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data));
      }
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  return (
    <>
      {window.location.pathname === "/revenue-dashboard" ||
      isLoading === false ||
      window.location.pathname === "/forgot" ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/login-success" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/details") ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
