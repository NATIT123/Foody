import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DataProvider } from "./context/DataContext"; // import DataProvider

import Home from "./user/Home";
import LoginPage from "./user/Login";
import RegisterPage from "./user/RegisterPage";
import DetailPage from "./user/DetailPage";
import ForgotPasswordPage from "./user/ForgotPasswordPage";
import ProfilePage from "./user/ProfilePage";
import Member from "./user/Member";
import ChangePasswordPage from "./user/ChangePassword";
import Dashboard from "./admin/Dashboard";
import Order from "./components/Order";
import HistoryPage from "./components/HistoryPage";
import LayoutUser from "./components/LayoutUser/LayoutUser";
import NotFound from "./components/NotFound";

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
  { path: "/dashboard", element: <Dashboard /> },
]);

const App = () => {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
};

export default App;
