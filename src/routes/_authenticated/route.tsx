import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check for developer mock session
    if (typeof localStorage !== "undefined") {
      const mockToken = localStorage.getItem("sb-auth-token");
      if (mockToken) {
        try {
          const parsed = JSON.parse(mockToken);
          if (parsed?.user) return { user: parsed.user };
        } catch (e) {
          // ignore
        }
      }
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
