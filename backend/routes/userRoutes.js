import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  subscribePlan,
  followTrainer,
  unfollowTrainer,
  getFeed,
  getTrainers
} from "../controllers/userController.js";

const router = express.Router();

router.post("/subscribe/:planId", auth, subscribePlan);
router.post("/follow/:trainerId", auth, followTrainer);
router.post("/unfollow/:trainerId", auth, unfollowTrainer);
router.get("/feed", auth, getFeed);
router.get("/trainers", auth, getTrainers);

export default router;
