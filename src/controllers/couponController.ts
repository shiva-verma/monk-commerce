import { Request, Response } from "express";
import * as httpResponse from "../utils/httpResponse";
import {
  listCoupons,
  getCouponById,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../services/couponService";
import {
  BXGYCouponSchema,
  cartWiseCouponSchema,
  productWiseCouponSchema,
} from "../model/couponSchema";

// List all coupons
export function listCouponsController(req: Request, res: Response) {
  const query = req.query.showExpired;
  const showExpired = query === "true";
  const allCoupons = listCoupons({ showExpired });

  httpResponse.ok(res, allCoupons);
}

// Get coupon by ID
export function getCouponByIdController(req: Request, res: Response) {
  const couponId = req.params.couponId;
  const coupon = getCouponById(couponId);

  if (!coupon) {
    throw {
      status: 404,
      code: "NOT_FOUND",
      message: "Coupon not found",
    };
  }

  httpResponse.ok(res, coupon);
}

// Create a new coupon
export function createCouponController(req: Request, res: Response) {
  const couponData = req.body;

  if (!couponData || !("discountType" in couponData)) {
    throw {
      status: 400,
      code: "BAD_REQUEST",
      message: "Invalid request body",
    };
  }

  let validationStatus: any;
  switch (couponData.discountType) {
    case "CART_WISE":
      validationStatus = cartWiseCouponSchema.safeParse(couponData);
      break;

    case "PRODUCT_WISE":
      validationStatus = productWiseCouponSchema.safeParse(couponData);
      break;

    case "BXGY":
      validationStatus = BXGYCouponSchema.safeParse(couponData);
      break;

    default:
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid discount type",
      };
  }

  if (!validationStatus.success) {
    throw {
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Coupon validation failed",
      details: validationStatus.error.issues,
    };
  }

  if (couponData.endDate) {
    const endDate = new Date(couponData.endDate);
    if (isNaN(endDate.getTime())) {
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid date format for endDate",
      };
    }
    if (endDate < new Date()) {
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "End date cannot be in the past",
      };
    }
    couponData.endDate = endDate;
  }

  const newCoupon = createCoupon(couponData);
  httpResponse.created(res, newCoupon);
}

// Update coupon
export function updateCouponController(req: Request, res: Response) {
  const couponId = req.params.couponId;
  const couponData = req.body;

  if (!couponId) {
    throw {
      status: 400,
      code: "BAD_REQUEST",
      message: "Coupon ID is required",
    };
  }

  if (!couponData || !("discountType" in couponData)) {
    throw {
      status: 400,
      code: "BAD_REQUEST",
      message: "Invalid request body",
    };
  }

  let validationStatus: any;
  switch (couponData.discountType) {
    case "CART_WISE":
      validationStatus = cartWiseCouponSchema.safeParse(couponData);
      break;

    case "PRODUCT_WISE":
      validationStatus = productWiseCouponSchema.safeParse(couponData);
      break;

    case "BXGY":
      validationStatus = BXGYCouponSchema.safeParse(couponData);
      break;

    default:
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid discount type",
      };
  }

  if (!validationStatus.success) {
    throw {
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Coupon validation failed",
      details: validationStatus.error.issues,
    };
  }

  if (couponData.endDate) {
    const endDate = new Date(couponData.endDate);
    if (isNaN(endDate.getTime())) {
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid date format for endDate",
      };
    }
    if (endDate < new Date()) {
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "End date cannot be in the past",
      };
    }
    couponData.endDate = endDate;
  }

  const existingCoupon = getCouponById(couponId);
  if (!existingCoupon) {
    throw {
      status: 404,
      code: "NOT_FOUND",
      message: "Coupon not found",
    };
  }

  const updatedCoupon = updateCoupon(couponId, couponData);
  httpResponse.ok(res, updatedCoupon);
}

// Delete coupon
export function deleteCouponController(req: Request, res: Response) {
  const couponId = req.params.couponId;

  const coupon = getCouponById(couponId);
  if (!coupon) {
    throw {
      status: 404,
      code: "NOT_FOUND",
      message: "Coupon not found",
    };
  }

  deleteCoupon(couponId);
  httpResponse.okNoResponse(res);
}
