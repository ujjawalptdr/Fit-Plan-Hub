// controllers/planController.js
import User from "../models/User.js";
import Plan from "../models/plan.js";

// create plan (trainer only)
export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create({
      ...req.body,
      trainer: req.user.id // setting the current trainer as owner
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PLANS (Preview Only)
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate("trainer", "name");
    const previewPlans = plans.map(p => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      duration: p.duration,
      trainer: p.trainer.name
    }));
    res.json(previewPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PLAN BY ID WITH ACCESS CONTROL so that only subscribers and owner can see full content 
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate("trainer", "name email");
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Preview version (for non-authenticated or any non-subscribers)
    const preview = {
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      trainer: plan.trainer.name
    };

    if (!req.user) return res.json(preview);

    // Trainer who has created that plan sees full details
    if (req.user.role === "trainer" && plan.trainer._id.toString() === req.user.id)
      return res.json(plan);

    // Check karo if user has purchased this plan
    const user = await User.findById(req.user.id);
    if (user.purchasedPlans.map(String).includes(plan._id.toString()))
      return res.json(plan);

    // else justwe will return preview only
    res.json(preview);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PLAN (Trainer Only)
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Only trainer can delete
    if (req.user.role !== "trainer" || plan.trainer.toString() !== req.user.id){
      return res.status(403).json({ message: "Forbidden: You cannot delete this plan" });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getMyPlans = async (req, res) => {
  try {
    // Safety check
    if (!req.user || req.user.role !== "trainer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const plans = await Plan.find({ trainer: req.user.id });

    res.json(plans);
  } catch (error) {
    console.error("getMyPlans error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
