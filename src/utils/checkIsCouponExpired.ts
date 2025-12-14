import { CouponType } from "../types/couponType";

export function checkIsCouponExpired(coupon: CouponType): boolean {
  if (!coupon.endDate) return false;

  const now = new Date();
  return coupon.endDate.getTime() < now.getTime();
}
