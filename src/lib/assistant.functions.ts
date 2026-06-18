import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  situation: z.string().trim().min(1, "Please describe your situation").max(2000),
});

export type RecommendedOrg = {
  id: string;
  name: string;
  category: "government" | "non_profit" | "community" | "donor";
  description: string;
  amount_label: string | null;
  region: string;
};

export const askAssistant = createServerFn({ method: "POST" })
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ message: string; recommended: RecommendedOrg[] }> => {
    try {
      // Forward to our express backend
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ situation: data.situation }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to communicate with AI backend.");
      }
      
      const json = await res.json();
      
      // Mock lookup for recommended orgs since the backend only returns IDs
      const mockOrgs: RecommendedOrg[] = [
        {
          id: "1",
          name: "Kenya Red Cross Society",
          category: "non_profit",
          region: "National",
          description: "Providing emergency relief, food, and medical assistance across Kenya.",
          amount_label: null,
        },
        {
          id: "2",
          name: "Nairobi County Government Relief",
          category: "government",
          region: "Nairobi",
          description: "County-level grants and housing support for flood-affected families.",
          amount_label: "KES 50,000",
        }
      ];

      const ids = Array.isArray(json.recommendedIds) ? json.recommendedIds : [];
      const recommended = mockOrgs.filter(o => ids.includes(o.id));

      return {
        message: json.message || "Here are some programs that may be able to help with your situation.",
        recommended,
      };
    } catch (err) {
      console.error(err);
      throw new Error("The assistant could not respond. Please try again.");
    }
  });
