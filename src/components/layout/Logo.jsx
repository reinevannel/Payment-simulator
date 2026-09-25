import { cn } from "@/lib/cn";
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#e8c547" />
      <path d="M9 23.5V8.5h3.1l7.7 10.4V8.5H23v15h-3.1l-7.7-10.4v10.4H9Z" fill="#1c1503" />
      <circle cx="26" cy="6.5" r="3" fill="#2ee59a" />
    </svg>
  );
}
