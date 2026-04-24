/* Full-width dark stat strip. Huge brass numbers, small muted caps
   labels, vertical hairline dividers. Used after heroes and between
   content blocks to punch out key facts.

   Usage:
     <StatStrip stats={[
       { value: "60 MIN", label: "Ride Time" },
       { value: "$129",   label: "Starting Rate" },
       ...
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

export function StatStrip({ stats, compact = false, className = "" }: StatStripProps) {
  return (
    <section
      className={`relative bg-bg-deep border-y border-border overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => {
            const notLastMobile = i % 2 === 0;
            const notLastDesktop = i < stats.length - 1;
            return (
              <div
                key={`${s.label}-${i}`}
                className={`
                  ${compact ? "px-4 py-8 md:py-10" : "px-5 py-10 md:px-8 md:py-16"}
                  text-center md:text-left
                  ${notLastMobile ? "border-r md:border-r-0" : ""}
                  ${notLastDesktop ? "md:border-r" : ""}
                  ${i >= 2 ? "border-t md:border-t-0" : ""}
                  border-border
                `}
              >
                <p
                  className={`mono-num font-bold text-accent-hi leading-[0.9] tracking-tight ${
                    compact
                      ? "text-3xl md:text-4xl lg:text-5xl"
                      : "text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  }`}
                >
                  {s.value}
                </p>
                <p
                  className={`mt-3 md:mt-4 font-mono uppercase tracking-[0.2em] text-ink-dim ${
                    compact ? "text-[9px] md:text-[10px]" : "text-[10px] md:text-[11px]"
                  }`}
                >
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
