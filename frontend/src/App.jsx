import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage.jsx";
import LoginPage from "./components/pages/Login.jsx";
import SignupPage from "./components/pages/SignupPage.jsx";
import TrainerDashboard from "./components/pages/TrainerDashboard.jsx";
import CreatePlanPage from "./components/pages/CreatePlanPage.jsx";
import PlanDetails from "./components/pages/PlanDetails.jsx";
import UserFeedPage from "./components/pages/UserFeedPage.jsx";
import TrainersBrowsePage from "./components/pages/TrainersBrowsePage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/create-plan" element={<CreatePlanPage />} />
        <Route path="/plan/:id" element={<PlanDetails />} />
        <Route path="/feed" element={<UserFeedPage />} />
        <Route path="/trainers" element={<TrainersBrowsePage />} />
      </Routes>
    </Router>
  )
}

export default App;
