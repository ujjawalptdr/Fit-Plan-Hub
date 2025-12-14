import express from "express";
import auth from "../middlewares/authMiddleware.js";
import role from "../middlewares/roleMiddleware.js";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  deletePlan,
  getMyPlans 
} from "../controllers/planController.js";

const router = express.Router();

router.post("/", auth, role("trainer"), createPlan);
router.get("/", getAllPlans);
router.get("/my", auth, getMyPlans);
router.get("/:id", auth, getPlanById);
router.delete("/:id", auth, role("trainer"), deletePlan);

export default router;
