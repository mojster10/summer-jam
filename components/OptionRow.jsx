"use client";

import { formatEUR } from "@/lib/format";

function Check() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7.5L5.5 11L12 3.5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OptionRow({ option, selected, onToggle }) {
  return (
    <div
      className={`option${selected ? " selected" : ""}`}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label={`${option.name}, ${formatEUR(option.price)}${
        selected ? ", izbrano" : ""
      }`}
    >
      <span className="checkbox" aria-hidden="true">
        <Check />
      </span>
      <span className="option-body">
        <span className="option-name">
          {option.sourceUrl ? (
            <a
              href={option.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {option.name}
            </a>
          ) : (
            option.name
          )}
        </span>
      </span>
      <span className="option-price">{formatEUR(option.price)}</span>
    </div>
  );
}
