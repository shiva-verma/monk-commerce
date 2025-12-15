import { Router, Request, Response } from "express";
import {
  getCouponByIdController,
  listCouponsController,
  createCouponController,
  deleteCouponController,
  updateCouponController,
} from "../controllers/couponController";
import {
  applyCouponController,
  getApplicableCouponsController,
} from "../controllers/discountController";
import { maskExceptions } from "../utils/maskExceptions";
import { notFound } from "../utils/httpResponse";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      status: "OK",
      message: "Discount service is running",
      timestamp: new Date().toISOString(),
    },
  });
});

// Coupon management routes
router.get("/coupons", maskExceptions(listCouponsController));
router.get("/coupons/:couponId", maskExceptions(getCouponByIdController));
router.post("/coupons", maskExceptions(createCouponController));
router.put("/coupons/:couponId", maskExceptions(updateCouponController));
router.delete("/coupons/:couponId", maskExceptions(deleteCouponController));

// Discount application routes
router.post(
  "/applicable-coupons",
  maskExceptions(getApplicableCouponsController)
);
router.post("/apply-coupon/:couponId", maskExceptions(applyCouponController));

// Catch all for invalid paths
router.all("*", (req: Request, res: Response) => {
  notFound(res, "Endpoint not found");
});

export default router;
