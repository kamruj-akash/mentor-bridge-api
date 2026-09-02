import { Router } from "express";
import { mentorController } from "./mentor.controller";

const router = Router();

router.post("/register", mentorController.registerMentor);

export const MentorRoute = router;
