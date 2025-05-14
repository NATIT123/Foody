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
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutUser />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "details/:id", element: <DetailPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "member/:id", element: <Member /> },
      { path: "forgot", element: <ForgotPasswordPage /> },
      { path: "order", element: <Order /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/changePassword/:resetToken", element: <ChangePasswordPage /> },
  { path: "/dashboard", element: <AdminPage /> },
]);

const App = () => {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
};

export default App;
