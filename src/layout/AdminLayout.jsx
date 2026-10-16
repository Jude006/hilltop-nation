import React from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";

const AdminLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminSideBar />
      <main className="flex-1 w-full lg:max-w-[calc(100vw-288px)] pt-20 lg:pt-0">
        {/* Page Content (SermonLibrary, etc.) goes here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
