import { Check, Copy, GraduationCap, Shield, Star, Terminal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { TEST_CARDS } from "@/lib/payments/cards";
import { luhnBreakdown, onlyDigits } from "@/lib/payments/luhn";
import { cn } from "@/lib/cn";
const TABS = [
  { id: "luhn", label: "Luhn algorithm", icon: Terminal },
  { id: "pci", label: "PCI-DSS", icon: Shield },
  { id: "ux", label: "UX best practices", icon: Star },
];
const PCI = [
  {
    title: "Never store the CVV",
    body: "The security code may exist only for the moment of authorisation — not in databases, logs, files, or any persistent medium. Storing CVV is an immediate violation and grounds for disqualification from card processing.",
  },
  {
    title: "Encrypt card numbers at rest",
    body: "Primary account numbers must be unreadable wherever they are stored. Use strong cryptography such as AES-256. Show users only the last four digits. Truncation plus tokenisation is the standard approach.",
  },
  {
    title: "Enforce TLS 1.2+ in transit",
    body: "Cardholder data on open networks needs TLS 1.2 or higher. Disable SSL and TLS 1.0/1.1. Send HSTS headers. Pin certificates in mobile apps.",
  },
  {
    title: "Minimise data access",
    body: "Only people with a real business need should see cardholder data. Use roles, audit logs, and least privilege. Keep the cardholder data environment separate from the rest of the network.",
  },
  {
    title: "3-D Secure (3DS2)",
    body: "3DS2 adds a real-time risk check and, when needed, a step-up (biometric or one-time code). Authenticated payments can shift liability to the issuer. In the EU, strong customer authentication is mandatory under PSD2.",
  },
];
const UX = [
  {
    title: "Auto-format card numbers",
    body: "Insert a space every four digits (4-6-5 for American Express). It cuts entry errors sharply versus a raw 16-digit string. On phones, open the numeric keyboard.",
    good: "4532 0151 1283 0366",
    bad: "4532015112830366",
  },
  {
    title: "Live card type detection",
    body: "Read the network from the first digits and show its mark. Update the security-code length: 3 digits, or 4 on American Express.",
    good: "Logo appears, CVV length updates",
    bad: "Generic “card” label, no detection",
  },
  {
    title: "Flip the card on CVV focus",
    body: "When the security code is focused, turn the card over. People learn where the code sits, and support tickets drop.",
    good: "Card flips to the back",
    bad: "A static card that never changes",
  },
  {
    title: "Inline validation with clear errors",
    body: "Validate on blur, not on every keystroke, so errors are not premature. “Card is expired” beats “Invalid”. Pair colour with an icon and text — never colour alone.",
    good: "Card is expired, with a red border",
    bad: "“Invalid”, or silence until submit",
  },
  {
    title: "Fewer steps, faster feedback",
    body: "Each extra step costs conversions. Offer wallets before the long form. Move focus forward when a field is complete. After Pay, respond in under 100ms with a named status.",
    good: "Wallets first, then the card form",
    bad: "One endless form, then a frozen screen",
  },
];
export function LearnPage() {
  const [tab, setTab] = useState("luhn");
  return (
    <div className="rise mx-auto max-w-3xl">
      <h1 className="flex items-center gap-2 text-4xl font-semibold tracking-tight">
        <GraduationCap className="size-8 text-gold" aria-hidden="true" />
        Payment Education
      </h1>
      <p className="mt-2 text-sm tracking-widest text-muted uppercase">
        Learn how payments actually work
      </p>

      <div role="tablist" aria-label="Lessons" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              className={cn(
                "press inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm",
                selected ? "bg-gold-fill text-gold-ink" : "border border-line text-muted",
              )}
              onClick={() => setTab(item.id)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "luhn" ? <LuhnLesson /> : null}
        {tab === "pci" ? <PciLesson /> : null}
        {tab === "ux" ? <UxLesson /> : null}
      </div>
    </div>
  );
}
function LuhnLesson() {
  const [value, setValue] = useState(TEST_CARDS[0].number);
  const [note, setNote] = useState("");
  const breakdown = useMemo(() => luhnBreakdown(value), [value]);
  const digits = onlyDigits(value);
  return (
    <div className="grid gap-4">
      <section className="panel p-5 sm:p-6">
        <h2 className="text-xl font-semibold">What is the Luhn algorithm?</h2>
        <p className="mt-3 text-sm text-muted">
          Devised by Hans Peter Luhn at IBM in 1954, the Luhn formula is a checksum for
          identification numbers, including cards. It catches single-digit mistakes and most swaps
          of neighbouring digits. It is not encryption — only a sanity check against typos.
        </p>
        <p className="mt-5 text-xs tracking-widest text-faint uppercase">Interactive demo</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="luhn-input">
            Card number to check
          </label>
          <input
            id="luhn-input"
            value={value}
            inputMode="numeric"
            onChange={(event) => setValue(event.target.value.replace(/[^\d ]/g, "").slice(0, 23))}
            className="h-12 flex-1 rounded-full border border-gold bg-elev px-4 font-mono text-sm"
          />
          <button
            type="button"
            className="press h-12 rounded-full bg-ok px-5 text-sm font-semibold text-ok-ink"
            onClick={() => {
              if (!breakdown || digits.length < 13) {
                setNote("Enter at least 13 digits");
                return;
              }
              if (breakdown.valid) setNote("Checksum passed");
              else setNote("Checksum failed");
            }}
          >
            <Check className="mr-1 inline size-4" aria-hidden="true" />
            Valid
          </button>
        </div>
        {note ? (
          <p role="status" className="text-sm text-muted">
            {note}
          </p>
        ) : null}

        {breakdown ? (
          <div className="mt-6 grid gap-4">
            <DigitRow label="1. Original digits" values={breakdown.digits.map(String)} />
            <DigitRow
              label="2. Double every 2nd digit, from the right"
              values={breakdown.doubled.map(String)}
              mark={breakdown.doubledMask}
            />
            <DigitRow
              label="3. Subtract 9 if the result is over 9"
              values={breakdown.reduced.map(String)}
              mark={breakdown.doubled.map((n, i) => n !== breakdown.reduced[i])}
            />
            <p
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-control px-4 py-3 text-sm",
                breakdown.valid ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger",
              )}
            >
              <span>Sum of reduced digits · valid when sum mod 10 = 0</span>
              <span className="font-semibold tabular-nums">
                {breakdown.sum} % 10 = {breakdown.sum % 10}{" "}
                {breakdown.valid && digits.length >= 13 ? "· valid" : "· not yet"}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Type a number to see each step.</p>
        )}
      </section>

      <section className="panel p-5 sm:p-6">
        <h2 className="text-xs tracking-widest text-faint uppercase">Test card numbers</h2>
        <ul className="mt-3 divide-y divide-line">
          {TEST_CARDS.map((card) => (
            <li key={card.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <button
                type="button"
                className="font-mono text-left hover:text-gold"
                onClick={() => setValue(card.number)}
              >
                {card.number}
              </button>
              <span className="text-muted">{card.network}</span>
              <span className="ml-auto flex items-center gap-3">
                {card.id === "bad" ? (
                  <X className="size-4 text-danger" aria-label="Fails Luhn" />
                ) : card.id === "decline" ? (
                  <span className="text-xs tracking-widest text-danger">DECLINE</span>
                ) : (
                  <Check className="size-4 text-ok" aria-label="Passes Luhn" />
                )}
                <button
                  type="button"
                  className="text-xs tracking-widest text-faint hover:text-fg"
                  onClick={() => {
                    void navigator.clipboard.writeText(onlyDigits(card.number));
                    setNote("Card number copied");
                  }}
                >
                  <Copy className="mr-1 inline size-3.5" aria-hidden="true" />
                  COPY
                </button>
              </span>
              <span className="w-full text-xs text-faint">{card.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
function DigitRow({ label, values, mark }) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-widest text-faint uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value, index) => (
          <span
            key={`${label}-${index}`}
            className={cn(
              "grid h-9 min-w-9 place-items-center rounded-full px-1 font-mono text-sm",
              mark?.[index] ? "bg-gold-fill text-gold-ink" : "bg-elev text-fg",
            )}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
function PciLesson() {
  return (
    <ul className="grid gap-3">
      {PCI.map((item) => (
        <li key={item.title} className="panel p-5">
          <h2 className="font-semibold text-ok">{item.title}</h2>
          <p className="mt-2 text-sm text-muted">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
function UxLesson() {
  return (
    <ul className="grid gap-3">
      {UX.map((item) => (
        <li key={item.title} className="panel p-5">
          <h2 className="font-semibold">{item.title}</h2>
          <p className="mt-2 text-sm text-muted">{item.body}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <p className="rounded-control bg-ok-soft px-3 py-3 text-sm text-ok">Do · {item.good}</p>
            <p className="rounded-control bg-danger-soft px-3 py-3 text-sm text-danger">
              Don’t · {item.bad}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
