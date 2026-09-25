import { Link } from "react-router-dom";

export default function Logo({ size = "text-[32px]", subtitle, to = "/" }) {
  return (
    <Link to={to} className="inline-flex flex-col select-none">
      <span className={`font-heading font-bold text-white tracking-[-0.8px] ${size}`}>
        RESUME <span className="text-white/40">→</span> ROLE
      </span>
      {subtitle && <span className="text-xs text-[#8a8d8e] mt-1">{subtitle}</span>}
    </Link>
  );
}
