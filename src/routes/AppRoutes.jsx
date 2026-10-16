import React from "react";
import { Routes, Route } from "react-router-dom";
import Sermon from "../pages/Sermon";
import Home from "../pages/Home";
import About from "../pages/About";
import Donation from "../pages/Donation";
import AppLayout from "../layout/AppLayout";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import WorkerDashboard from "../pages/user/WorkerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRoutes from "./AdminRoutes";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Gallery from "../pages/Gallery";
import SermonDetails from "../pages/SermonDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sermon" element={<Sermon />} />
        <Route path="/sermon/:id" element={<SermonDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/donation" element={<Donation />} />
      </Route>

      {/* AUTH */}
      <Route path="/HTN-gate/login" element={<Login />} />
      <Route path="/HTN-gate/forgot-password" element={<ForgotPassword />} />
      <Route path="/HTN-gate/reset-password" element={<ResetPassword />} />

      {/* WORKER ROUTES */}
      <Route element={<ProtectedRoutes allowedRoles={["worker", "admin"]} />}>
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoutes allowedRoles={["admin", "steward"]} />}>
        {/* Even though the path says 'HTN-admin', Stewards will now be 
      allowed in. The Sidebar will hide the things they can't touch.
  */}
        <Route path="/HTN-admin/*" element={<AdminRoutes />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
