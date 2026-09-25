import { useEffect, useState } from "react";
import { detectNetwork, networkLabel, panGroups } from "@/lib/payments/cards";
import { cn } from "@/lib/cn";
const FACE = {
  visa: "card-visa",
  mastercard: "card-mastercard",
  amex: "card-amex",
  discover: "card-discover",
};
export function CardScene({
  number,
  name,
  expiry,
  cvv,
  flipped = false,
  scanning = false,
  className,
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [interactive, setInteractive] = useState(false);
  const network = detectNetwork(number);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setInteractive(fine && !reduce);
  }, []);
  function onMove(event) {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -9, y: px * 12 });
  }
  const holder = name.trim() ? name.trim().toUpperCase() : "YOUR NAME";
  const exp = expiry || "MM/YY";
  return (
    <div
      className={cn("card-stage mx-auto w-full max-w-md", className)}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="card-tilt relative transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div
          className={cn(
            "card-flip absolute inset-0 transition-transform duration-500",
            flipped && "is-flipped",
          )}
        >
          <Front
            network={network}
            groups={panGroups(number)}
            holder={holder}
            expiry={exp}
            scanning={scanning}
          />
          <Back network={network} cvv={cvv} />
        </div>
      </div>
      <p className="sr-only">
        {network && network !== "pending"
          ? `${networkLabel(network)} card preview.`
          : "Payment card preview."}{" "}
        {flipped ? "Showing the back, where the security code sits." : "Showing the front."}
      </p>
    </div>
  );
}
function Front({ network, groups, holder, expiry, scanning }) {
  const face =
    network && network !== "pending" && network !== "unknown" ? FACE[network] : "card-plain";
  return (
    <div className={cn("card-face", face)} aria-hidden="true">
      <div className="card-shine pointer-events-none absolute inset-0" />
      {scanning ? (
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-16" />
      ) : null}
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="text-xs tracking-[0.28em] text-card-dim">NEXUSPAY</span>
          <Contactless />
        </div>
        <div className="card-chip" />
        <div>
          <p className="card-pan text-sm sm:text-lg">{groups.join(" ")}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-card-dim">CARD HOLDER</p>
              <p className="text-sm font-medium text-card-ink">{holder}</p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-[0.18em] text-card-dim">EXPIRES</p>
              <p className="font-mono text-sm text-card-ink">{expiry}</p>
              <NetworkLogo network={network} onCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Back({ network, cvv }) {
  const face =
    network && network !== "pending" && network !== "unknown" ? FACE[network] : "card-plain";
  return (
    <div className={cn("card-face card-back", face)} aria-hidden="true">
      <div className="mt-6 h-11 bg-black/70" />
      <div className="px-5 pt-5">
        <div className="flex items-center justify-end gap-3">
          <div className="h-9 flex-1 rounded bg-white/80" />
          <span className="grid h-9 min-w-14 place-items-center rounded bg-white font-mono text-sm text-gold-ink">
            {cvv || "•••"}
          </span>
        </div>
        <p className="mt-4 text-xs text-card-dim">
          Property of NexusPay Lab · Simulated card · Not for real transactions
        </p>
      </div>
    </div>
  );
}
function Contactless() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 text-card-ink opacity-80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M8 8.5c2.2 1.6 2.2 5.4 0 7" />
      <path d="M11.5 6c3.4 2.6 3.4 9.4 0 12" />
      <path d="M15 3.5c4.6 3.6 4.6 13.4 0 17" />
    </svg>
  );
}
export function NetworkLogo({ network, onCard = false, className }) {
  const ink = onCard ? "text-card-ink" : "text-fg";
  if (network === "visa") {
    return (
      <span className={cn("text-sm font-bold tracking-tight italic", ink, className)}>VISA</span>
    );
  }
  if (network === "mastercard") {
    return (
      <span className={cn("inline-flex", className)} aria-hidden="true">
        <span className="mc-red size-5 rounded-full" />
        <span className="mc-gold -ml-2 size-5 rounded-full opacity-90" />
      </span>
    );
  }
  if (network === "amex") {
    return <span className={cn("text-xs font-bold tracking-wide", ink, className)}>AMEX</span>;
  }
  if (network === "discover") {
    return <span className={cn("text-xs font-bold tracking-wide", ink, className)}>DISCOVER</span>;
  }
  return null;
}
