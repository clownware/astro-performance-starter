import { useEffect, useState } from "preact/hooks";

interface Props {
  menuId: string;
}

export default function MobileMenuToggle({ menuId }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const menu = document.getElementById(menuId);
    if (!menu) {
      return;
    }
    menu.hidden = !open;
    if (open) {
      menu.classList.remove("opacity-0", "pointer-events-none");
      menu.classList.add("opacity-100");
    } else {
      menu.classList.add("opacity-0", "pointer-events-none");
      menu.classList.remove("opacity-100");
    }
  }, [open, menuId]);

  return (
    <button
      type="button"
      aria-controls={menuId}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur transition hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      {/* simple hamburger / close icon using spans */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <title>{open ? "Close menu icon" : "Open menu icon"}</title>
        {open ? (
          <path d="M18 6L6 18M6 6l12 12" />
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  );
}
