import React from "react";
import NavBar from "./componant/Pages/NavBar/NavBar";
import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicNavBar from "./componant/Pages/PublicNavBar/PublicNavBar";

export default function App() {
  return (
    <>
      {localStorage.getItem("token") ? <NavBar /> : <PublicNavBar />}

      {/* {localStorage.getItem("token") ? <></> : <Outlet />} */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
