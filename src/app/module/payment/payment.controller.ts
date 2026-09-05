import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/authCheck";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const initiateCheckout = catchAsync(async (req, res) => {
  const checkoutData = await paymentService.initiateCheckout(
    req.params.assignmentId as string,
    req.user as RequestUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Checkout initiated successfully",
    data: checkoutData,
  });
});

export const paymentController = {
  initiateCheckout,
};
