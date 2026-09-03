import { Router } from "express";
import { upload } from "../../lib/multer";
import { mentorController } from "./mentor.controller";

const router = Router();

router.post("/register", mentorController.registerMentor);
router.post(
  "/verify-otp",
  upload.fields([{ name: "documents", maxCount: 5 }]),
  mentorController.verifyMentor,
);

export const MentorRoute = router;
