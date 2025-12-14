import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import Navbar from "../Navbar";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";

function UserFeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFeed();
  }, [user, navigate]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/feed");
      setFeed(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await api.post(`/users/subscribe/${planId}`);
      toast.success("Subscribed to plan!");
      fetchFeed();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
    }
  };

  const handleViewPlan = (planId) => {
    navigate(`/plan/${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading feed...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Feed</h1>
          <p className="text-gray-600">Plans from trainers you follow</p>
        </div>

        {feed.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-4">
              <FaShoppingCart className="mx-auto text-4xl text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 mb-2">
              No plans available from trainers you follow yet.
            </p>
            <p className="text-gray-500 mb-6">
              Follow some trainers to see their plans!
            </p>
            <button
              onClick={() => navigate("/trainers")}
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
            >
              Explore Trainers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-green-600 font-semibold mb-3">
                    by {plan.trainer?.name || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      📅 {plan.duration}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${plan.price}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => handleViewPlan(plan._id)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
                  >
                    Subscribe
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

export default UserFeedPage;
