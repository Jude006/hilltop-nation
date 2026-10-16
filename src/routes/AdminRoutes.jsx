import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes"; // Import our updated protector
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SermonLibrary from "../pages/admin/SermonLibrary";
import Membership from "../pages/admin/Membership";
import StewardManagement from "../pages/admin/StewardManagement";
import MediaAssets from "../pages/admin/MediaAssets";
import Communications from "../pages/admin/Communications";
import CallCenter from "../pages/admin/CallCenter";
import FlierGenerator from "../pages/admin/FlierGenerator";
import UpComingPrograms from "../pages/admin/UpComingPrograms";
import Broadcast from "../pages/admin/Broadcast";
import WhatsappStatus from "../components/admin/WhatsappStatus";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* DASHBOARD: Accessible by both Admin and any Steward */}
        <Route
          element={<ProtectedRoutes allowedRoles={["Admin", "Steward"]} />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* SERMONS: Permission "Sermons" */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Sermons"
            />
          }
        >
          <Route path="sermons" element={<SermonLibrary />} />
        </Route>

        {/* MEMBERSHIP: Permission "Membership" */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Membership"
            />
          }
        >
          <Route path="members" element={<Membership />} />
        </Route>

        {/* MEDIA: Permission "Media Assets" */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Media Assets"
            />
          }
        >
          <Route path="media-assets" element={<MediaAssets />} />
        </Route>

        {/* COMMUNICATIONS: Permission "Communications" */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Communications"
            />
          }
        >
          <Route path="communications" element={<Communications />} />
        </Route>

        {/* STEWARD MANAGEMENT: ONLY the Admin can see this */}
        <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
          <Route path="create-worker" element={<StewardManagement />} />
        </Route>

        {/* CALL CENTER: Permission "Communications" (shared) */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Communications"
            />
          }
        >
          <Route path="call-center" element={<CallCenter />} />
        </Route>

        {/* FLIER GENERATOR */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Membership"
            />
          }
        >
          <Route path="flier-generator" element={<FlierGenerator />} />
        </Route>

        {/* UPCOMING PROGRAMS */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Membership"
            />
          }
        >
          <Route path="upcoming-programs" element={<UpComingPrograms />} />
        </Route>

        {/* BROADCAST */}
        <Route
          element={
            <ProtectedRoutes
              allowedRoles={["Admin", "Steward"]}
              requiredPermission="Membership"
            />
          }
        >
          <Route path="broadcast" element={<Broadcast />} />
        </Route>
        <Route path="whatsapp-status" element={<WhatsappStatus />} />

        <Route path="*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
