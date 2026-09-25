import { Building2, Smartphone, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CardScene } from "@/components/checkout/Card";
import { useLab } from "@/lib/store";
const CARD_STEPS = [
  "Connecting to payment network",
  "Running Luhn checksum",
  "Checking expiry",
  "Requesting issuer authorisation",
  "Confirming transaction",
];
const WALLET_STEPS = {
  apple: [
    "Opening simulated Apple Pay",
    "Face ID approved locally",
    "Tokenising device PAN",
    "Authorising with issuer",
    "Confirming transaction",
  ],
  google: [
    "Opening simulated Google Pay",
    "Device unlock approved",
    "Tokenising device PAN",
    "Authorising with issuer",
    "Confirming transaction",
  ],
  bank: [
    "Creating SEPA instruction",
    "Checking beneficiary",
    "Simulating instant transfer",
    "Waiting for acknowledgement",
    "Confirming transaction",
  ],
};
export function ProcessingView() {
  const method = useLab((state) => state.method);
  const draft = useLab((state) => state.draft);
  const finalize = useLab((state) => state.finalize);
  const [index, setIndex] = useState(0);
  const steps = method === "card" ? CARD_STEPS : WALLET_STEPS[method];
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pace = reduce ? 180 : 720;
    let current = 0;
    let timeout = 0;
    const timer = window.setInterval(() => {
      current += 1;
      if (current >= steps.length) {
        window.clearInterval(timer);
        timeout = window.setTimeout(() => finalize(), reduce ? 120 : 420);
        return;
      }
      setIndex(current);
    }, pace);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timeout);
    };
  }, [finalize, steps.length]);
  return (
    <div
      className="veil fixed inset-0 top-16 z-30 grid place-items-center px-4 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md text-center">
        {method === "card" ? (
          <CardScene
            number={draft.number}
            name={draft.name}
            expiry={draft.expiry}
            cvv={draft.cvv}
            scanning
          />
        ) : (
          <WalletMark method={method} />
        )}
        <p className="mt-8 text-sm tracking-[0.22em] text-gold uppercase">{steps[index]}</p>
        <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {steps.map((step, stepIndex) => (
            <span
              key={step}
              className={`size-2 rounded-full ${stepIndex <= index ? "bg-gold-fill" : "bg-line"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function WalletMark({ method }) {
  const Icon = method === "apple" ? Smartphone : method === "google" ? Zap : Building2;
  const label =
    method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "Bank transfer";
  return (
    <div className="panel mx-auto grid size-40 place-items-center">
      <Icon className="size-12 text-gold" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
