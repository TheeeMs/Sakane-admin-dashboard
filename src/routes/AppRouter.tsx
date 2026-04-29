import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home/Home";
import ResidentsPage from "@/pages/Residents/ResidentsPage";
import Announcements from "@/pages/Announcements/Announcements";
import MissingFound from "@/pages/MissingFound/MissingFound";
import GateAccessPage from "@/pages/GateAccess/GateAccessPage";
import { EventsPage } from "@/pages/Events/EventsPage";
import { FeedbackPage } from "@/pages/Feedback/FeedbackPage";
import { EmployeesPage } from "@/pages/Employees/EmployeesPage";
import MaintenancePage from "@/pages/Maintenance/MaintenancePage";
import LoginPage from "@/pages/Auth/LoginPage";
import RequireAdminRoute from "./guards/RequireAdminRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAdminRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/missing-found" element={<MissingFound />} />
          <Route path="/gate-access" element={<GateAccessPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
