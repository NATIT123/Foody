import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataProvider } from "./context/DataContext";
import Home from "./user/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./user/Login";
import RegisterPage from "./user/RegisterPage";
import DetailPage from "./user/DetailPage";
import ForgotPasswordPage from "./user/ForgotPasswordPage";
import OrderHistory from "./user/OrderHistory";
import ProfilePage from "./user/ProfilePage";
import Member from "./user/Member";
import ChangePasswordPage from "./user/ChangePassword";
import Dashboard from "./admin/Dashboard";
// import Dashboard from "./admin/Dashboard";

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/details/:id" element={<DetailPage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/member/:id" element={<Member />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/changePassword/:resetToken"
            element={<ChangePasswordPage />}
          />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
