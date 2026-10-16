# Creative Agent V1 — Creatify-inspired workflow

This is an incremental **planning-only** implementation. It does not claim parity with Creatify or provide generated videos yet.

## Implemented
- `POST /api/creative-agent/plan` accepts `productUrl`, `brand`, `product`, optional `objective`, `audience`, `format`, `provider`.
- Returns a 4-scene 16-second storyboard with provider choice (KIE default, Replicate optional) and explicit `paidGenerationAuthorized: false`.
- `reviseScene(plan, sceneId, change)` modifies a targeted scene without modifying other scenes.
- No network fetch, no paid-generation requests, no secrets embedded, no deployment to production.

Example:
```json
{"productUrl":"https://novelia-shop.com/products/velia-2","brand":"NOVELIA","product":"Velia-2 postpartum shapewear","objective":"Explain fit and comfort without medical claims","format":"9:16","provider":"kie"}
```

## Next implementation gates
1. Audit current authentication and add authentication, authorization, rate limiting, persistence, and tenant isolation before production deployment.
2. Add server-side product ingestion with SSRF defense, timeout, size limits, image permissions, and verified factual claims. A supplied URL is presently validated but **not fetched or analyzed**.
3. Store brand kit, approved product references, storyboard and per-scene assets; implement revision history.
4. Integrate KIE adapter with job polling/webhooks, idempotency, explicit cost estimates and opt-in approval before any paid job. Optionally add Replicate adapter after benchmarks.
5. Audio/music licensing, compositing, captions, QA and export with human review.
6. Test: unit tests, API auth, scene-level regenerations, provider failure recovery, product fidelity and actual output quality.

## Security
The planning route is NOT production-ready because it is unauthenticated. Guard it behind app auth before deploying. Do not enable automatic paid generations by default.
