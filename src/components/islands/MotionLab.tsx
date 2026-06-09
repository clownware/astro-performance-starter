import { signal } from "@preact/signals";

/**
 * MotionLab — the showcase's deliberate Preact island (#250, ADR-048).
 *
 * The site is zero-JS by default; this is the ONE interactive motion demo that
 * opts into an island, to show the architecture honestly: CSS owns the motion,
 * a Signal owns the *controls*. Self-contained — a scoped <style> carries the
 * keyframe so nothing leaks into the global sheet, and the animation is disabled
 * under prefers-reduced-motion regardless of the play state.
 */

const playing = signal(true);
const speeds = ["8s", "4s", "2s"] as const;
const speedLabels = ["Slow", "Normal", "Fast"] as const;
const speedIndex = signal(1);

export default function MotionLab() {
  return (
    <div class="flex flex-col gap-4">
      <style>{`
        @keyframes motion-lab-pan { from { background-position: 0% center; } to { background-position: 200% center; } }
        .motion-lab-swatch {
          height: 6rem;
          border-radius: 0.5rem;
          background-image: linear-gradient(100deg, hsl(var(--color-primary-500)), hsl(var(--color-secondary-500)), hsl(var(--color-primary-500)));
          background-size: 200% 100%;
          animation: motion-lab-pan linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-lab-swatch { animation: none; }
        }
      `}</style>

      <div
        class="motion-lab-swatch"
        style={{
          animationDuration: speeds[speedIndex.value],
          animationPlayState: playing.value ? "running" : "paused",
        }}
        aria-hidden="true"
      />

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            playing.value = !playing.value;
          }}
          class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary-600 text-primary-foreground hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
        >
          {playing.value ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            speedIndex.value = (speedIndex.value + 1) % speeds.length;
          }}
          class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium border border-border bg-background text-foreground hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary-500"
        >
          Speed: {speedLabels[speedIndex.value]}
        </button>
        <span class="text-xs text-muted-foreground">
          State lives in a Preact Signal; the gradient itself is pure CSS.
        </span>
      </div>
    </div>
  );
}
