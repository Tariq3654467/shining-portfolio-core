/**
 * Strip payload keys the owner marked private (shown only on their own profile).
 */
export function sanitizePayloadForViewer(
  payload: Record<string, unknown> | null | undefined,
  privateFields: Record<string, boolean> | null | undefined
): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const out: Record<string, unknown> = { ...payload };
  if (!privateFields || typeof privateFields !== "object") return out;
  for (const key of Object.keys(privateFields)) {
    if (privateFields[key]) delete out[key];
  }
  return out;
}

export function payloadAgeNum(payload: Record<string, unknown>): number | null {
  const raw = payload.age;
  if (raw === undefined || raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
