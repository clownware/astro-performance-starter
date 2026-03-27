import { useState } from "preact/hooks";

interface Props {
  icon: string;
  title: string;
  description: string;
  metric: string;
  expandedDetails: string[];
}

export default function ExpandableFeatureCard({
  icon,
  title,
  description,
  metric,
  expandedDetails,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-card
      class="overflow-hidden rounded-lg border border-border-primary bg-background-primary shadow-sm relative p-6 hover:border-primary-300 transition-colors group"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4 flex-1">
          <div class="text-2xl" role="img" aria-label={`${title} icon`}>
            {icon}
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground-primary pr-4">{title}</h3>
          </div>
        </div>
        <span class="inline-flex items-center rounded-full font-medium bg-primary-100 text-primary-800 text-xs px-[0.5rem] py-0.5 shrink-0">
          {metric}
        </span>
      </div>

      <div class="pl-12">
        <p class="text-foreground-secondary mb-4">{description}</p>

        <details class="feature-details group" open={open}>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: summary element is interactive by default in HTML5 */}
          <summary
            class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 mb-3 transition-colors cursor-pointer list-none"
            aria-label="Toggle feature details"
            onClick={(e) => {
              e.preventDefault();
              setOpen((o) => !o);
            }}
          >
            <span>{open ? "Hide details" : "Show details"}</span>
            <svg
              class={`size-4 transform transition-transform duration-200${open ? " rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <section class="expand-content" aria-label="Feature details">
            <ul class="flex flex-col gap-2 text-sm text-foreground-secondary">
              {expandedDetails.map((detail) => (
                <li class="flex items-start gap-2 not-last:border-b not-last:border-border-primary not-last:pb-2">
                  <span class="text-primary-500 mt-1 text-xs" aria-hidden="true">
                    ▸
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </details>
      </div>
    </div>
  );
}
