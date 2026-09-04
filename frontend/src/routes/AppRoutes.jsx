import { Routes, Route } from "react-router-dom";

import Register from "../pages/admin/auth/Register";
import Login from "../pages/admin/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Complaints from "../pages/admin/Complaints";
import Users from "../pages/admin/Users";
import ComplaintDetails from "../pages/admin/ComplaintDetails";
import UserDashboard from "../pages/user/UserDashboard";
import CreateComplaint from "../pages/user/CreateComplaint";
import MyComplaints from "../pages/user/MyComplaints";
import UserProfile from "../pages/user/UserProfile";
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffProfile from "../pages/staff/StaffProfile";
import AssignedComplaints from "../pages/staff/AssignedComplaints";
import Notifications from "../pages/user/Notifications";
import Settings from "../pages/user/Settings";
import AdminSettings from "../pages/admin/Settings";
import StaffSettings from "../pages/staff/Settings";
import AdminNotifications from "../pages/admin/Notifications";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register/>} />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path='/admin/complaints'
        element={<Complaints />}
      />


      <Route
       path='/admin/complaints/:id'
       element={<ComplaintDetails/>}
      />

      <Route
      path='/admin/users'
      element={<Users/>}
      />


      <Route
      path="/user/dashboard"
      element={<UserDashboard />}
      />

      <Route
      path="/user/create-complaint"
      element={<CreateComplaint />}
      />

      <Route
      path="/user/my-complaints"
      element={<MyComplaints />}
      />

      <Route
      path="/user/profile"
      element={<UserProfile />}
      />

      <Route
      path="/user/settings"
      element={<Settings />}
      />

      <Route
      path="/staff/dashboard"
      element={<StaffDashboard/>}
      />

      <Route
      path="/user/notifications"
      element={<Notifications />}
      />

      <Route
      path="/staff/profile"
      element={<StaffProfile/>}
      />

      <Route
      path="/staff/assigned-complaints"
      element={<AssignedComplaints />}
      />

      
      <Route
      path="/admin/settings"
      element={<AdminSettings />}
      />

      <Route
      path="/staff/settings"
      element={<StaffSettings />}
      />
      
      <Route
      path="/admin/notifications"
      element={<AdminNotifications />}
      />
      

    </Routes>

  );
};

export default AppRoutes;