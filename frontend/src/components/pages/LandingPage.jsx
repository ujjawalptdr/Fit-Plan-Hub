import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";
import Navbar from "../Navbar.jsx";

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/plans");
        setPlans(data);
      } catch {
        console.error("Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading plans...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Available Fitness Plans
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{plan.title}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {plan.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-bold">
                  ₹{plan.price}
                </span>
                <span className="text-sm text-gray-500">
                  By {plan.trainer}
                </span>
              </div>

              <Link
                to={`/plan/${plan._id}`}
                className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
