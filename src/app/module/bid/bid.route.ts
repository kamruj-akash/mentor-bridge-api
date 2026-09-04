import { Router } from "express";
import { Role } from "../../../../prisma/src/generated/prisma/enums";
import { auth } from "../../middleware/authCheck";
import { dataValidationZod } from "../../middleware/validation";
import { bidController } from "./bid.controller";
import { BidAssignmentZod } from "./bid.validations";

const router = Router();
router.post(
  "/make-bid",
  auth(Role.EXPERT),
  dataValidationZod(BidAssignmentZod),
  bidController.bidAssignment,
);
router.get(
  "/assignment/:assignmentId",
  auth(Role.STUDENT),
  bidController.getBidByAssignmentId,
);
router.get("/my-bids", auth(Role.EXPERT), bidController.getMyBids);
router.delete("/bids/:bidId", auth(Role.EXPERT), bidController.deleteBid);

export const BidRoutes = router;
