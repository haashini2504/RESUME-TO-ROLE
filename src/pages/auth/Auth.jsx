import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ArrowRight, GraduationCap, UserRound, Users } from "lucide-react";
import Logo from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../lib/config";
import { submitToSheet } from "../../lib/sheetsApi";

const ROLES = [
  { id: "candidate", label: "Candidate", icon: UserRound, description: "Jobs, resume analysis and role matches" },
  { id: "student", label: "Student", icon: GraduationCap, description: "Skills, internships and career planning" },
  { id: "recruiter", label: "Recruiter", icon: Users, description: "Jobs, applicants and candidate matching" },
];

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(location.pathname === "/register" ? "register" : "login");
  const [selectedRole, setSelectedRole] = useState(
    localStorage.getItem("careerEngineSelectedRole") || "candidate"
  );
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(location.pathname === "/register" ? "register" : "login");
  }, [location.pathname]);

  const currentRole = ROLES.find((role) => role.id === selectedRole) || ROLES[0];

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setError("");
  };

  const chooseRole = (role) => {
    setSelectedRole(role);
    localStorage.setItem("careerEngineSelectedRole", role);
    setShowRolePicker(false);
    setError("");
  };

  const goToDashboard = (role) => {
    if (role === "recruiter") return navigate("/recruiter/dashboard", { replace: true });
    if (role === "student") return navigate("/student/dashboard", { replace: true });
    return navigate("/dashboard", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register") {
      if (!name) return setError("Please enter your name.");
      if (password.length < 6) return setError("Password must contain at least 6 characters.");
      if (password !== form.confirmPassword) return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      if (mode === "register") {
        await register({ name, email, password, role: selectedRole });

        // Keep the role in Sheets as requested by the original role-selection flow.
        await submitToSheet("registration", { name, email, role: selectedRole });

        setForm({ name: "", email, password: "", confirmPassword: "" });
        setMode("login");
        navigate("/auth", { replace: true });
        setError("Account created successfully. Please sign in.");
        return;
      }

      const data = await login({ email, password, role: selectedRole });
      localStorage.setItem("careerEngineSelectedRole", data.user.role);
      goToDashboard(data.user.role);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err?.message || `Unable to reach the backend at ${API_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setMode((current) => (current === "login" ? "register" : "login"));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "radial-gradient(ellipse 500px 400px at 50% 20%, rgba(168,85,247,0.08), transparent 60%)" }} />

      <div className="relative w-full max-w-[448px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="text-[26px]" />
          <p className="text-sm text-[#c4c7c8]">{mode === "login" ? "Welcome back" : "Create your Career Engine account"}</p>

          <button
            type="button"
            onClick={() => setShowRolePicker((value) => !value)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4e4fa] hover:text-white"
          >
            Continue as {currentRole.label}
            <span className="underline">{showRolePicker ? "Close" : "Change role"}</span>
          </button>

          {showRolePicker && (
            <div className="w-full rounded-2xl border border-white/10 bg-[#111111] p-3 text-left shadow-2xl">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const active = role.id === selectedRole;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => chooseRole(role.id)}
                    className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left last:mb-0 ${active ? "border-[#d4e4fa]/50 bg-white/10" : "border-white/5 hover:bg-white/5"}`}
                  >
                    <Icon size={18} className="text-[#d4e4fa]" />
                    <span>
                      <span className="block text-sm font-semibold text-white">{role.label}</span>
                      <span className="block text-xs text-[#8f9394]">{role.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative rounded-3xl bg-[var(--color-surface)] border border-white/[0.06] p-8 overflow-hidden">
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
            <div className="flex justify-center pb-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Sparkles size={13} className="text-white/60" />
                <span className="text-xs text-[#c4c7c8]">Secure account</span>
              </div>
            </div>

            {mode === "register" && (
              <Field label="Full Name">
                <input type="text" placeholder="Alex Johnson" value={form.name} onChange={update("name")} disabled={loading} autoComplete="name" className="input" />
              </Field>
            )}

            <Field label="Email Address">
              <input type="email" placeholder="name@example.com" value={form.email} onChange={update("email")} disabled={loading} autoComplete="email" className="input" />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={update("password")} disabled={loading} autoComplete={mode === "login" ? "current-password" : "new-password"} className="input pr-11" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8d8e] hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {mode === "register" && (
              <Field label="Confirm Password">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.confirmPassword} onChange={update("confirmPassword")} disabled={loading} autoComplete="new-password" className="input" />
              </Field>
            )}

            {error && (
              <div className={`rounded-xl border px-4 py-3 text-sm ${error.includes("successfully") ? "border-green-500/20 bg-green-500/10 text-green-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4e4fa] px-5 py-3.5 text-sm font-semibold text-[#171717] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? `Login as ${currentRole.label}` : `Create ${currentRole.label} Account`}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-[#c4c7c8]">{mode === "login" ? "Don't have an account?" : "Already have an account?"}</span>
          <button type="button" onClick={switchMode} disabled={loading} className="font-semibold text-white hover:underline">
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>

      <style>{`.input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:15px 17px;font-size:14px;color:white;outline:none;transition:border-color .15s}.input::placeholder{color:#6b6e6f}.input:focus{border-color:rgba(255,255,255,.3)}.input:disabled{opacity:.5;cursor:not-allowed}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#c4c7c8]">{label}</span>
      {children}
    </label>
  );
}
