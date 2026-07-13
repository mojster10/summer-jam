"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BudgetBanner from "@/components/BudgetBanner";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/mockData";
import { nextSaturdayISO, weekendLabel } from "@/lib/weekend";
import { formatTime } from "@/lib/format";

const STORAGE_KEY = "svp:v1";

const emptySelection = () =>
  CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: [] }), {});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState("");
  const [selection, setSelection] = useState(emptySelection);
  const [prices, setPrices] = useState({}); // { key: { options, stale, ... } }
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState(null);

  // Obnovi stanje iz localStorage ob prvem renderju (samo na klientu).
  useEffect(() => {
    let restored = null;
    try {
      restored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      restored = null;
    }
    setDate(restored?.date || nextSaturdayISO());
    if (restored?.selection) {
      setSelection({ ...emptySelection(), ...restored.selection });
    }
    setMounted(true);
  }, []);

  // Shrani stanje ob vsaki spremembi.
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date, selection }));
    } catch {
      /* localStorage morda ni na voljo */
    }
  }, [mounted, date, selection]);

  // Naloži / osveži cene ob nalaganju in ob spremembi datuma.
  useEffect(() => {
    if (!mounted || !date) return;
    let cancelled = false;
    setLoading(true);

    async function loadAll() {
      const entries = await Promise.all(
        CATEGORIES.map(async (c) => {
          try {
            const res = await fetch(
              `/api/prices/${c.key}?date=${encodeURIComponent(date)}`
            );
            const json = await res.json();
            return [c.key, json];
          } catch {
            return [c.key, { options: [], stale: true, message: "napaka pri nalaganju" }];
          }
        })
      );
      if (cancelled) return;
      setPrices(Object.fromEntries(entries));
      setRefreshedAt(new Date());
      setLoading(false);
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [mounted, date]);

  const toggle = useCallback((categoryKey, optionId) => {
    setSelection((prev) => {
      const current = prev[categoryKey] || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [categoryKey]: next };
    });
  }, []);

  const reset = useCallback(() => {
    setSelection(emptySelection());
  }, []);

  // Podvsote na kategorijo + skupni total.
  const { subtotals, total } = useMemo(() => {
    const subs = {};
    let sum = 0;
    for (const c of CATEGORIES) {
      const options = prices[c.key]?.options || [];
      const ids = selection[c.key] || [];
      const s = options
        .filter((o) => ids.includes(o.id))
        .reduce((acc, o) => acc + (Number(o.price) || 0), 0);
      subs[c.key] = s;
      sum += s;
    }
    return { subtotals: subs, total: sum };
  }, [prices, selection]);

  return (
    <main className="page">
      <span className="eyebrow">Sanjski vikend</span>
      <h1 className="title">Načrtuj svoj vikend v Ljubljani</h1>
      <p className="subtitle">
        Sestavi popolni vikend — leti, hotel, hrana in zabava — z živimi cenami in
        proračunom €500.
      </p>
      <div className="divider" aria-hidden="true" />

      <div className="date-row">
        <label htmlFor="weekend-date">Vikend:</label>
        <input
          id="weekend-date"
          className="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Izberi datum vikenda"
        />
        {mounted && date && (
          <span className="refreshed">{weekendLabel(date)}</span>
        )}
        {refreshedAt && !loading && (
          <span className="refreshed">
            · Cene osvežene ob {formatTime(refreshedAt)}
          </span>
        )}
      </div>

      <BudgetBanner total={total} />

      {CATEGORIES.map((category) => (
        <CategoryCard
          key={category.key}
          category={category}
          data={prices[category.key]}
          loading={loading}
          selectedIds={selection[category.key] || []}
          subtotal={subtotals[category.key] || 0}
          onToggle={toggle}
        />
      ))}

      <button
        type="button"
        className="reset-btn"
        onClick={reset}
        aria-label="Ponastavi celoten načrt"
      >
        Ponastavi načrt
      </button>
    </main>
  );
}
