import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const SignupPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      login(data.user, data.token);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create your FitPlanHub account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="trainer">Trainer</option>
          </select>

          <Button className="w-full">Sign Up</Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
