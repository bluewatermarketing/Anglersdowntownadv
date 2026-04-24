/* Dark stat strip. Brass monospace numbers, small caps labels, hairline
   dividers between cells. Auto-adapts to 2, 3, or 4 stats.

   Usage:
     <StatStrip stats={[
       { value: "$129",    label: "Starting Rate" },
       { value: "UP TO 3", label: "Riders / Ski" },
       { value: "AGES 5+", label: "Welcome" },
     ]} />
*/

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
  compact?: boolean;
  className?: string;
}

/* Map length -> responsive grid. Mobile: always 2 cols (or 1 if single).
   Desktop: spread evenly. */
function gridColsClass(n: number): string {
  if (n === 2) return "grid-cols-2";
  if (n === 3) return "grid-cols-1 sm:grid-cols-3";
  if (n === 4) return "grid-cols-2 md:grid-cols-4";
  if (n === 5) return "grid-cols-2 md:grid-cols-5";
  return "grid-cols-2 md:grid-cols-4";
}

export function StatStrip({ stats, compact = false, className = "" }: StatStripProps) {
  const n = stats.length;
  const cols = gridColsClass(n);

  return (
    <section
      className={`relative bg-bg-deep border-y border-border overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="relative max-w-6xl mx-auto">
        <div className={`grid ${cols}`}>
          {stats.map((s, i) => {
            // Divider logic: every cell except the last on its row gets right border.
            // On mobile (2-col grids), every odd index is rightmost; on desktop all but last.
            const isLastDesktop = i === n - 1;
            const isRightEdgeMobile = n === 2 ? i === 1 : i % 2 === 1;
            const isBottomRowMobile = n === 4 ? i >= 2 : n === 3 ? false : i >= Math.floor(n / 2) * 2;

            return (
              <div
                key={`${s.label}-${i}`}
                className={`
                  ${compact ? "px-5 py-6 md:py-8" : "px-5 py-8 md:px-8 md:py-10"}
                  flex flex-col items-center justify-center text-center
                  ${!isRightEdgeMobile ? "border-r md:border-r-0" : ""}
                  ${!isLastDesktop ? "md:border-r" : ""}
                  ${isBottomRowMobile ? "border-t md:border-t-0" : ""}
                  border-border
                `.replace(/\s+/g, " ").trim()}
              >
                <p
                  className={`mono-num font-bold text-accent-hi leading-[0.95] tracking-tight whitespace-nowrap ${
                    compact
                      ? "text-2xl md:text-3xl"
                      : "text-3xl md:text-4xl lg:text-5xl"
                  }`}
                >
                  {s.value}
                </p>
                <p className="mt-3 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink-dim">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
