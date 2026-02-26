import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home/Home";
import ResidentsPage from "@/pages/Residents/ResidentsPage";
import Announcements from "@/pages/Announcements/Announcements";
import GateAccessPage from "@/pages/GateAccess/GateAccessPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/gate-access" element={<GateAccessPage />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
};

export default AppRouter;
