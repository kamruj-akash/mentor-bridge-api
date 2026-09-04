import { Router } from "express";
import { Role } from "../../../../prisma/src/generated/prisma/enums";
import { auth } from "../../middleware/authCheck";
import { dataValidationZod } from "../../middleware/validation";
import { bidController } from "./bid.controller";
import { BidAssignmentZod } from "./bid.validations";

const router = Router();
router.post(
  "/bid",
  auth(Role.EXPERT),
  dataValidationZod(BidAssignmentZod),
  bidController.bidAssignment,
);

export const AssignmentBidRoutes = router;
