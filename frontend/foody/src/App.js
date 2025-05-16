import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DataProvider } from "./context/DataContext"; // import DataProvider
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
import { useEffect } from "react";
import { callFetchAccount } from "./services/api";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
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
        element: (
          <ProtectedRoute>
            <ForgotPasswordPage />
          </ProtectedRoute>
        ),
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
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/changePassword/:resetToken", element: <ChangePasswordPage /> },
  {
    path: "/dashboard",
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
    } else {
      dispatch(doGetAccountAction({ data: {} }));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/book") ? (
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
