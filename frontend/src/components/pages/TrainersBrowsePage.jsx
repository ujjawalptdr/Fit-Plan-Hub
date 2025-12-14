import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import Navbar from "../Navbar";
import toast from "react-hot-toast";
import { FaUserTie, FaCheckCircle } from "react-icons/fa";

function TrainersBrowsePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTrainers();
  }, [user, navigate]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/trainers");
      setTrainers(response.data.trainers || []);
      setFollowingList(response.data.following || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (trainerId) => {
    try {
      await api.post(`/users/follow/${trainerId}`);
      setFollowingList([...followingList, trainerId]);
      toast.success("Following trainer!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow trainer");
    }
  };

  const handleUnfollow = async (trainerId) => {
    try {
      await api.post(`/users/unfollow/${trainerId}`);
      setFollowingList(followingList.filter((id) => id !== trainerId));
      toast.success("Unfollowed trainer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfollow trainer");
    }
  };

  const isFollowing = (trainerId) => followingList.includes(trainerId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading trainers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Trainers
          </h1>
          <p className="text-gray-600">
            Find and follow professional fitness trainers
          </p>
        </div>

        {trainers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaUserTie className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              No trainers available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col items-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {trainer.name?.charAt(0).toUpperCase()}
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                  {trainer.name}
                </h3>
                <p className="text-sm text-gray-500 text-center mb-4">
                  {trainer.email}
                </p>

                <div className="w-full bg-gray-50 rounded-lg p-3 text-center mb-6">
                  <p className="text-gray-700">
                    <span className="font-bold text-green-600">
                      {trainer.plansCount || 0}
                    </span>{" "}
                    <span className="text-gray-600">Plans</span>
                  </p>
                </div>

                <div className="w-full">
                  {isFollowing(trainer._id) ? (
                    <button
                      onClick={() => handleUnfollow(trainer._id)}
                      className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Following
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(trainer._id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainersBrowsePage;
