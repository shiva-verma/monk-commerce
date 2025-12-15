import { Response } from "express";

type ErrorDetails = any;

function sendSuccessResponse(res: Response, data: any, statusCode: number) {
  res.status(statusCode).json({
    success: true,
    statusCode,
    data,
  });
}

function sendErrorResponse(
  res: Response,
  message: string,
  statusCode: number,
  code: string = "ERROR",
  details?: ErrorDetails
) {
  const errorPayload: any = {
    success: false,
    statusCode,
    error: {
      message,
      code,
    },
  };

  if (details) {
    errorPayload.error.details = details;
  }

  res.status(statusCode).json(errorPayload);
}

export function ok(res: Response, data: any) {
  sendSuccessResponse(res, data, 200);
}

export function created(res: Response, data: any) {
  sendSuccessResponse(res, data, 201);
}

export function okNoResponse(res: Response) {
  res.status(204).send();
}

export function badRequest(
  res: Response,
  message = "Bad request",
  details?: ErrorDetails
) {
  sendErrorResponse(res, message, 400, "BAD_REQUEST", details);
}

export function notFound(res: Response, message = "Resource not found") {
  sendErrorResponse(res, message, 404, "NOT_FOUND");
}

export function conflict(
  res: Response,
  message = "Conflict error",
  details?: ErrorDetails
) {
  sendErrorResponse(res, message, 409, "CONFLICT", details);
}

export function validationError(
  res: Response,
  message = "Validation error",
  details?: ErrorDetails
) {
  sendErrorResponse(res, message, 422, "VALIDATION_ERROR", details);
}

export function couponNotApplicable(
  res: Response,
  message = "Coupon not applicable",
  details?: ErrorDetails
) {
  sendErrorResponse(res, message, 400, "COUPON_NOT_APPLICABLE", details);
}

export function couponExpired(
  res: Response,
  message = "Coupon expired"
) {
  sendErrorResponse(res, message, 400, "COUPON_EXPIRED");
}

export function internalFailure(
  res: Response,
  message = "Internal server error",
  details?: ErrorDetails
) {
  sendErrorResponse(res, message, 500, "INTERNAL_ERROR", details);
}
