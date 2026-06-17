import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { to: "/resources", label: "Resources" },
  { to: "/organizations", label: "Organizations" },
  { to: "/community", label: "Community" },
  { to: "/funding", label: "Funding" },
  { to: "/map", label: "Map" },
  { to: "/assistant", label: "Assistant" },
] as const;

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
                <Link to="/report">Report Damage</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
                <Link to="/report">Report Damage</Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo compact />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  <Button asChild className="rounded-full" onClick={() => setOpen(false)}>
                    <Link to="/report">Report Damage</Link>
                  </Button>
                  {user ? (
                    <>
                      <Button asChild variant="outline" onClick={() => setOpen(false)}>
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant="ghost" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
