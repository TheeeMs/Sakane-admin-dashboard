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
import Settings from "@/pages/Settings/Settings";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/missing-found" element={<MissingFound />} />
        <Route path="/gate-access" element={<GateAccessPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;