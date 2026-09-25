import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Candidates", href: "#candidates" },
  { label: "For Recruiters", href: "#recruiters" },
  { label: "AI Matching", href: "#ai-matching" },
  { label: "Fairness", href: "#fairness" },
];

export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 backdrop-blur-md bg-[rgba(20,19,19,0.7)] border-b border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo size="text-[22px]" />
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-ui font-medium text-xs tracking-[0.6px] text-[#c4c7c8] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="font-ui font-semibold text-xs tracking-[0.6px] text-[#c4c7c8] hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
