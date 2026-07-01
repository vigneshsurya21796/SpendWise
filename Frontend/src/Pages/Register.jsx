import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

// ── Password strength ─────────────────────────────────────────
const getStrength = (pw = "") => {
  if (!pw) return null;
  const has8    = pw.length >= 8;
  const hasNum  = /\d/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [has8, hasNum, hasUpper, hasSpecial].filter(Boolean).length;
  if (pw.length < 6)  return { label: "Too short", color: "bg-red-400",    text: "text-red-500",    width: "w-1/4" };
  if (score <= 1)     return { label: "Weak",      color: "bg-red-400",    text: "text-red-500",    width: "w-1/4" };
  if (score === 2)    return { label: "Fair",       color: "bg-amber-400",  text: "text-amber-500",  width: "w-2/4" };
  if (score === 3)    return { label: "Good",       color: "bg-blue-400",   text: "text-blue-500",   width: "w-3/4" };
  return               { label: "Strong",     color: "bg-emerald-500", text: "text-emerald-500", width: "w-full" };
};

// ── Feature list shown on left panel ─────────────────────────
const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Visual Analytics",
    desc: "Bar & donut charts to understand your spending patterns",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Budget Alerts",
    desc: "Get notified before you overspend your monthly limit",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "CSV Export",
    desc: "Download all your expenses anytime with one click",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Multi-currency",
    desc: "Track expenses in INR, USD or EUR seamlessly",
  },
];

// ── Register Page ─────────────────────────────────────────────
const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const strength = getStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      setUser(res.data.data);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] bg-blue-600 flex-col items-center justify-center px-12 relative overflow-hidden">

        {/* Blurred glow blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-400 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500 rounded-full opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-300 rounded-full opacity-10 blur-2xl pointer-events-none" />

        {/* Dot grid — top left */}
        <svg className="absolute top-6 left-6 w-28 h-28 opacity-10 pointer-events-none" viewBox="0 0 80 80">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 16 + 8} cy={row * 16 + 8} r="2" fill="white" />
            ))
          )}
        </svg>

        {/* Dot grid — bottom right */}
        <svg className="absolute bottom-6 right-6 w-28 h-28 opacity-10 pointer-events-none" viewBox="0 0 80 80">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 16 + 8} cy={row * 16 + 8} r="2" fill="white" />
            ))
          )}
        </svg>

        {/* Rising chart line — bottom left */}
        <svg className="absolute bottom-16 left-6 w-32 h-20 opacity-15 pointer-events-none" viewBox="0 0 120 60" fill="none">
          <polyline points="0,55 20,42 40,48 60,28 80,18 100,10 120,2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="0,60 0,55 20,42 40,48 60,28 80,18 100,10 120,2 120,60" fill="white" fillOpacity="0.08" stroke="none" />
          {[0,20,40,60,80,100,120].map((x, i) => {
            const ys = [55,42,48,28,18,10,2];
            return <circle key={x} cx={x} cy={ys[i]} r="3" fill="white" />;
          })}
        </svg>

        {/* Large faint rings — mid right */}
        <svg className="absolute top-1/3 -right-10 w-40 h-40 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="2" />
          <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="1" />
        </svg>

        {/* ₹ symbol — top right */}
        <svg className="absolute top-8 right-8 w-14 h-14 opacity-10 pointer-events-none" viewBox="0 0 60 60" fill="none">
          <text x="6" y="46" fontSize="44" fill="white" fontWeight="bold" fontFamily="sans-serif">₹</text>
        </svg>

        {/* Floating card ghosts */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-12 bg-white opacity-5 rounded-xl rotate-6 pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-12 bg-white opacity-5 rounded-xl -rotate-3 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-xs">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-lg">SpendWise</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Start for free</h2>
          <p className="text-blue-200 text-sm mb-10">
            Everything you need to take control of your finances — in one place.
          </p>

          {/* Feature list */}
          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-blue-300 text-xs mt-10">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-8">
            Fill in the details below to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <div className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow-xs p-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow-xs p-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow-xs p-2 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-xs font-medium ${strength.text}`}>{strength.label}</p>
                    <p className="text-xs text-gray-400">Use uppercase, number & symbol for strong</p>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors mt-2"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
