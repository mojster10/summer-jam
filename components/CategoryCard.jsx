"use client";

import OptionRow from "@/components/OptionRow";
import { formatEUR } from "@/lib/format";

function SkeletonRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <span className="skeleton-box" style={{ width: 22, height: 22 }} />
      <span className="skeleton-box" style={{ flex: 1, height: 14 }} />
      <span className="skeleton-box" style={{ width: 48, height: 14 }} />
    </div>
  );
}

export default function CategoryCard({
  category,
  data,
  loading,
  selectedIds,
  subtotal,
  onToggle,
}) {
  return (
    <section className="card fade-in" aria-label={category.title}>
      <div className="card-head">
        <h2 className="card-head-left">
          <span className="card-emoji" aria-hidden="true">
            {category.emoji}
          </span>
          {category.title}
        </h2>
        <span className="subtotal-pill" aria-label={`Podvsota ${category.title}`}>
          {formatEUR(subtotal)}
        </span>
      </div>

      {loading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        (data?.options || []).map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            selected={selectedIds.includes(option.id)}
            onToggle={() => onToggle(category.key, option.id)}
          />
        ))
      )}

      {!loading && data?.stale && (
        <p className="stale-note">
          <span aria-hidden="true">⚠️</span>
          {data.message || "cene morda niso aktualne"}
        </p>
      )}
    </section>
  );
}
