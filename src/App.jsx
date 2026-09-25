import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/candidate/Login.jsx";
import Auth from "./pages/auth/Auth.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import OnboardingPlaceholder from "./pages/onboarding/OnboardingPlaceholder.jsx";

import CandidateDashboard from "./pages/candidate/CandidateDashboard.jsx";
import ResumeManager from "./pages/candidate/ResumeManager.jsx";
import ResumeAnalysis from "./pages/candidate/ResumeAnalysis.jsx";
import RoleMatches from "./pages/candidate/RoleMatches.jsx";
import SkillLab from "./pages/candidate/SkillLab.jsx";
import Applications from "./pages/candidate/Applications.jsx";
import Profile from "./pages/candidate/Profile.jsx";
import MatchEngine from "./pages/candidate/MatchEngine.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";

import CandidateLayout from "./components/layout/CandidateLayout.jsx";
import RecruiterLayout from "./components/layout/RecruiterLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import RecruiterProtectedRoute from "./components/auth/RecruiterProtectedRoute.jsx";

import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import RecruiterJobsList from "./pages/RecruiterJobsList.jsx";
import RecruiterJobsNew from "./pages/RecruiterJobsNew.jsx";
import RecruiterJobApplicants from "./pages/RecruiterJobApplicantsNew.jsx";
import RecruiterCandidateDetails from "./pages/RecruiterCandidateDetails.jsx";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("careerEngineUser") || "null");
  } catch {
    return null;
  }
}

function RoleDashboardRedirect() {
  const token = localStorage.getItem("careerEngineToken");
  const user = getUser();

  if (!token || !user?.role) return <Navigate to="/auth" replace />;
  if (user.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />;
  if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route
          path="/role-selection"
          element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPlaceholder />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<RoleDashboardRedirect />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/resume" element={<ResumeManager />} />
          <Route path="/resume-analysis/:resumeId" element={<ResumeAnalysis />} />
          <Route path="/resume-analysis" element={<Navigate to="/resume" replace />} />
          <Route path="/role-matches/:resumeId" element={<RoleMatches />} />
          <Route path="/role-matches" element={<Navigate to="/resume" replace />} />
          <Route path="/skill-lab" element={<SkillLab />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/candidate/match-engine" element={<MatchEngine />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Route>

        {/* Canonical candidate dashboard stays /dashboard; redirect into the candidate layout. */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Navigate to="/dashboard/candidate" replace />
            </ProtectedRoute>
          }
        />
        <Route path="/candidate" element={<Navigate to="/dashboard" replace />} />

        <Route
          element={
            <RecruiterProtectedRoute>
              <RecruiterLayout />
            </RecruiterProtectedRoute>
          }
        >
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsList />} />
          <Route path="/recruiter/jobs/new" element={<RecruiterJobsNew />} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterJobApplicants />} />
          <Route path="/recruiter/candidates/:candidateId" element={<RecruiterCandidateDetails />} />
        </Route>

        <Route path="*" element={<RoleDashboardRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
