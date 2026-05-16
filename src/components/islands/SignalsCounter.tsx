import { computed, signal } from "@preact/signals";

/**
 * SignalsCounter — Preact Signals reactive state demo.
 *
 * Demonstrates the islands architecture spectrum: CSS handles presentation,
 * Signals handle *state*. This is the one interactive island in the showcase —
 * it makes the zero-JS default more credible by showing you *choose* JS only
 * when genuine state management requires it.
 *
 * Uses client:visible for lazy hydration — zero JS cost until in viewport.
 */

const count = signal(0);
const doubled = computed(() => count.value * 2);
const isEven = computed(() => count.value % 2 === 0);

export default function SignalsCounter() {
  return (
    <div class="flex flex-col items-center gap-6 p-6 rounded-lg border border-border-primary bg-background-secondary">
      <div class="text-center">
        <p class="text-sm font-medium text-foreground-secondary mb-1">Reactive Count</p>
        <p class="text-4xl font-bold text-primary-600 dark:text-primary-400 tabular-nums">
          {count}
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          onClick={() => (count.value -= 1)}
          class="inline-flex items-center justify-center size-10 rounded-md border border-border-primary bg-background-primary text-foreground-primary hover:bg-background-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          aria-label="Decrement"
        >
          <svg
            class="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => (count.value += 1)}
          class="inline-flex items-center justify-center size-10 rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          aria-label="Increment"
        >
          <svg
            class="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => (count.value = 0)}
          class="inline-flex items-center justify-center px-3 h-10 rounded-md border border-border-primary bg-background-primary text-sm text-foreground-secondary hover:bg-background-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          aria-label="Reset counter"
        >
          Reset
        </button>
      </div>

      {/* Computed values — update automatically when count changes */}
      <div class="flex gap-6 text-sm text-foreground-secondary">
        <div class="flex flex-col items-center">
          <span class="font-medium text-foreground-primary tabular-nums">{doubled}</span>
          <span>Doubled</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-medium text-foreground-primary">{isEven.value ? "Even" : "Odd"}</span>
          <span>Parity</span>
        </div>
      </div>

      <p class="text-xs text-foreground-secondary text-center max-w-xs">
        Preact Signals — fine-grained reactivity with zero VDOM diffing. Only the text nodes that
        change re-render.
      </p>
    </div>
  );
}
