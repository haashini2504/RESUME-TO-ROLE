import { forwardRef } from "react";

const variants = {
  primary:
    "bg-white text-[#2f3131] hover:bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.1)]",
  outline:
    "border border-white/10 text-white hover:bg-white/5",
  ghost: "text-[#c4c7c8] hover:text-white",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3.5 text-xs",
  lg: "px-8 py-[18px] text-xs",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", children, icon: Icon, iconPosition = "left", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-ui font-semibold tracking-[0.6px] uppercase-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={14} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={14} />}
    </button>
  );
});

export default Button;
