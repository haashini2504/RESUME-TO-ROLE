import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";

// Temporary placeholder — the full multi-step wizard (Personal Info, Education,
// Experience, Skills, Resume Upload, Career Preferences) ships in Phase 2.
export default function OnboardingPlaceholder() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const finish = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <Logo size="text-[22px]" />
        <h1 className="font-heading font-semibold text-2xl text-white">
          Onboarding — {user?.role}
        </h1>
        <p className="text-[#c4c7c8] text-sm">
          The full onboarding wizard (Personal Info → Education → Experience → Skills →
          Resume Upload → Career Preferences) is coming in Phase 2. For now, continue to
          preview the dashboard.
        </p>
        <Button onClick={finish}>Skip to Dashboard</Button>
      </div>
    </div>
  );
}
