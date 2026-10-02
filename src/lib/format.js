export const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

export const formatCurrencyCents = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n || 0);

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatDateShort = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const toISODate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split("T")[0];
};

export const todayISO = () => toISODate(new Date());

export const addDays = (iso, n) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

export const generateReference = (prefix = "HV") => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
};

export const FEES = { cleaning: 120, serviceRate: 0.08 };

export const calcTotal = (nightly, nights) => {
  const cleaning = FEES.cleaning;
  const service = Math.round(nightly * nights * FEES.serviceRate);
  const total = nightly * nights + cleaning + service;
  return { nights, nightly, cleaning, service, total };
};