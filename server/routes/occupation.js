import express from "express";
import {
  createHobbies,
  createOccupation,
  getHobbies,
  getOccupations,
} from "../controllers/occupation.js";

const router = express.Router();

router.get("/", getOccupations);
router.post("/", createOccupation);
router.get("/hobbies", getHobbies);
router.post("/hobbies", createHobbies);

export default router;
