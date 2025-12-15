import { Request, Response } from "express";
import {
  applyCoupon,
  checkIsCouponApplicable,
  getApplicableCoupons,
} from "../services/discountService";
import { cartSchema } from "../model/cartSchema";
import { getCouponById } from "../services/couponService";

export function applyCouponController(req: Request, res: Response) {
  const cart = req.body;
  const couponId = req.params.couponId;

  // Validate cart input
  const validation = cartSchema.safeParse(cart);
  if (!validation.success) {
    throw {
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Cart validation failed",
      details: validation.error.issues,
    };
  }

  // Check coupon existence
  const coupon = getCouponById(couponId);
  if (!coupon) {
    throw {
      status: 404,
      code: "NOT_FOUND",
      message: "Coupon not found",
    };
  }

  // Check if coupon applicable
  const isApplicable = checkIsCouponApplicable(coupon, cart);
  if (!isApplicable) {
    throw {
      status: 400,
      code: "COUPON_NOT_APPLICABLE",
      message: "Coupon is not applicable to this cart",
    };
  }

  const discountResult = applyCoupon(cart, coupon);

  // Success response
  return res.status(200).json({
    success: true,
    statusCode: 200,
    data: discountResult,
  });
}

export function getApplicableCouponsController(req: Request, res: Response) {
  const cart = req.body;

  // Validate cart input
  const validation = cartSchema.safeParse(cart);
  if (!validation.success) {
    throw {
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Cart validation failed",
      details: validation.error.issues,
    };
  }

  const applicableCoupons = getApplicableCoupons(cart);

  return res.status(200).json({
    success: true,
    statusCode: 200,
    data: applicableCoupons,
  });
}
