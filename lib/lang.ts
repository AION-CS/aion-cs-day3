/**
 * Number and money formats for the site. English only (CURRICULUM-GUIDE §1): `1,234.5` and `€12,345`.
 * One place, so the tables, the calculators, the exported documents and the mentor tools all print alike.
 */
export const locale = () => "en-US";

/** A number in the site's format. */
export const num = (n: number, opts?: Intl.NumberFormatOptions) => n.toLocaleString(locale(), opts);

/** One decimal place: 42.7. */
export const d1 = (n: number) => num(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Euros: €60,000. */
export const euro = (n: number) => `€${num(Math.round(n))}`;

/** Euros with a sign: +€3,416 / −€4,872. A zero has no sign. */
export const euroSigned = (n: number) => {
  const sign = n < 0 ? "−" : n > 0 ? "+" : "";
  return `${sign}€${num(Math.abs(Math.round(n)))}`;
};
