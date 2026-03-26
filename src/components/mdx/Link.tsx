// src/components/mdx/Link.tsx
import type { ComponentChildren } from "preact";

interface LinkProps {
  children: ComponentChildren;
  href?: string;
  class?: string;
  [key: string]: unknown;
}

export default function Link({ children, href, class: className, ...props }: LinkProps) {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));

  const defaultClasses =
    "text-primary-600 dark:text-primary-400 hover:underline focus:outline-hidden focus:ring-2 focus:ring-primary-500/50 rounded-sm";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener noreferrer"
        class={`${defaultClasses} ${className ?? ""}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  // For internal links (including anchors), let Astro handle them or use basic styling.
  // If using Astro's View Transitions, regular <a> tags are typically fine.
  return (
    <a href={href} class={`${defaultClasses} ${className ?? ""}`} {...props}>
      {children}
    </a>
  );
}
