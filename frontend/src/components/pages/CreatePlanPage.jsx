import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api/api";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";

function CreatePlanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    planContent: {
      overview: "",
      exercisePlan: [],
      mealPlan: {
        guidelines: "",
        weeklyMeals: []
      },
      extras: {
        supplements: "",
        recoveryTips: "",
        lifestyleTips: ""
      }
    }
  });

  const handleBasicInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanContentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        [name]: value
      }
    }));
  };

  const handleMealGuidelinesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        mealPlan: {
          ...prev.planContent.mealPlan,
          guidelines: e.target.value
        }
      }
    }));
  };

  const handleExtrasChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        extras: {
          ...prev.planContent.extras,
          [name]: value
        }
      }
    }));
  };

  // Exercise Week Management
  const addWeek = () => {
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        exercisePlan: [
          ...prev.planContent.exercisePlan,
          { week: prev.planContent.exercisePlan.length + 1, goal: "", days: [] }
        ]
      }
    }));
  };

  const removeWeek = (weekIndex) => {
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        exercisePlan: prev.planContent.exercisePlan.filter((_, i) => i !== weekIndex)
      }
    }));
  };

  const updateWeekGoal = (weekIndex, goal) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].goal = goal;
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const addDay = (weekIndex) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days.push({ day: "", workoutType: "", exercises: [], notes: "" });
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const removeDay = (weekIndex, dayIndex) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days = newPlan[weekIndex].days.filter((_, i) => i !== dayIndex);
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const updateDay = (weekIndex, dayIndex, field, value) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days[dayIndex][field] = value;
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const addExercise = (weekIndex, dayIndex) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days[dayIndex].exercises.push({
        name: "",
        sets: "",
        reps: "",
        rest: ""
      });
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const removeExercise = (weekIndex, dayIndex, exerciseIndex) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days[dayIndex].exercises = newPlan[weekIndex].days[dayIndex].exercises.filter(
        (_, i) => i !== exerciseIndex
      );
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  const updateExercise = (weekIndex, dayIndex, exerciseIndex, field, value) => {
    setFormData((prev) => {
      const newPlan = [...prev.planContent.exercisePlan];
      newPlan[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value;
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          exercisePlan: newPlan
        }
      };
    });
  };

  // Meal Plan Management
  const addMealDay = () => {
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        mealPlan: {
          ...prev.planContent.mealPlan,
          weeklyMeals: [
            ...prev.planContent.mealPlan.weeklyMeals,
            { day: "", meals: { breakfast: "", lunch: "", dinner: "", snacks: "" } }
          ]
        }
      }
    }));
  };

  const removeMealDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      planContent: {
        ...prev.planContent,
        mealPlan: {
          ...prev.planContent.mealPlan,
          weeklyMeals: prev.planContent.mealPlan.weeklyMeals.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateMealDay = (index, field, value) => {
    setFormData((prev) => {
      const newMeals = [...prev.planContent.mealPlan.weeklyMeals];
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        newMeals[index][parent][child] = value;
      } else {
        newMeals[index][field] = value;
      }
      return {
        ...prev,
        planContent: {
          ...prev.planContent,
          mealPlan: {
            ...prev.planContent.mealPlan,
            weeklyMeals: newMeals
          }
        }
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.duration
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/plans", formData);
      toast.success("Plan created successfully!");
      navigate("/trainer/dashboard");
    } catch (error) {
      console.error("Error creating plan:", error);
      toast.error(error.response?.data?.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/trainer/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-semibold"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Form Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create New Plan</h1>
          <p className="text-gray-600 mt-2">
            Create a comprehensive fitness plan with exercises and meal plans
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* =============== BASIC INFORMATION =============== */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleBasicInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 12-Week Weight Loss Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleBasicInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="99.99"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleBasicInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of your plan..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleBasicInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Duration</option>
                <option value="4 weeks">4 weeks</option>
                <option value="8 weeks">8 weeks</option>
                <option value="12 weeks">12 weeks</option>
                <option value="16 weeks">16 weeks</option>
                <option value="24 weeks">24 weeks</option>
              </select>
            </div>
          </div>

          {/* =============== OVERVIEW =============== */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Overview</h2>
            <textarea
              name="overview"
              value={formData.planContent.overview}
              onChange={handlePlanContentChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Write an overview of your plan..."
            ></textarea>
          </div>

          {/* =============== EXERCISE PLAN =============== */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Exercise Plan</h2>
              <button
                type="button"
                onClick={addWeek}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaPlus /> Add Week
              </button>
            </div>

            {formData.planContent.exercisePlan.length === 0 ? (
              <p className="text-gray-500 mb-4">No weeks added yet. Click "Add Week" to start.</p>
            ) : (
              <div className="space-y-6">
                {formData.planContent.exercisePlan.map((week, weekIndex) => (
                  <div key={weekIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Week {week.week}</h3>
                        <input
                          type="text"
                          value={week.goal}
                          onChange={(e) => updateWeekGoal(weekIndex, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Week goal (e.g., Upper body strength)"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWeek(weekIndex)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Days in Week */}
                    <div className="ml-4 space-y-4 mb-4">
                      {week.days.map((day, dayIndex) => (
                        <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={day.day}
                                onChange={(e) => updateDay(weekIndex, dayIndex, "day", e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                                placeholder="Day (e.g., Monday)"
                              />
                              <input
                                type="text"
                                value={day.workoutType}
                                onChange={(e) => updateDay(weekIndex, dayIndex, "workoutType", e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                                placeholder="Workout type (e.g., Cardio)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDay(weekIndex, dayIndex)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>

                          <textarea
                            value={day.notes}
                            onChange={(e) => updateDay(weekIndex, dayIndex, "notes", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Day notes..."
                            rows="2"
                          ></textarea>

                          {/* Exercises */}
                          <div className="ml-4 bg-gray-100 p-3 rounded mb-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-700">Exercises</span>
                              <button
                                type="button"
                                onClick={() => addExercise(weekIndex, dayIndex)}
                                className="text-green-500 hover:text-green-700 text-sm"
                              >
                                + Add Exercise
                              </button>
                            </div>

                            <div className="space-y-2">
                              {day.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="bg-white p-3 rounded border border-gray-200 grid grid-cols-5 gap-2">
                                  <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, "name", e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Name"
                                  />
                                  <input
                                    type="text"
                                    value={exercise.sets}
                                    onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, "sets", e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Sets"
                                  />
                                  <input
                                    type="text"
                                    value={exercise.reps}
                                    onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, "reps", e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Reps"
                                  />
                                  <input
                                    type="text"
                                    value={exercise.rest}
                                    onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, "rest", e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Rest"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeExercise(weekIndex, dayIndex, exerciseIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addDay(weekIndex)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                      >
                        + Add Day
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =============== MEAL PLAN =============== */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meal Plan</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Guidelines
              </label>
              <textarea
                value={formData.planContent.mealPlan.guidelines}
                onChange={handleMealGuidelinesChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="General meal guidelines and nutritional advice..."
              ></textarea>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Weekly Meals</h3>
              <button
                type="button"
                onClick={addMealDay}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaPlus /> Add Day
              </button>
            </div>

            {formData.planContent.mealPlan.weeklyMeals.length === 0 ? (
              <p className="text-gray-500 mb-4">No meal days added yet. Click "Add Day" to start.</p>
            ) : (
              <div className="space-y-4">
                {formData.planContent.mealPlan.weeklyMeals.map((mealDay, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <input
                        type="text"
                        value={mealDay.day}
                        onChange={(e) => updateMealDay(index, "day", e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Day (e.g., Monday)"
                      />
                      <button
                        type="button"
                        onClick={() => removeMealDay(index)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={mealDay.meals.breakfast}
                        onChange={(e) => updateMealDay(index, "meals.breakfast", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Breakfast"
                      />
                      <input
                        type="text"
                        value={mealDay.meals.lunch}
                        onChange={(e) => updateMealDay(index, "meals.lunch", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Lunch"
                      />
                      <input
                        type="text"
                        value={mealDay.meals.dinner}
                        onChange={(e) => updateMealDay(index, "meals.dinner", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Dinner"
                      />
                      <input
                        type="text"
                        value={mealDay.meals.snacks}
                        onChange={(e) => updateMealDay(index, "meals.snacks", e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Snacks"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =============== EXTRAS =============== */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Extras</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplements
                </label>
                <textarea
                  name="supplements"
                  value={formData.planContent.extras.supplements}
                  onChange={handleExtrasChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Recommended supplements..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recovery Tips
                </label>
                <textarea
                  name="recoveryTips"
                  value={formData.planContent.extras.recoveryTips}
                  onChange={handleExtrasChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Recovery tips and techniques..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lifestyle Tips
                </label>
                <textarea
                  name="lifestyleTips"
                  value={formData.planContent.extras.lifestyleTips}
                  onChange={handleExtrasChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Lifestyle and wellness tips..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* =============== SUBMIT BUTTONS =============== */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/trainer/dashboard")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlanPage;
