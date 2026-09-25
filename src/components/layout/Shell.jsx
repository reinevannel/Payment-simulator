import { BookOpen, CreditCard, History, Layers, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/cn";
import { Link, useNav } from "@/lib/nav";
import { useLab } from "@/lib/store";

const NAV = [
  { to: "/", label: "Simulate", icon: CreditCard },
  { to: "/history", label: "History", icon: History },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/study", label: "Case study", icon: Layers },
];

export function Shell({ children }) {
  const hydrate = useLab((state) => state.hydrate);
  const theme = useLab((state) => state.theme);
  const setTheme = useLab((state) => state.setTheme);
  const history = useLab((state) => state.history);
  const { path } = useNav();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const count = history.length;

  return (
    <div className="min-h-screen">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <header className="glass sticky top-0 z-40 border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 rounded-full" aria-label="NexusPay Lab home">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight">
              NexusPay <span className="text-muted">Lab</span>
            </span>
            <span className="hidden rounded-full border border-line px-2 py-0.5 text-xs text-muted sm:inline">
              v2.0
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavPill key={item.to} {...item} count={item.to === "/history" ? count : 0} />
            ))}
          </nav>

          <p className="ml-4 hidden text-xs tracking-[0.22em] text-faint xl:block">
            SIMULATE · VALIDATE · MASTER
          </p>

          <button
            type="button"
            className="press ml-auto grid size-11 place-items-center rounded-full border border-line bg-surface text-fg md:ml-3"
            aria-pressed={theme === "light"}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
        </div>
      </header>

      <main id="content" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-28 md:pb-16">
        {children}
      </main>

      <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line md:hidden" aria-label="Primary mobile">
        <ul className="grid grid-cols-4">
          {NAV.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-gold" : "text-muted",
                  )}
                >
                  <span className="relative">
                    <Icon className="size-5" aria-hidden="true" />
                    {item.to === "/history" && count > 0 ? (
                      <span className="absolute -top-2 -right-3 grid min-w-4 place-items-center rounded-full bg-gold-fill px-1 text-xs font-semibold text-gold-ink">
                        {count}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function NavPill({ to, label, icon: Icon, count }) {
  return (
    <Link
      to={to}
      className="press relative inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm"
      activeClassName="bg-gold-fill text-gold-ink"
      inactiveClassName="text-muted hover:text-fg"
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="tracking-wide uppercase">{label}</span>
      {count > 0 ? (
        <span className="link-count grid min-w-5 place-items-center rounded-full px-1 text-xs font-semibold">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
