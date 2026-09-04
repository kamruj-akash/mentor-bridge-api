import { Router } from "express";
import { Role } from "../../../../prisma/src/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/authCheck";
import { multipartDataValidationZod } from "../../middleware/validation";
import { assignmentController } from "./assignment.controller";
import { CreateAssignmentZod } from "./assignment.validations";

const router = Router();

router.post(
  "/create",
  upload.single("attachment"),
  auth(Role.STUDENT),
  multipartDataValidationZod(CreateAssignmentZod),
  assignmentController.createAssignment,
);
router.get("/all-open", assignmentController.getOpenAssignments);

export const AssignmentRoutes = router;
