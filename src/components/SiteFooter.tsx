import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row">
        <Logo compact />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rebuild Together Recovery Network. A platform for
          community resilience.
        </p>
        <div className="flex gap-6 text-xs font-medium text-muted-foreground">
          <Link to="/resources" className="transition-colors hover:text-foreground">
            Resources
          </Link>
          <Link to="/organizations" className="transition-colors hover:text-foreground">
            Organizations
          </Link>
          <Link to="/community" className="transition-colors hover:text-foreground">
            Community
          </Link>
        </div>
      </div>
    </footer>
  );
}
