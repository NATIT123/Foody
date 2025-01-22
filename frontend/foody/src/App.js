import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./user/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./user/Login";
import RegisterPage from "./user/RegisterPage";
import DetailPage from "./user/DetailPage";
import ForgotPasswordPage from "./user/ForgotPasswordPage";
import OrderHistory from "./user/OrderHistory";
import ProfilePage from "./user/ProfilePage";
import Member from "./user/Member";
// import Dashboard from "./admin/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/member" element={<Member />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
