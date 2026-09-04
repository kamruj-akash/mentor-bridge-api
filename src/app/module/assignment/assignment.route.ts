import { Router } from "express";
import { Role } from "../../../../prisma/src/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/authCheck";
import { multipartDataValidationZod } from "../../middleware/validation";
import { assignmentController } from "./assignment.controller";
import { CreateAssignmentZod } from "./assignment.validations";

const router = Router();

// all routes are prefixed with /api/v1/assignment
router.post(
  "/create",
  upload.single("attachment"),
  auth(Role.STUDENT),
  multipartDataValidationZod(CreateAssignmentZod),
  assignmentController.createAssignment,
);
router.get("/feed", assignmentController.getOpenAssignments);
router.get("/:assignmentId/get", assignmentController.getAssignmentById);
router.get(
  "/my-assignments",
  auth(Role.STUDENT),
  assignmentController.getMyAssignments,
);

export const AssignmentRoutes = router;
