import { Router } from "express";
import { Role } from "../../../../prisma/src/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/authCheck";
import { assignmentController } from "./assignment.controller";

const router = Router();

router.post(
  "/create",
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  auth(Role.STUDENT),
  assignmentController.createAssignment,
);
router.get("/all-open", assignmentController.getOpenAssignments);

export const AssignmentRoutes = router;
