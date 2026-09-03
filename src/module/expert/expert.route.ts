import { Router } from "express";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/authCheck";
import { expertController } from "./expert.controller";

const router = Router();

router.post("/register", expertController.registerExpert);
router.post(
  "/verify",
  upload.fields([{ name: "documents", maxCount: 5 }]),
  expertController.verifyExpert,
);
router.post("/approve", auth(Role.ADMIN), expertController.approveExpert);
router.post(
  "/student-register",
  auth(Role.STUDENT),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  expertController.studentRegisterExpert,
);

export const ExpertRoute = router;
