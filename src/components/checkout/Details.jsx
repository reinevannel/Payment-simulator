import { ArrowLeft, CreditCard, Eye, EyeOff, Lock } from "lucide-react";
import { useId, useState } from "react";
import { CardScene, NetworkLogo } from "@/components/checkout/Card";
import { cartTotal } from "@/lib/payments/catalog";
import {
  cvvLength,
  detectNetwork,
  formatExpiry,
  formatPan,
  hasErrors,
  isIssuerDecline,
  money,
  networkLabel,
  TEST_CARDS,
  validateCard,
} from "@/lib/payments/cards";
import { onlyDigits } from "@/lib/payments/luhn";
import { cn } from "@/lib/cn";
import { useLab } from "@/lib/store";
export function DetailsStep() {
  const draft = useLab((state) => state.draft);
  const setDraft = useLab((state) => state.setDraft);
  const go = useLab((state) => state.go);
  const startProcessing = useLab((state) => state.startProcessing);
  const total = cartTotal(useLab((state) => state.items));
  const [showCvv, setShowCvv] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const baseId = useId();
  const network = detectNetwork(draft.number);
  function reveal(next) {
    if (submitted) setErrors(next);
  }
  function blurField(key) {
    const next = validateCard(draft);
    setErrors((current) => ({ ...current, [key]: next[key] }));
  }
  function fillTest() {
    const card = TEST_CARDS[0];
    const patch = {
      number: card.number,
      name: draft.name.trim() ? draft.name : "Alex Chen",
      expiry: card.expiry,
      cvv: card.cvv,
    };
    setDraft(patch);
    setErrors({});
  }
  function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const next = validateCard(draft);
    setErrors(next);
    if (hasErrors(next)) {
      const order = ["number", "name", "expiry", "cvv"];
      const first = order.find((key) => next[key]);
      if (first) document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }
    startProcessing(isIssuerDecline(draft.number) ? "declined" : "approved");
  }
  const shown = network && network !== "pending" ? network : null;
  return (
    <div className="rise mx-auto max-w-lg">
      <button
        type="button"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        onClick={() => go("method")}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Payment method
      </button>

      <div className="relative">
        <CardScene
          number={draft.number}
          name={draft.name}
          expiry={draft.expiry}
          cvv={draft.cvv}
          flipped={flipped}
        />
        {shown && shown !== "unknown" ? (
          <p
            className={cn(
              "mx-auto -mt-3 w-fit rounded-full px-3 py-1 text-xs tracking-widest",
              shown === "mastercard" ? "bg-danger-soft text-danger" : "bg-ok-soft text-ok",
            )}
          >
            {networkLabel(shown).toUpperCase()} DETECTED
          </p>
        ) : null}
      </div>

      <form className="mt-6 grid gap-3" onSubmit={onSubmit} noValidate>
        <Field
          id={`${baseId}-number`}
          label="Card number"
          placeholder="CARD NUMBER"
          value={draft.number}
          error={errors.number}
          inputMode="numeric"
          autoComplete="cc-number"
          onBlur={() => blurField("number")}
          onChange={(value) => {
            const number = formatPan(value);
            setDraft({ number });
            reveal(validateCard({ ...draft, number }));
            if (onlyDigits(number).length >= (detectNetwork(number) === "amex" ? 15 : 16)) {
              document.getElementById(`${baseId}-name`)?.focus();
            }
          }}
          trailing={
            shown && shown !== "unknown" ? (
              <NetworkLogo network={shown} />
            ) : (
              <CreditCard className="size-4 text-faint" aria-hidden="true" />
            )
          }
        />
        <Field
          id={`${baseId}-name`}
          label="Cardholder name"
          placeholder="CARDHOLDER NAME"
          value={draft.name}
          error={errors.name}
          autoComplete="cc-name"
          autoCapitalize="characters"
          onBlur={() => blurField("name")}
          onChange={(value) => {
            setDraft({ name: value });
            reveal(validateCard({ ...draft, name: value }));
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            id={`${baseId}-expiry`}
            label="Expiry date"
            placeholder="EXPIRY DATE"
            value={draft.expiry}
            error={errors.expiry}
            inputMode="numeric"
            autoComplete="cc-exp"
            onBlur={() => blurField("expiry")}
            onChange={(value) => {
              const expiry = formatExpiry(value);
              setDraft({ expiry });
              reveal(validateCard({ ...draft, expiry }));
              if (expiry.length === 5) document.getElementById(`${baseId}-cvv`)?.focus();
            }}
          />
          <Field
            id={`${baseId}-cvv`}
            label={cvvLength(network) === 4 ? "CID (4 digits)" : "CVV (3 digits)"}
            placeholder={cvvLength(network) === 4 ? "CID (4 DIGITS)" : "CVV (3 DIGITS)"}
            value={draft.cvv}
            error={errors.cvv}
            inputMode="numeric"
            autoComplete="cc-csc"
            masked={!showCvv}
            onFocus={() => setFlipped(true)}
            onBlur={() => {
              setFlipped(false);
              blurField("cvv");
            }}
            onChange={(value) => {
              const cvv = onlyDigits(value).slice(0, cvvLength(network));
              setDraft({ cvv });
              reveal(validateCard({ ...draft, cvv }));
            }}
            trailing={
              <button
                type="button"
                className="grid size-11 place-items-center text-faint hover:text-fg"
                aria-pressed={showCvv}
                aria-label={showCvv ? "Hide security code" : "Show security code"}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setShowCvv((value) => !value)}
              >
                {showCvv ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
        </div>

        <button
          type="button"
          className="rounded-control border border-line bg-gold-soft px-4 py-3 text-left text-sm text-gold"
          onClick={fillTest}
        >
          Test card: {TEST_CARDS[0].number} · Exp: {TEST_CARDS[0].expiry} · CVV: {TEST_CARDS[0].cvv}
        </button>
        <p className="text-xs text-faint">
          Declined test: {TEST_CARDS[3].number}. Nothing is sent to a server — checks run in this
          browser, and the full number is never stored.
        </p>

        {submitted && hasErrors(errors) ? (
          <p role="alert" className="text-sm text-danger">
            Fix the highlighted fields before paying. Each message says exactly what to change.
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-gold press mt-1 flex h-14 items-center justify-center gap-2 rounded-full text-sm font-semibold"
        >
          <Lock className="size-4" aria-hidden="true" />
          PAY SECURELY — {money(total)}
        </button>
      </form>
    </div>
  );
}
function Field({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  onFocus,
  trailing,
  masked,
  ...input
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className="relative block" htmlFor={id}>
        <span className="sr-only">{label}</span>
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            "h-14 w-full rounded-control border bg-elev px-4 text-sm tracking-wide text-fg placeholder:text-faint",
            trailing ? "pr-14" : "",
            error ? "border-danger" : "border-line focus:border-gold",
            masked && "cvv-mask",
          )}
          {...input}
        />
        {trailing ? (
          <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>
        ) : null}
      </label>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
