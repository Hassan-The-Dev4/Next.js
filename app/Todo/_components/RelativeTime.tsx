"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

// "2 hours ago", "yesterday", "3 weeks ago"...
function formatRelativeTime(date: Date, now: number): string {
  const seconds = (date.getTime() - now) / 1000;

  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(Math.trunc(seconds / secondsInUnit), unit);
    }
  }

  return "just now";
}

// Shows a relative time that keeps updating while the page is open.
// The text is only rendered after mount: the server's clock and time zone can
// differ from the browser's, which would cause a hydration mismatch.
export default function RelativeTime({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const value = new Date(date);

  return (
    <time dateTime={date} title={now === null ? undefined : value.toLocaleString()}>
      {now === null ? "…" : formatRelativeTime(value, now)}
    </time>
  );
}
