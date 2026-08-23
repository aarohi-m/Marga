import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between min and max. */
export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** Format an integer with thousands separators. */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

/** Format an hours:minutes clock from minutes-since-midnight. */
export function minutesToTime(min: number) {
  const h = Math.floor((min / 60) % 24);
  const m = Math.floor(min % 60);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Days since / relative "x ago" helper. */
export function timeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Deterministic pseudo-random from a seed (stable mock jitter). */
export function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
