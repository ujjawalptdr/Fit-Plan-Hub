import User from "../models/User.js";
import Plan from "../models/plan.js";

export const subscribePlan = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.purchasedPlans.includes(req.params.planId)) {
    user.purchasedPlans.push(req.params.planId);
    await user.save();
  }

  res.json({ message: "Subscribed successfully" });
};

export const followTrainer = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.followedTrainers.includes(req.params.trainerId)) {
    user.followedTrainers.push(req.params.trainerId);
    await user.save();
  }

  res.json({ message: "Trainer followed" });
};

export const unfollowTrainer = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.followedTrainers = user.followedTrainers.filter(
    id => id.toString() !== req.params.trainerId
  );
  await user.save();

  res.json({ message: "Trainer unfollowed" });
};

export const getFeed = async (req, res) => {
  const user = await User.findById(req.user.id);

  const plans = await Plan.find({
    trainer: { $in: user.followedTrainers }
  }).populate("trainer", "name");

  res.json(plans);
};

export const getTrainers = async (req, res) => {
  try {
    // Get all trainers from User model
    const trainers = await User.find({ role: "trainer" }).select("name email _id");
    
    // Get the current user to see who they follow
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.followedTrainers.map(id => id.toString());

    // Add plan count for each trainer
    const trainersWithPlans = await Promise.all(
      trainers.map(async (trainer) => {
        const planCount = await Plan.countDocuments({ trainer: trainer._id });
        return {
          _id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          plansCount: planCount
        };
      })
    );

    res.json({
      trainers: trainersWithPlans,
      following: followingIds
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};