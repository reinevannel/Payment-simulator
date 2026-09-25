/**
 * Luhn, en clair.
 * Depuis la droite, un chiffre sur deux est doublé.
 * Si le double dépasse 9, on retire 9. La somme doit être divisible par 10.
 * Ce n'est pas un chiffrement : seulement un contrôle de saisie.
 */
export function onlyDigits(value) {
  return value.replace(/\D/g, "");
}
export function luhnSum(digits) {
  let sum = 0;
  let doubleIt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (doubleIt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleIt = !doubleIt;
  }
  return sum;
}
export function luhnValid(value) {
  const digits = onlyDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;
  return luhnSum(digits) % 10 === 0;
}
export function luhnBreakdown(value) {
  const digits = onlyDigits(value).split("").map(Number);
  if (digits.length === 0) return null;
  const doubledMask = digits.map((_, index) => (digits.length - 1 - index) % 2 === 1);
  const doubled = digits.map((n, index) => (doubledMask[index] ? n * 2 : n));
  const reduced = doubled.map((n) => (n > 9 ? n - 9 : n));
  const sum = reduced.reduce((total, n) => total + n, 0);
  return {
    digits,
    doubled,
    reduced,
    doubledMask,
    sum,
    valid: digits.length >= 13 && sum % 10 === 0,
  };
}
