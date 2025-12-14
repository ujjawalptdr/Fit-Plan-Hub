import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  title: String,

  // preview
  description: String,

  price: Number,
  duration: String,

  // locked full content
  planContent: {
    overview: String,

    exercisePlan: [
      {
        week: Number,
        goal: String,
        days: [
          {
            day: String,
            workoutType: String,
            exercises: [
              {
                name: String,
                sets: String,
                reps: String,
                rest: String
              }
            ],
            notes: String
          }
        ]
      }
    ],

    mealPlan: {
      guidelines: String,
      weeklyMeals: [
        {
          day: String,
          meals: {
            breakfast: String,
            lunch: String,
            dinner: String,
            snacks: String
          }
        }
      ]
    },

    extras: {
      supplements: String,
      recoveryTips: String,
      lifestyleTips: String
    }
  },

  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
