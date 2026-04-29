// src/routes/AppRouter.tsx

import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home/Home";
import ResidentsPage from "@/pages/Residents/ResidentsPage";
import Announcements from "@/pages/Announcements/Announcements";
import LoginPage from "@/pages/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — all routes inside Layout require auth */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/residents"     element={<ResidentsPage />} />
          <Route path="/announcements" element={<Announcements />} />
          {/* Add more routes here as needed */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;