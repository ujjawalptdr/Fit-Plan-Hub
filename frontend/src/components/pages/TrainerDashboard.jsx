import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function TrainerDashboard() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/plans/my");
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      setDeletingId(planId);
      await api.delete(`/plans/${planId}`);
      toast.success("Plan deleted successfully!");
      setPlans(plans.filter((plan) => plan._id !== planId));
    } catch (err) {
      console.error("Failed to delete plan", err);
      toast.error(err.response?.data?.message || "Failed to delete plan");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Trainer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your fitness plans</p>
          </div>

          <button
            onClick={() => navigate("/trainer/create-plan")}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
          >
            <FaPlus /> Create Plan
          </button>
        </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">
            You haven't created any plans yet.
          </p>
          <button
            onClick={() => navigate("/trainer/create-plan")}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {plan.description}
                </p>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <span className="text-sm text-gray-700">
                    📅 {plan.duration}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ${plan.price}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3 border-t pt-4">
                <button
                  onClick={() => navigate(`/plan/${plan._id}`)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2"
                >
                  <FaEdit /> View
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  disabled={deletingId === plan._id}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
