/**
 * État du labo (Zustand).
 * items = panier, draft = carte en cours, history = reçus dans localStorage.
 * Seuls les 4 derniers chiffres sont gardés.
 */
import { create } from "zustand";
import { detectNetwork, EMPTY_DRAFT, isIssuerDecline } from "./payments/cards";
import { cartLines } from "./payments/catalog";
import { onlyDigits } from "./payments/luhn";
const HISTORY_KEY = "nexuspay.history.v1";
const THEME_KEY = "nx-theme";
const MAX_QTY = 9;
function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 8; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `NXP-${body}`;
}
function isTransaction(value) {
  if (!value || typeof value !== "object") return false;
  const tx = value;
  return (
    typeof tx.id === "string" &&
    typeof tx.reference === "string" &&
    typeof tx.amount === "number" &&
    (tx.status === "approved" || tx.status === "declined") &&
    typeof tx.createdAt === "string"
  );
}
function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTransaction).slice(0, 20);
  } catch {
    return [];
  }
}
function writeHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}
function onlyDigitsFromDraft(draft) {
  return onlyDigits(draft.number);
}
export const useLab = create((set, get) => ({
  items: {},
  draft: EMPTY_DRAFT,
  method: "card",
  step: "cart",
  outcome: "approved",
  receipt: null,
  history: [],
  hydrated: false,
  theme: "dark",
  hydrate: () => {
    if (get().hydrated || typeof window === "undefined") return;
    const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    set({ history: readHistory(), theme, hydrated: true });
  },
  setTheme: (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "light" ? "#f3f0e7" : "#07080c");
    set({ theme });
  },
  add: (id) =>
    set((state) => ({
      items: { ...state.items, [id]: state.items[id] ? state.items[id] : 1 },
    })),
  inc: (id) =>
    set((state) => ({
      items: { ...state.items, [id]: Math.min(MAX_QTY, (state.items[id] ?? 0) + 1) },
    })),
  dec: (id) =>
    set((state) => {
      const next = { ...state.items };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { items: next };
    }),
  setDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setMethod: (method) => set({ method }),
  go: (step) => set({ step }),
  startProcessing: (outcome) => set({ step: "processing", outcome }),
  finalize: () => {
    const state = get();
    if (state.step !== "processing") return;
    const digits = onlyDigitsFromDraft(state.draft);
    const networkState = detectNetwork(digits);
    const network = networkState === "pending" || networkState === null ? "unknown" : networkState;
    const lines = cartLines(state.items);
    const amount = lines.reduce((total, line) => total + line.price * line.qty, 0);
    const declined =
      state.method === "card" && (state.outcome === "declined" || isIssuerDecline(digits));
    const tx = {
      id: crypto.randomUUID(),
      reference: reference(),
      amount,
      status: declined ? "declined" : "approved",
      reason: declined ? "Issuer declined · simulated insufficient funds" : undefined,
      method: state.method,
      network: state.method === "card" ? network : null,
      last4: state.method === "card" ? digits.slice(-4) : "",
      holder: state.method === "card" ? state.draft.name.trim() : "",
      createdAt: new Date().toISOString(),
      items: lines.map((line) => ({ id: line.id, qty: line.qty })),
    };
    const history = [tx, ...state.history].slice(0, 20);
    writeHistory(history);
    set({
      history,
      receipt: tx,
      step: "receipt",
      draft: tx.status === "approved" ? EMPTY_DRAFT : state.draft,
    });
  },
  retry: () => set({ step: "details", receipt: null }),
  reset: () =>
    set({
      items: {},
      draft: EMPTY_DRAFT,
      method: "card",
      step: "cart",
      outcome: "approved",
      receipt: null,
    }),
  resim: (id) => {
    const tx = get().history.find((item) => item.id === id);
    if (!tx) return;
    const items = {};
    for (const line of tx.items) items[line.id] = line.qty;
    set({
      items,
      draft: EMPTY_DRAFT,
      method: tx.method,
      step: "cart",
      outcome: "approved",
      receipt: null,
    });
  },
}));
export function methodLabel(method) {
  switch (method) {
    case "apple":
      return "Apple Pay";
    case "google":
      return "Google Pay";
    case "bank":
      return "Bank transfer";
    default:
      return "Card";
  }
}
