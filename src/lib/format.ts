export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

export const formatCurrencyCents = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n || 0);

export const nightsBetween = (checkIn: string | Date | null | undefined, checkOut: string | Date | null | undefined): number => {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const formatDate = (d: string | Date | null | undefined): string => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatDateShort = (d: string | Date | null | undefined): string => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const toISODate = (d: string | Date): string => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split("T")[0];
};

export const todayISO = (): string => toISODate(new Date());

export const addDays = (iso: string | Date, n: number): string => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

export const generateReference = (prefix = "HV"): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
};

export const FEES = { cleaning: 120, serviceRate: 0.08 };

export const calcTotal = (nightly: number, nights: number) => {
  const cleaning = FEES.cleaning;
  const service = Math.round(nightly * nights * FEES.serviceRate);
  const total = nightly * nights + cleaning + service;
  return { nights, nightly, cleaning, service, total };
};