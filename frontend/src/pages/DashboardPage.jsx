import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import InterviewerDashboard from "../components/InterviewerDashboard";
import CreateAIInterviewModal from "../components/CreateAIInterviewModal";

function DashboardPage() {
  const { user } = useUser();
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedType, setSelectedType] = useState("qa");

  // Still fetching these for the StatsCards summary
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const handleStartQA = () => {
    setSelectedType("qa");
    setShowAIModal(true);
  };

  const handleStartCoding = () => {
    setSelectedType("coding");
    setShowAIModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection
          onStartQA={handleStartQA}
          onStartCoding={handleStartCoding}
        />

        <div className="container mx-auto px-6 py-6 pb-20 space-y-8">
          {/* Dashboard Header - Simplified Stats */}
          <div className="w-full">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
          </div>

          {/* Main Candidate Pipeline / Interview List */}
          <div className="bg-base-100/30 rounded-3xl p-8 border border-base-content/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
             <InterviewerDashboard />
          </div>
        </div>
      </div>

      <CreateAIInterviewModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        initialType={selectedType}
      />
    </>
  );
}

export default DashboardPage;
