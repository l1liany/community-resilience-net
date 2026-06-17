import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="HopeBridge home">
      <div
        className={`flex items-center justify-center rounded-lg bg-primary font-serif font-bold text-primary-foreground ${
          compact ? "size-6 text-[10px]" : "size-8 text-base"
        }`}
        aria-hidden="true"
      >
        H
      </div>
      <span
        className={`font-serif font-semibold tracking-tight text-foreground ${
          compact ? "text-base" : "text-xl"
        }`}
      >
        HopeBridge
      </span>
    </Link>
  );
}
