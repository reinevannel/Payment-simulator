/**
 * Carte : formatage, réseau (Visa, Mastercard, Amex…) et messages d'erreur.
 * Tout reste dans le navigateur. Le numéro complet n'est pas enregistré.
 */
import { luhnValid, onlyDigits } from "./luhn";
export const EMPTY_DRAFT = {
  number: "",
  name: "",
  expiry: "",
  cvv: "",
};
/** Carte de démo qui passe le Luhn, mais que l'émetteur simulé refuse. */
export const DECLINE_PAN = "4000000000000002";
export const TEST_CARDS = [
  {
    id: "visa",
    number: "4532 0151 1283 0366",
    network: "Visa",
    expiry: "12/28",
    cvv: "737",
    valid: true,
    note: "Luhn ok",
  },
  {
    id: "mc",
    number: "5425 2334 3010 9903",
    network: "Mastercard",
    expiry: "12/28",
    cvv: "123",
    valid: true,
    note: "Luhn ok",
  },
  {
    id: "amex",
    number: "3742 510187 20950",
    network: "Amex",
    expiry: "12/28",
    cvv: "1234",
    valid: true,
    note: "Luhn ok · 4 chiffres",
  },
  {
    id: "decline",
    number: "4000 0000 0000 0002",
    network: "Visa",
    expiry: "12/28",
    cvv: "737",
    valid: false,
    note: "Luhn ok · refus émetteur",
  },
  {
    id: "bad",
    number: "1234 5678 9012 3456",
    network: "Unknown",
    expiry: "",
    cvv: "",
    valid: false,
    note: "Luhn failed",
  },
];
export function networkLabel(network) {
  switch (network) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    case "unknown":
      return "Unknown";
    default:
      return "";
  }
}
export function panLength(network) {
  return network === "amex" ? 15 : 16;
}
export function cvvLength(network) {
  return network === "amex" ? 4 : 3;
}
export function detectNetwork(value) {
  const digits = onlyDigits(value);
  if (!digits) return null;
  if (digits.startsWith("4")) return "visa";
  if (digits.startsWith("34") || digits.startsWith("37")) return "amex";
  if (digits === "3") return "pending";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (digits === "5") return "pending";
  if (digits.startsWith("2")) {
    if (digits.length < 4) {
      const low = Number(digits.padEnd(4, "0"));
      const high = Number(digits.padEnd(4, "9"));
      if (high < 2221 || low > 2720) return "unknown";
      return "pending";
    }
    const prefix = Number(digits.slice(0, 4));
    return prefix >= 2221 && prefix <= 2720 ? "mastercard" : "unknown";
  }
  if (digits.startsWith("6011") || digits.startsWith("65")) return "discover";
  if (digits.startsWith("64")) {
    if (digits.length < 3) return "pending";
    return /^64[4-9]/.test(digits) ? "discover" : "unknown";
  }
  if (digits === "6") return "pending";
  return "unknown";
}
export function formatPan(value) {
  const detected = detectNetwork(value);
  const max = panLength(detected);
  const digits = onlyDigits(value).slice(0, max);
  if (detected === "amex") {
    const parts = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean);
    return parts.join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
export function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
export function isIssuerDecline(value) {
  return onlyDigits(value) === DECLINE_PAN;
}
export function validateCard(draft, now = new Date()) {
  const errors = {};
  const digits = onlyDigits(draft.number);
  const network = detectNetwork(digits);
  const expected = panLength(network);
  if (!digits) {
    errors.number = "Card number required";
  } else if (network === "pending" || digits.length < expected) {
    errors.number = "Enter the full card number";
  } else if (!luhnValid(digits)) {
    errors.number = "Invalid card number (Luhn check failed)";
  }
  const name = draft.name.trim();
  if (!name) {
    errors.name = "Cardholder name required";
  } else if (name.length < 2 || !/^[\p{L}][\p{L}' .\-]{1,25}$/u.test(name)) {
    errors.name = "Enter the name printed on the card";
  }
  const expiry = draft.expiry.trim();
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!expiry) {
    errors.expiry = "Expiry date required";
  } else if (!match) {
    errors.expiry = "Use MM/YY";
  } else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) {
      errors.expiry = "Month must be 01–12";
    } else {
      const end = new Date(year, month, 0, 23, 59, 59);
      if (end < now) errors.expiry = "Card is expired";
    }
  }
  const cvv = onlyDigits(draft.cvv);
  const wanted = cvvLength(network);
  if (!cvv) {
    errors.cvv = "Security code required";
  } else if (cvv.length !== wanted) {
    errors.cvv =
      wanted === 4 ? "Enter the 4-digit code for American Express" : "Enter the 3-digit code";
  }
  return errors;
}
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
export function maskPan(last4, network) {
  if (network === "amex") return `•••• •••••• •${last4}`;
  return `•••• •••• •••• ${last4}`;
}
export function panGroups(value) {
  const digits = onlyDigits(value);
  const network = detectNetwork(digits);
  const pattern = network === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  let index = 0;
  return pattern.map((size) => {
    let group = "";
    for (let i = 0; i < size; i += 1) {
      group += digits[index] ?? "•";
      index += 1;
    }
    return group;
  });
}
export function money(amount) {
  const sign = amount < 0 ? "−" : "";
  return `${sign}€${Math.abs(amount).toFixed(2)}`;
}
