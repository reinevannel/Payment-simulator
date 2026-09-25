/** Assemble des classes Tailwind. Les valeurs fausses (false, null) sont ignorées. */
export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(" ");
}
