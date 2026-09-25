import { ArrowLeft, Building2, CreditCard, Lock, Smartphone, Zap } from "lucide-react";
import { cartTotal } from "@/lib/payments/catalog";
import { money } from "@/lib/payments/cards";
import { cn } from "@/lib/cn";
import { useLab } from "@/lib/store";
const METHODS = [
  {
    id: "card",
    title: "Credit / Debit Card",
    detail: "Visa, Mastercard, Amex, Discover",
    icon: CreditCard,
  },
  {
    id: "apple",
    title: "Apple Pay",
    detail: "Touch ID or Face ID",
    icon: Smartphone,
    simulated: true,
  },
  { id: "google", title: "Google Pay", detail: "Instant checkout", icon: Zap, simulated: true },
  {
    id: "bank",
    title: "Bank Transfer",
    detail: "SEPA instant — 1-2 days",
    icon: Building2,
    simulated: true,
  },
];
export function MethodStep() {
  const method = useLab((state) => state.method);
  const setMethod = useLab((state) => state.setMethod);
  const go = useLab((state) => state.go);
  const startProcessing = useLab((state) => state.startProcessing);
  const items = useLab((state) => state.items);
  const total = cartTotal(items);
  function continueFlow() {
    if (method === "card") go("details");
    else startProcessing("approved");
  }
  return (
    <div className="rise mx-auto max-w-lg">
      <button
        type="button"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        onClick={() => go("cart")}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to cart
      </button>
      <h1 className="text-4xl font-semibold tracking-tight">Payment Method</h1>
      <p className="mt-2 text-sm tracking-widest text-muted uppercase">Choose how to pay</p>

      <fieldset className="mt-6">
        <legend className="sr-only">Payment method</legend>
        <div className="grid gap-3">
          {METHODS.map((item) => {
            const Icon = item.icon;
            const selected = method === item.id;
            return (
              <label
                key={item.id}
                className={cn(
                  "panel flex cursor-pointer items-center gap-4 px-4 py-4",
                  selected ? "pick-gold" : item.simulated ? "opacity-80" : "",
                )}
              >
                <input
                  type="radio"
                  name="pay-method"
                  className="sr-only"
                  checked={selected}
                  onChange={() => setMethod(item.id)}
                />
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-control",
                    selected ? "bg-gold-soft text-gold" : "bg-elev text-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{item.title}</span>
                  <span className="block text-sm text-muted">{item.detail}</span>
                </span>
                {item.simulated ? (
                  <span className="rounded-full border border-line px-2 py-1 text-xs tracking-widest text-faint">
                    SIMULATED
                  </span>
                ) : selected ? (
                  <span className="size-2.5 rounded-full bg-gold-fill" aria-hidden="true" />
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-faint">
        <Lock className="size-3.5" aria-hidden="true" />
        256-bit SSL · PCI-DSS Level 1 · 3D Secure enabled
      </p>
      <button
        type="button"
        className="btn-gold press mt-4 h-14 w-full rounded-full text-sm font-semibold tracking-widest"
        onClick={continueFlow}
      >
        CONTINUE
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        Total to pay: <span className="font-semibold text-fg tabular-nums">{money(total)}</span>
      </p>
    </div>
  );
}
