import React, { useEffect } from "react";

export default function LogOut() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);
  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}
