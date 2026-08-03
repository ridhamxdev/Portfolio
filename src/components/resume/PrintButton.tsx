"use client";

/**
 * The page's one CTA: prints the resume (browsers offer "Save as PDF" there).
 * Breathing pulse from globals.css (2.7s inhale, instant exhale); the whole
 * thing vanishes in print via .no-print.
 */
export default function PrintButton() {
  return (
    <span className="no-print inline-block">
      <span className="breathe inline-block">
        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print this resume or save it as a PDF"
          className="rounded-full border border-line-strong px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
        >
          Print / Save as PDF
        </button>
      </span>
    </span>
  );
}
