// src/components/mdx/Blockquote.tsx
import type { ComponentChildren } from "preact";

interface BlockquoteProps extends preact.JSX.HTMLAttributes<HTMLQuoteElement> {
  children: ComponentChildren;
}

export default function Blockquote({ children, class: className, ...props }: BlockquoteProps) {
  const defaultClasses =
    "border-l-4 border-gray-300 dark:border-gray-600 pl-4 pr-2 py-2 my-5 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-r-md";
  return (
    <blockquote {...props} class={`${defaultClasses} ${className || ""}`}>
      {children}
    </blockquote>
  );
}
