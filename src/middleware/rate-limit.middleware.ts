import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api-error";

import { rateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function authRateLimit(request: NextRequest): void {
  const ip = getClientIp(request);

  const result = rateLimit(`auth:${ip}`, 5, 60 * 1000);

  if (!result.success) {
    throw new ApiError(
      "Terlalu banyak percobaan. Coba lagi nanti.",
      429,
      "RATE_LIMIT_EXCEEDED",
    );
  }
}
