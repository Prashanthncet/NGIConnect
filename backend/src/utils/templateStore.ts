import { EmailTemplate, IEmailTemplate } from "../models/EmailTemplate";

// In-memory cache for high-concurrency performance (10,000+ registrations)
let cachedTemplate: IEmailTemplate | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export async function getActiveEmailTemplate(): Promise<IEmailTemplate | null> {
  const now = Date.now();
  if (cachedTemplate && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedTemplate;
  }

  try {
    let template = await EmailTemplate.findOne({ identifier: "default" });
    if (!template) {
      template = await EmailTemplate.create({ identifier: "default" });
    }
    cachedTemplate = template;
    cacheTimestamp = now;
    return template;
  } catch (error) {
    console.error("[TemplateStore] Error fetching active email template:", error);
    return null;
  }
}

export function invalidateEmailTemplateCache(): void {
  cachedTemplate = null;
  cacheTimestamp = 0;
}
