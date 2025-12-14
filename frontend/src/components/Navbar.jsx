import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          FitPlanHub
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user?.role === "trainer" && (
                <Link
                  to="/trainer/dashboard"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
              )}

              {user?.role === "user" && (
                <>
                  <Link
                    to="/feed"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    My Feed
                  </Link>
                  <Link
                    to="/trainers"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Trainers
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
