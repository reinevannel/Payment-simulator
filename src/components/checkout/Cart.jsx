import { GraduationCap, Infinity, Minus, Palette, Plus, ShoppingCart, Zap } from "lucide-react";
import { cartLines, cartTotal, PRODUCTS } from "@/lib/payments/catalog";
import { money } from "@/lib/payments/cards";
import { cn } from "@/lib/cn";
import { useLab } from "@/lib/store";
const ICONS = {
  masterclass: GraduationCap,
  credits: Zap,
  uikit: Palette,
  pro: Infinity,
};
const TONE = {
  gold: "bg-gold-soft text-gold",
  ok: "bg-ok-soft text-ok",
  purple: "bg-purple-soft text-purple",
};
const PICK = {
  gold: "pick-gold",
  ok: "pick-ok",
  purple: "pick-purple",
};
export function CartStep() {
  const items = useLab((state) => state.items);
  const add = useLab((state) => state.add);
  const inc = useLab((state) => state.inc);
  const dec = useLab((state) => state.dec);
  const go = useLab((state) => state.go);
  const lines = cartLines(items);
  const total = cartTotal(items);
  return (
    <div className="rise mx-auto max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Choose your products</h1>
        <p className="mt-2 text-sm tracking-widest text-muted uppercase">
          Select items · add to cart · proceed to checkout
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              qty={items[product.id] ?? 0}
              onAdd={() => add(product.id)}
              onInc={() => inc(product.id)}
              onDec={() => dec(product.id)}
            />
          </li>
        ))}
      </ul>

      {lines.length > 0 ? (
        <section className="panel mt-6 p-5" aria-label="Order summary">
          <h2 className="text-xs tracking-widest text-faint uppercase">Order summary</h2>
          <ul className="mt-3 divide-y divide-line">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>
                  {line.name} <span className="text-muted">×{line.qty}</span>
                </span>
                <span className="font-medium tabular-nums">{money(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-center justify-between border-t border-line pt-3">
            <span>Total</span>
            <span className="text-xl font-semibold tabular-nums">{money(total)}</span>
          </p>
        </section>
      ) : null}

      <button
        type="button"
        className={cn(
          "press mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide",
          lines.length > 0 ? "btn-gold" : "bg-surface text-faint",
        )}
        disabled={lines.length === 0}
        onClick={() => go("method")}
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        {lines.length > 0 ? `PROCEED TO CHECKOUT — ${money(total)}` : "ADD ITEMS TO CONTINUE"}
      </button>
    </div>
  );
}
function ProductCard({ product, qty, onAdd, onInc, onDec }) {
  const Icon = ICONS[product.id];
  const selected = qty > 0;
  return (
    <article className={cn("panel flex h-full flex-col gap-4 p-4", selected && PICK[product.tone])}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-control",
            TONE[product.tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="shrink-0 font-semibold tabular-nums">{money(product.price)}</p>
          </div>
          <p className="mt-1 text-sm text-muted">{product.description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className={cn("rounded-full px-2 py-1 text-xs tracking-widest", TONE[product.tone])}>
          {product.tag}
        </span>
        {selected ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="press grid size-11 place-items-center rounded-full bg-danger-soft text-danger"
              onClick={onDec}
              aria-label={`Remove one ${product.name}`}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="press grid size-11 place-items-center rounded-full bg-ok-soft text-ok"
              onClick={onInc}
              aria-label={`Add another ${product.name}`}
              disabled={qty >= 9}
            >
              <Plus className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="press h-11 rounded-full border border-line px-4 text-sm font-semibold"
            onClick={onAdd}
          >
            ADD
          </button>
        )}
      </div>
    </article>
  );
}
