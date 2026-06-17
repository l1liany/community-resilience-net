import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const Input = z.object({
  situation: z.string().trim().min(1, "Please describe your situation").max(2000),
});

export type RecommendedOrg = {
  id: string;
  name: string;
  category: Database["public"]["Enums"]["org_category"];
  description: string;
  amount_label: string | null;
  region: string;
};

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ message: string; recommended: RecommendedOrg[] }> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("The assistant is not configured yet.");

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: orgs } = await supabase
      .from("aid_organizations")
      .select("id,name,category,description,amount_label,region,tags");

    const catalog = (orgs ?? [])
      .map(
        (o) =>
          `- [${o.id}] ${o.name} (${o.category}, ${o.region}) — ${o.description} Tags: ${o.tags.join(", ")}`,
      )
      .join("\n");

    const system = `You are the HopeBridge recovery assistant — warm, calm, and reassuring. You help people affected by natural disasters (floods, earthquakes, droughts, landslides, storms, wildfires) find relevant aid.

Rules:
- Be compassionate and concise. Acknowledge their situation in one short sentence, then guide them.
- Recommend ONLY programs from the provided list that genuinely fit their needs. Pick 2 to 4.
- Never invent programs or program IDs. Use exact IDs from the list.
- Keep the message to 2 short paragraphs. Plain, supportive language. No legal or medical guarantees.
- Always respond with valid JSON only, matching: {"message": string, "recommendedIds": string[]}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `My situation: ${data.situation}\n\nAvailable programs:\n${catalog}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429)
      throw new Error("The assistant is busy right now. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI usage limit reached. Please add credits to keep using the assistant.");
    if (!res.ok) throw new Error("The assistant could not respond. Please try again.");

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";

    let parsed: { message?: string; recommendedIds?: string[] } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { message: content };
    }

    const ids = Array.isArray(parsed.recommendedIds) ? parsed.recommendedIds : [];
    const recommended: RecommendedOrg[] = (orgs ?? [])
      .filter((o) => ids.includes(o.id))
      .map((o) => ({
        id: o.id,
        name: o.name,
        category: o.category,
        description: o.description,
        amount_label: o.amount_label,
        region: o.region,
      }));

    return {
      message:
        parsed.message?.trim() ||
        "Here are some programs that may be able to help with your situation.",
      recommended,
    };
  });
