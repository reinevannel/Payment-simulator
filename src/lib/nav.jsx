import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(to) {
    if (to === path) return;
    window.history.pushState(null, "", to);
    setPath(to);
  }

  return <NavContext.Provider value={{ path, go }}>{children}</NavContext.Provider>;
}

export function useNav() {
  const value = useContext(NavContext);
  if (!value) throw new Error("useNav must be used inside NavProvider");
  return value;
}

export function Link({ to, className, activeClassName, inactiveClassName, children, ...rest }) {
  const { path, go } = useNav();
  const active = path === to;
  return (
    <a
      href={to}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
