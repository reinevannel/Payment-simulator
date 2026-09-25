import { formatWhen } from "@/lib/date";
import { Link } from "@/lib/nav";
import { Check, History, RotateCcw, X } from "lucide-react";
import { maskPan, money, networkLabel } from "@/lib/payments/cards";
import { cn } from "@/lib/cn";
import { methodLabel, useLab } from "@/lib/store";
export function ReceiptView() {
  const receipt = useLab((state) => state.receipt);
  const reset = useLab((state) => state.reset);
  const retry = useLab((state) => state.retry);
  if (!receipt) return null;
  const approved = receipt.status === "approved";
  const when = formatWhen(receipt.createdAt);
  return (
    <div className="rise mx-auto max-w-lg text-center">
      <div
        className={cn(
          "mx-auto grid size-24 place-items-center rounded-full border-2",
          approved ? "glow-ok border-ok text-ok" : "border-danger text-danger",
        )}
      >
        {approved ? (
          <Check className="size-10" aria-hidden="true" />
        ) : (
          <X className="size-10" aria-hidden="true" />
        )}
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        {approved ? "Payment Successful" : "Payment Declined"}
      </h1>
      <p
        className={cn(
          "mt-2 text-sm tracking-widest uppercase",
          approved ? "text-ok" : "text-danger",
        )}
      >
        {approved ? "Transaction confirmed" : receipt.reason}
      </p>

      <section className="panel mt-8 p-5 text-left" aria-label="Transaction receipt">
        <h2 className="text-xs tracking-widest text-ok uppercase">Transaction receipt</h2>
        <dl className="mt-3 divide-y divide-line text-sm">
          <Row label="Amount" value={money(receipt.amount)} emphasize />
          <Row
            label={receipt.method === "card" ? "Card" : "Method"}
            value={
              receipt.method === "card"
                ? maskPan(receipt.last4, receipt.network)
                : `${methodLabel(receipt.method)} · simulated`
            }
          />
          {receipt.method === "card" ? (
            <Row label="Network" value={networkLabel(receipt.network)} />
          ) : null}
          <Row label="Date" value={when} />
          <Row label="Reference" value={receipt.reference} />
          <Row label="Status" value={approved ? "Approved" : "Declined"} emphasize />
        </dl>
      </section>

      <p className="mt-3 text-xs text-faint">
        Only the last four digits are kept in history. The security code is discarded.
      </p>

      <div className="mt-5 grid gap-3">
        {approved ? (
          <button
            type="button"
            className="btn-gold press flex h-14 items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-widest"
            onClick={reset}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            NEW SIMULATION
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-gold press h-14 rounded-full text-sm font-semibold tracking-widest"
              onClick={retry}
            >
              TRY AGAIN
            </button>
            <button
              type="button"
              className="h-12 rounded-full border border-line text-sm text-muted"
              onClick={reset}
            >
              NEW SIMULATION
            </button>
          </>
        )}
        <Link
          to="/history"
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-sm text-muted"
        >
          <History className="size-4" aria-hidden="true" />
          VIEW HISTORY
        </Link>
      </div>
    </div>
  );
}
function Row({ label, value, emphasize }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("text-right font-medium tabular-nums", emphasize && "text-ok")}>{value}</dd>
    </div>
  );
}
