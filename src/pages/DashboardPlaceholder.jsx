import { useAuth } from "../context/AuthContext";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";

// Temporary placeholder — real role-specific dashboards (Candidate, Student,
// Job Seeker, Recruiter) ship in Phase 2/3/4.
export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 gap-6 text-center">
      <Logo size="text-[22px]" />
      <h1 className="font-heading font-semibold text-3xl text-white">
        Welcome, {user?.name}
      </h1>
      <p className="text-[#c4c7c8] text-sm max-w-md">
        You're signed in as a <span className="text-white font-medium">{user?.role}</span>.
        The full dashboard (stats, recommended roles, skill readiness, etc.) ships in the
        next phase.
      </p>
      <Button variant="outline" onClick={logout}>
        Log Out
      </Button>
    </div>
  );
}
