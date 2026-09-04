import { Router } from "express";
import { assignmentController } from "./assignment.controller";

const router = Router();

router.post(
  "/create",
  //   dataValidationZod(),
  assignmentController.createAssignment,
);

router.get("/all-open", assignmentController.getOpenAssignments);

export const AssignmentRoutes = router;
