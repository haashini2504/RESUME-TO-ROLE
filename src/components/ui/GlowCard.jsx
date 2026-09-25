export default function GlowCard({ glow = "pink", className = "", children, rounded = "rounded-[40px]" }) {
  return (
    <div className={`glow-card glow-${glow} ${rounded} ${className}`}>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
