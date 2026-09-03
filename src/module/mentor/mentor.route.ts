import { Router } from "express";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/authCheck";
import { mentorController } from "./mentor.controller";

const router = Router();

router.post("/register", mentorController.registerMentor);
router.post(
  "/verify",
  upload.fields([{ name: "documents", maxCount: 5 }]),
  mentorController.verifyMentor,
);
router.post("/approve", auth(Role.ADMIN), mentorController.approveMentor);

export const MentorRoute = router;
