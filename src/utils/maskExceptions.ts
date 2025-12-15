import {
  badRequest,
  internalFailure,
  notFound,
  validationError,
  couponNotApplicable,
  couponExpired,
  conflict,
} from "./httpResponse";

// A simple structured error object type
interface KnownError {
  status?: number;
  code?: string;
  message?: string;
  details?: any;
}

export function maskExceptions(fn: Function) {
  return async function (req: any, res: any, next: any) {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.error(error);

      const e: KnownError = error || {};

      // Zod validation error support
      if (Array.isArray(e?.details) && e?.message?.toLowerCase?.().includes("validation")) {
        return validationError(res, "Validation failed", e.details);
      }

      // Not found
      if (e.status === 404 || e.code === "NOT_FOUND") {
        return notFound(res, e.message || "Resource not found");
      }

      // Bad request
      if (e.status === 400 && e.code === "BAD_REQUEST") {
        return badRequest(res, e.message || "Bad request", e.details);
      }

      // Conflict example
      if (e.status === 409 || e.code === "CONFLICT") {
        return conflict(res, e.message || "Conflict error", e.details);
      }

      // Coupon specific errors
      if (e.code === "COUPON_NOT_APPLICABLE") {
        return couponNotApplicable(res, e.message, e.details);
      }

      if (e.code === "COUPON_EXPIRED") {
        return couponExpired(res, e.message);
      }

      // If the error looks like a validation error from body parsing
      if (e.status === 422 || e.code === "VALIDATION_ERROR") {
        return validationError(
          res,
          e.message || "Validation error",
          e.details
        );
      }

      // Fallback to generic internal error
      return internalFailure(res, "Internal server error");
    }
  };
}
