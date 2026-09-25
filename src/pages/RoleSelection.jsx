import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, GraduationCap, Briefcase, Users, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlowCard from "../components/ui/GlowCard";
import Button from "../components/ui/Button";
import { submitToSheet } from "../lib/sheetsApi";

const roles = [
  {
    id: "candidate",
    title: "Candidate",
    description: "Build your professional profile and discover roles that fit.",
    icon: UserRound,
    glow: "pink",
  },
  {
    id: "student",
    title: "Student",
    description: "Explore careers, internships and skills for your future.",
    icon: GraduationCap,
    glow: "cyan",
  },
  {
    id: "jobseeker",
    title: "Job Seeker",
    description: "Find relevant jobs and understand your match.",
    icon: Briefcase,
    glow: "purple",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Find and evaluate candidates with explainable AI.",
    icon: Users,
    glow: "pink",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user, setRole } = useAuth();
  const [pendingRole, setPendingRole] = useState(null);
  const [error, setError] = useState("");

  const choose = async (roleId) => {
    setError("");
    setPendingRole(roleId);

    // Best-effort submission — registration record is only complete once
    // a role is chosen, so this is where we write it to Sheets.
    const result = await submitToSheet("registration", {
      name: user?.name || "",
      email: user?.email || "",
      role: roleId,
    });

    if (!result.ok) {
      // Don't block the user's flow on a Sheets hiccup — just surface it.
      setError("Something went wrong saving your info. You can continue anyway.");
    }

    setRole(roleId);
    setPendingRole(null);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[1232px] flex flex-col gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-[48px] text-white tracking-tight">
            How will you use Resume → Role?
          </h1>
          <p className="max-w-[672px] text-lg leading-7 text-[#c4c7c8]">
            Choose the path that fits you best. You can always update this later from your
            profile settings.
          </p>
          {error && <p className="text-sm text-amber-400">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const isPending = pendingRole === role.id;
            return (
              <GlowCard
                key={role.id}
                glow={role.glow}
                rounded="rounded-[32px]"
                className="p-8 flex flex-col gap-8"
              >
                <div className="flex flex-col gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <role.icon size={22} className="text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-heading font-semibold text-3xl text-white">{role.title}</h2>
                    <p className="text-[#c4c7c8] text-base leading-6">{role.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={pendingRole !== null}
                  onClick={() => choose(role.id)}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
