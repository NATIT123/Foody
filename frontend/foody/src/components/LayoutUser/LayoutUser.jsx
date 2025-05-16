import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useState } from "react";

const LayoutUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutUser;
