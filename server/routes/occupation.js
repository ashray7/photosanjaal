import express from "express";
import { createOccupation, getOccupations } from "../controllers/occupation.js";

const router = express.Router();

router.get("/", getOccupations);
router.post("/", createOccupation);

export default router;
