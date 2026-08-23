import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Beautiful 3-line hamburger button that morphs based on sidebar state.
 *
 * State semantics:
 *   sidebarOpen === true   → sidebar is expanded  → show classic 3-line hamburger
 *   sidebarOpen === false  → sidebar is collapsed → morph into a compact "menu-closed" indicator
 *
 * The animation is a spring-based 3-bar morph:
 *   - top bar tilts slightly down + shortens (becomes upper arrow-head)
 *   - middle bar stays but slightly shortens
 *   - bottom bar tilts slightly up + shortens (becomes lower arrow-head)
 * On hover the whole icon springs up 1px and gets a soft blue halo.
 */
export function HamburgerButton({
  sidebarOpen,
  onClick,
  className,
  label = "Toggle sidebar",
}: {
  sidebarOpen: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
}) {
  const spring = { type: "spring", stiffness: 340, damping: 24 } as const;

  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      aria-expanded={sidebarOpen}
      title={label}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
      className={cn(
        "group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-sub outline-none transition-colors hover:bg-brand-soft hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/35",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* TOP BAR */}
        <motion.line
          x1="3.5"
          y1="7"
          x2="20.5"
          y2="7"
          initial={false}
          animate={{
            x1: sidebarOpen ? 3.5 : 5,
            x2: sidebarOpen ? 20.5 : 15,
            y1: sidebarOpen ? 7 : 8.2,
            y2: sidebarOpen ? 7 : 8.2,
          }}
          transition={spring}
          style={{ originX: "50%", originY: "50%" }}
        />
        {/* MIDDLE BAR */}
        <motion.line
          x1="3.5"
          y1="12"
          x2="20.5"
          y2="12"
          initial={false}
          animate={{
            x1: sidebarOpen ? 3.5 : 5,
            x2: sidebarOpen ? 20.5 : 19,
          }}
          transition={spring}
        />
        {/* BOTTOM BAR */}
        <motion.line
          x1="3.5"
          y1="17"
          x2="20.5"
          y2="17"
          initial={false}
          animate={{
            x1: sidebarOpen ? 3.5 : 5,
            x2: sidebarOpen ? 20.5 : 15,
            y1: sidebarOpen ? 17 : 15.8,
            y2: sidebarOpen ? 17 : 15.8,
          }}
          transition={spring}
        />
      </svg>
    </motion.button>
  );
}
