import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";
import AIInterviewRoom from "./pages/AIInterviewRoom";
import AICodingInterviewRoom from "./pages/AICodingInterviewRoom";
import InterviewReviewPage from "./pages/InterviewReviewPage";
import ProctoringDashboard from "./components/Proctoring/ProctoringDashboard";

// Public pages (no login required)
import CandidateEntryPage from "./pages/CandidateEntryPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />


        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id/monitor" element={isSignedIn ? (
          <div className="h-screen bg-gray-950 p-6">
            <ProctoringDashboard />
          </div>
        ) : <Navigate to={"/"} />} />
        <Route path="/ai-interview/:id" element={<AIInterviewRoom />} />
        <Route path="/ai-coding-interview/:id" element={<AICodingInterviewRoom />} />
        <Route path="/ai-interview/:id/review" element={isSignedIn ? <InterviewReviewPage /> : <Navigate to={"/"} />} />

        {/* Public Candidate Routes — No Login Required */}
        <Route path="/interview/join" element={<CandidateEntryPage />} />
        <Route path="/interview/:sessionId/upload" element={<ResumeUploadPage />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
