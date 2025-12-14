import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["user", "trainer"],
    default: "user"
  },

  followedTrainers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  purchasedPlans: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
