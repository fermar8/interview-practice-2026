type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {
  const styles = {
    primary:
      "bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-600",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:outline-slate-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
