import { formatWhen } from "@/lib/date";
import { useNav } from "@/lib/nav";
import { Check, Clock, RotateCcw, X } from "lucide-react";
import { maskPan, money, networkLabel } from "@/lib/payments/cards";
import { cn } from "@/lib/cn";
import { methodLabel, useLab } from "@/lib/store";
export function HistoryPage() {
  const history = useLab((state) => state.history);
  const hydrated = useLab((state) => state.hydrated);
  const resim = useLab((state) => state.resim);
  const { go } = useNav();
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Simulation History</h1>
        <div className="panel mt-8 h-28 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="rise mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">Simulation History</h1>
      <p className="mt-2 text-sm tracking-widest text-muted uppercase">
        {history.length === 0
          ? "No transactions yet"
          : `${history.length} transaction${history.length === 1 ? "" : "s"}`}
      </p>

      {history.length === 0 ? (
        <div className="mt-16 text-center">
          <Clock className="mx-auto size-8 text-faint" aria-hidden="true" />
          <p className="mt-4 text-lg">No simulations yet</p>
          <p className="mt-1 text-sm text-muted">Complete a payment flow to see history here.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {history.map((tx) => {
            const approved = tx.status === "approved";
            return (
              <li
                key={tx.id}
                className={cn(
                  "panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center",
                  approved && "edge-ok",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full",
                    approved ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger",
                  )}
                >
                  {approved ? <Check className="size-5" /> : <X className="size-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    <span className="tabular-nums">{money(tx.amount)}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs tracking-widest",
                        approved ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger",
                      )}
                    >
                      {approved ? "SUCCESS" : "DECLINED"}
                    </span>
                  </p>
                  <p className="truncate text-sm text-muted">
                    {tx.method === "card"
                      ? `${networkLabel(tx.network)} ${maskPan(tx.last4, tx.network)}`
                      : `${methodLabel(tx.method)} · simulated`}
                    {" · "}
                    {formatWhen(tx.createdAt)}
                  </p>
                  {tx.reason ? <p className="text-sm text-danger">{tx.reason}</p> : null}
                </div>
                <button
                  type="button"
                  className="press h-11 rounded-full border border-gold px-3 text-xs font-semibold tracking-widest text-gold"
                  onClick={() => {
                    resim(tx.id);
                    go("/");
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    RE-SIM
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-8 text-sm text-muted">
        Full card numbers and security codes are never written to history — only the last four
        digits, on this device.
      </p>
    </div>
  );
}
