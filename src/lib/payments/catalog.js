/** Produits du panier. Un prix se change ici. */
export const PRODUCTS = [
  {
    id: "masterclass",
    name: "NexusPay Masterclass",
    description: "Complete payment systems course",
    price: 149,
    tag: "COURSE",
    tone: "gold",
  },
  {
    id: "credits",
    name: "API Credits Bundle",
    description: "10,000 API calls + analytics",
    price: 49,
    tag: "CREDITS",
    tone: "ok",
  },
  {
    id: "uikit",
    name: "Premium UI Kit",
    description: "200+ fintech components",
    price: 89,
    tag: "DESIGN",
    tone: "purple",
  },
  {
    id: "pro",
    name: "Pro Annual Plan",
    description: "Full platform · billed yearly",
    price: 199,
    tag: "SUBSCRIPTION",
    tone: "gold",
  },
];
export function productById(id) {
  return PRODUCTS.find((product) => product.id === id);
}
export function cartCount(items) {
  return Object.values(items).reduce((total, qty) => total + qty, 0);
}
export function cartTotal(items) {
  return PRODUCTS.reduce((total, product) => total + product.price * (items[product.id] ?? 0), 0);
}
export function cartLines(items) {
  return PRODUCTS.flatMap((product) => {
    const qty = items[product.id] ?? 0;
    return qty > 0 ? [{ ...product, qty }] : [];
  });
}
