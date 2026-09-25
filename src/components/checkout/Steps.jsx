import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
const STEPS = [
  { id: "cart", label: "Cart" },
  { id: "method", label: "Payment" },
  { id: "details", label: "Details" },
  { id: "receipt", label: "Done" },
];
function indexOf(step) {
  if (step === "processing") return 2;
  return STEPS.findIndex((item) => item.id === step);
}
export function StepRail({ step, onJump }) {
  const current = indexOf(step);
  return (
    <ol className="mx-auto flex max-w-lg items-center" aria-label="Checkout progress">
      {STEPS.map((item, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={item.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              className="flex flex-col items-center gap-2 disabled:cursor-default"
              disabled={!done || item.id === "receipt"}
              onClick={() => {
                if (done && item.id !== "receipt") onJump(item.id);
              }}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border text-sm font-semibold",
                  done && "border-ok bg-ok text-ok-ink",
                  active && "border-gold bg-gold-fill text-gold-ink",
                  !done && !active && "border-line bg-surface text-faint",
                )}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs tracking-widest uppercase",
                  active ? "text-gold" : "text-faint",
                )}
              >
                {item.label}
              </span>
            </button>
            {index < STEPS.length - 1 ? (
              <span
                className={cn("mx-2 mb-6 h-px flex-1", done ? "bg-ok" : "bg-line")}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
