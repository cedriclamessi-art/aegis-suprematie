export type CreativeScene = { id: string; seconds: number; visual: string; narration: string; onScreenText: string; status: "draft" | "approved" };
export type CreativePlan = { id: string; productUrl: string; brand: string; product: string; objective: string; format: "9:16" | "1:1" | "4:5"; provider: "kie" | "replicate"; scenes: CreativeScene[]; durationSeconds: number; status: "draft"; paidGenerationAuthorized: false };
export type CreativeInput = { productUrl: string; brand: string; product: string; objective?: string; audience?: string; format?: "9:16" | "1:1" | "4:5"; provider?: "kie" | "replicate" };
const clean = (v: unknown, max = 200) => typeof v === "string" ? v.trim().slice(0, max) : "";
export function planCreative(input: CreativeInput): CreativePlan {
  if (!input || typeof input !== "object") throw new Error("Missing creative brief");
  const raw = clean(input.productUrl, 2048);
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error("Valid product URL required"); }
  if (url.protocol !== "https:" || !url.hostname.includes(".") || url.username || url.password) throw new Error("Public HTTPS product URL required");
  const brand = clean(input.brand, 80), product = clean(input.product, 120);
  if (!brand || !product) throw new Error("Brand and product are required");
  const objective = clean(input.objective, 200) || "Highlight genuine product benefits";
  const audience = clean(input.audience, 120) || "Target customers";
  const format = ["9:16","1:1","4:5"].includes(input.format || "") ? input.format! : "9:16";
  const provider = input.provider === "replicate" ? "replicate" : "kie";
  const scenes: CreativeScene[] = [
    {id:"hook",seconds:3,visual:`Authentic context for ${audience}; show the real ${product}`,narration:"Introduce a concrete customer problem without unverified claims.",onScreenText:"A problem worth solving",status:"draft"},
    {id:"demo",seconds:5,visual:`Demonstrate ${product} accurately. Keep actual geometry, materials, colors and packaging.`,narration:"Demonstrate only verified product features.",onScreenText:product,status:"draft"},
    {id:"benefit",seconds:5,visual:`Show a realistic usage moment for ${brand}, without fabricated testimonials.`,narration:objective,onScreenText:"See how it works",status:"draft"},
    {id:"cta",seconds:3,visual:`Brand-safe end card for ${brand}; no fabricated prices or urgency.`,narration:"Invite customers to review the product page.",onScreenText:"Discover the product",status:"draft"}
  ];
  return {id:`draft-${Date.now()}`,productUrl:url.href,brand,product,objective,format,provider,scenes,durationSeconds:16,status:"draft",paidGenerationAuthorized:false};
}
export function reviseScene(plan: CreativePlan, sceneId: string, change: Partial<Pick<CreativeScene,"visual"|"narration"|"onScreenText">>): CreativePlan {
  if (!plan.scenes.some(s=>s.id===sceneId)) throw new Error("Unknown scene");
  const fields = ["visual","narration","onScreenText"] as const;
  const patch: Partial<CreativeScene> = {};
  for (const field of fields) if (change[field] !== undefined) {
    if (typeof change[field] !== "string" || change[field]!.length > 1000) throw new Error("Invalid scene change");
    patch[field] = change[field];
  }
  return {...plan,scenes:plan.scenes.map(s=>s.id===sceneId?{...s,...patch,status:"draft"}:s),paidGenerationAuthorized:false};
}
