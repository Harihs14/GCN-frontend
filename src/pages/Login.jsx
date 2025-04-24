import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiPlus,
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiHome,
  FiAlertCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/wlogo.png";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    organization: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Organization selection state
  const [organizations, setOrganizations] = useState([]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  // Fetch organizations when in signup mode
  useEffect(() => {
    if (!isLogin) fetchOrganizations();
  }, [isLogin]);

  // Fetch organizations from the backend
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/organizations"
      );
      setOrganizations(response.data);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
      setOrganizations([]);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle between login and signup modes
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ username: "", email: "", password: "", organization: "" });
  };

  // Handle organization selection
  const handleOrgChange = (org, e) => {
    if (e) e.preventDefault();
    if (org === "add-new") setIsAddingOrg(true);
    else {
      setFormData((prev) => ({ ...prev, organization: org }));
      setShowOrgDropdown(false);
    }
  };

  // Handle adding a new organization
  const handleAddOrg = (e) => {
    if (e) e.preventDefault();
    if (newOrgName.trim()) {
      setFormData((prev) => ({ ...prev, organization: newOrgName.trim() }));
      setIsAddingOrg(false);
      setNewOrgName("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/signup";
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            organization: formData.organization,
          };
      const response = await axios.post(endpoint, payload);
      setSuccess(true);
      if (isLogin) {
        // Store user data in localStorage
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", formData.username);
        if (response.data.email)
          localStorage.setItem("email", response.data.email);
        if (response.data.organization)
          localStorage.setItem("organization", response.data.organization);
        setTimeout(() => navigate("/home"), 800);
      } else {
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white font-poppins">
      {/* Home-style Header */}
      <header className="bg-zinc-900/70 backdrop-blur-lg border-b border-blue-500/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-lg animate-pulse"></div>
              <img
                src={logo}
                alt="GCN Logo"
                className="h-8 w-8 relative z-10 drop-shadow-glow"
              />
            </div>
            <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              GCN
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
          </motion.div>
        </div>
      </header>
      {/* Centered Login Form */}
      <div
        className="container mx-auto px-4 py-12 flex justify-center items-center"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
          {/* Title and description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Join the GCN compliance network"}
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center text-red-400 text-sm"
              >
                <FiAlertCircle className="mr-2" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-lg flex items-center text-green-400 text-sm"
              >
                <span className="mr-2">✓</span>
                <span>
                  {isLogin
                    ? "Login successful!"
                    : "Account created successfully!"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
            </div>

            {/* Email (Signup) */}
            {!isLogin && (
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                />
              </div>
            )}

            {/* Organization (Signup) */}
            {!isLogin && (
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="w-full">
                  {isAddingOrg ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter organization name"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddOrg(e);
                        }}
                        className="w-full pl-10 pr-20 py-3 bg-white/10 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddOrg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                      >
                        <FiPlus size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-700 rounded-lg text-white cursor-pointer flex justify-between items-center"
                      >
                        <span
                          className={
                            formData.organization
                              ? "text-white"
                              : "text-gray-400"
                          }
                        >
                          {formData.organization || "Select Organization"}
                        </span>
                        <FiChevronDown
                          className={`transition-transform duration-300 ${
                            showOrgDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {showOrgDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-white/10 border border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                          {organizations.length > 0 ? (
                            organizations.map((org, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-white"
                                onClick={(e) => handleOrgChange(org.name, e)}
                              >
                                <FiHome className="text-blue-400" size={14} />
                                <span>{org.name}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-400 italic">
                              No organizations found
                            </div>
                          )}
                          <div
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer border-t border-gray-700 flex items-center gap-2 text-blue-400"
                            onClick={(e) => handleOrgChange("add-new", e)}
                          >
                            <FiPlus size={14} />
                            <span>Add New Organization</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={
                loading || (!isLogin && !formData.organization && !isAddingOrg)
              }
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                loading || (!isLogin && !formData.organization && !isAddingOrg)
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              }`}
            >
              <span className="mr-2">
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </span>
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <FiArrowRight />
              )}
            </motion.button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleAuthMode}
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
