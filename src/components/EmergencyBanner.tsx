import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div className="bg-emergency px-4 py-2 text-center text-xs font-semibold tracking-wide text-emergency-foreground">
      <span className="inline-flex items-center gap-1.5">
        <AlertTriangle className="size-3.5" aria-hidden="true" />
        LIVE ALERT: SEVERE FLOOD WARNING IN WESTERN REGION —{" "}
        <Link to="/map" className="underline underline-offset-2">
          View assistance map
        </Link>
      </span>
    </div>
  );
}
