import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import api from "../../api/api.js";

const PlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (err) {
        console.error("Error loading plan", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading plan...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Plan not found
      </div>
    );
  }

  const isLocked = !plan.planContent;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{plan.title}</h1>

          <p className="text-gray-600 mt-2">{plan.description}</p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-semibold text-indigo-600">
              ₹{plan.price}
            </span>

            <div className="text-sm text-gray-500 text-right">
              <p>Trainer: {plan.trainer?.name || "Unknown"}</p>

              {plan.trainer?.email && (
                <a
                  href={`mailto:${plan.trainer.email}`}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Contact Trainer - {plan.trainer.email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* LOCKED VIEW */}
        {isLocked ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Full Plan Locked 🔒
            </h2>

            <p className="text-gray-600 mt-2">
              Subscribe to unlock workouts, meals, and expert guidance.
            </p>

            {!token ? (
              <p className="mt-4 text-indigo-600 font-medium">
                Login to purchase this plan
              </p>
            ) : (
              <Link to={"/feed"}>
              <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
                Buy Plan
              </button>
              </Link>
              
            )}
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            <section className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Overview
              </h2>
              <p className="text-gray-600">{plan.planContent.overview}</p>
            </section>

            {/* WORKOUT PLAN */}
            <section className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Workout Plan
              </h2>

              {plan.planContent.exercisePlan.map((week) => (
                <div key={week.week} className="mb-4">
                  <h3 className="font-medium text-indigo-600">
                    Week {week.week}: {week.goal}
                  </h3>

                  {week.days.map((day, index) => (
                    <div key={index} className="ml-4 mt-2">
                      <p className="font-medium text-gray-700">
                        {day.day} — {day.workoutType}
                      </p>

                      <ul className="list-disc ml-5 text-gray-600 text-sm">
                        {day.exercises.map((ex, i) => (
                          <li key={i}>
                            {ex.name} — {ex.sets} x {ex.reps}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </section>

            {/* MEAL PLAN */}
            <section className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Meal Plan
              </h2>

              <p className="text-gray-600 mb-4">
                {plan.planContent.mealPlan.guidelines}
              </p>

              {plan.planContent.mealPlan.weeklyMeals.map((day, i) => (
                <div key={i} className="mb-3">
                  <h4 className="font-medium text-indigo-600">Day - {day.day}</h4>
                  <p className="text-sm text-gray-600">
                    Breakfast: {day.meals.breakfast}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lunch: {day.meals.lunch}
                  </p>
                  <p className="text-sm text-gray-600">
                    Dinner: {day.meals.dinner}
                  </p>
                  <p className="text-sm text-gray-600">
                    Snacks: {day.meals.snacks}
                  </p>
                </div>
              ))}
            </section>

            {/* EXTRA GUIDANCE */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Extra Guidance
              </h2>
              <p className="text-gray-600">
                Supplements: {plan.planContent.extras.supplements}
              </p>
              <p className="text-gray-600">
                Recovery: {plan.planContent.extras.recoveryTips}
              </p>
              <p className="text-gray-600">
                Lifestyle: {plan.planContent.extras.lifestyleTips}
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;
