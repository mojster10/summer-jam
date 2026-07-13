"use client";

import { formatEUR } from "@/lib/format";

const BUDGET = 500;

export default function BudgetBanner({ total }) {
  const over = total > BUDGET;
  return (
    <div
      className={`banner${over ? " over" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div>
        <div className="banner-label">Skupaj</div>
        <div className="banner-note">
          {over ? (
            <>
              <span aria-hidden="true">⚠️</span> Prekoračen proračun! Presegel si
              €500.
            </>
          ) : (
            <>
              <span aria-hidden="true">🌴</span> Proračun: €500 za cel vikend
            </>
          )}
        </div>
      </div>
      <div className="banner-total">{formatEUR(total)}</div>
    </div>
  );
}
