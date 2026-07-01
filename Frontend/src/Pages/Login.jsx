import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

// ── Password strength ─────────────────────────────────────────
const getStrength = (pw = "") => {
  if (!pw) return null;
  const has8 = pw.length >= 8;
  const hasNum = /\d/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [has8, hasNum, hasUpper, hasSpecial].filter(Boolean).length;
  if (pw.length < 6)
    return {
      label: "Too short",
      color: "bg-red-400",
      text: "text-red-500",
      width: "w-1/4",
    };
  if (score <= 1)
    return {
      label: "Weak",
      color: "bg-red-400",
      text: "text-red-500",
      width: "w-1/4",
    };
  if (score === 2)
    return {
      label: "Fair",
      color: "bg-amber-400",
      text: "text-amber-500",
      width: "w-2/4",
    };
  if (score === 3)
    return {
      label: "Good",
      color: "bg-blue-400",
      text: "text-blue-500",
      width: "w-3/4",
    };
  return {
    label: "Strong",
    color: "bg-emerald-500",
    text: "text-emerald-500",
    width: "w-full",
  };
};

// ── Slide illustrations ───────────────────────────────────────
const CARD =
  "bg-white rounded-2xl shadow-lg w-full h-full flex flex-col p-5 overflow-hidden";

const slides = [
  {
    title: "Welcome back!",
    subtitle: "Start managing your finance faster and better",
    illustration: (
      <div className={CARD}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              My Wallet
            </span>
          </div>
          <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">
            ↑ 12%
          </span>
        </div>
        {/* Balance */}
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
          Total Balance
        </p>
        <p className="text-3xl font-bold text-gray-800 mb-4">₹24,359</p>
        {/* 3 stat chips */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            {
              label: "Income",
              val: "₹55k",
              bg: "bg-green-50",
              text: "text-green-600",
            },
            {
              label: "Spent",
              val: "₹18k",
              bg: "bg-red-50",
              text: "text-red-500",
            },
            {
              label: "Saved",
              val: "₹37k",
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-2 text-center`}>
              <p className={`text-sm font-bold ${s.text}`}>{s.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Track every expense",
    subtitle: "Know exactly where your money goes each month",
    illustration: (
      <div className={CARD}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">Week Overview</p>
          <span className="text-xs bg-blue-50 text-blue-500 font-semibold px-2 py-0.5 rounded-full">
            Apr 10–16
          </span>
        </div>
        {/* 7-day bar chart */}
        <div className="flex items-end justify-between gap-1.5 flex-1 mb-3">
          {[
            { day: "Thu", h: 35, active: false },
            { day: "Fri", h: 60, active: false },
            { day: "Sat", h: 80, active: false },
            { day: "Sun", h: 25, active: false },
            { day: "Mon", h: 55, active: false },
            { day: "Tue", h: 70, active: false },
            { day: "Wed", h: 90, active: true },
          ].map((d) => (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1"
            >
              {d.active && (
                <span className="text-xs font-bold text-blue-600">₹890</span>
              )}
              <div
                className={`w-full rounded-t-md ${d.active ? "bg-blue-500" : "bg-blue-100"}`}
                style={{ height: `${d.h}px` }}
              />
              <span
                className={`text-xs font-medium ${d.active ? "text-blue-600" : "text-gray-400"}`}
              >
                {d.day}
              </span>
            </div>
          ))}
        </div>
        {/* Footer summary */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Week total</p>
            <p className="text-sm font-bold text-gray-700">₹4,215</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Daily avg</p>
            <p className="text-sm font-bold text-gray-700">₹602</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Stay within budget",
    subtitle: "Set limits and get alerts before you overspend",
    illustration: (
      <div className={CARD}>
        <p className="text-sm text-gray-400 font-semibold mb-4">
          Budget Progress
        </p>
        <div className="flex-1 flex flex-col justify-between">
          {[
            { label: "Food", pct: 72, color: "bg-blue-500" },
            { label: "Shopping", pct: 45, color: "bg-amber-400" },
            { label: "Bills", pct: 90, color: "bg-red-500" },
            { label: "Travel", pct: 28, color: "bg-emerald-500" },
          ].map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 font-medium">{b.label}</span>
                <span
                  className={`font-semibold ${b.pct >= 80 ? "text-red-500" : "text-gray-400"}`}
                >
                  {b.pct}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${b.color} h-3 rounded-full`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Visualise your spending",
    subtitle: "Beautiful charts to understand your financial habits",
    illustration: (
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400 font-semibold">
            Monthly Spending
          </p>
          <span className="text-sm text-blue-500 font-semibold">
            ↑ 18% vs last month
          </span>
        </div>
        <div className="flex-1 flex items-end gap-3">
          {[40, 65, 50, 80, 55, 90].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: `${h * 1.5}px`,
                  background: i === 5 ? "#3b82f6" : "#bfdbfe",
                }}
              />
              <span className="text-xs text-gray-400 font-medium">
                {["N", "D", "J", "F", "M", "A"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Export anytime",
    subtitle: "Download your expenses as CSV with one click",
    illustration: (
      <div className={CARD}>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">
          Export Data
        </p>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">expenses.csv</p>
            <p className="text-xs text-gray-400">284 transactions exported</p>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl p-3 overflow-hidden">
          <p className="text-xs text-gray-400 font-semibold font-mono mb-2">
            Date, Merchant, Amount
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              ["16/04", "Swiggy", "₹450"],
              ["15/04", "Uber", "₹180"],
              ["14/04", "Amazon", "₹1,200"],
            ].map(([d, m, a]) => (
              <div
                key={m}
                className="flex justify-between text-xs font-mono text-gray-500 bg-white rounded-lg px-2 py-1"
              >
                <span className="text-gray-400">{d}</span>
                <span className="font-medium text-gray-600">{m}</span>
                <span className="text-blue-500 font-semibold">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

// ── Login Page ────────────────────────────────────────────────
const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const timerRef = useRef(null);

  const strength = getStrength(passwordValue);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 3500);
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] bg-blue-600 flex-col items-center  justify-between gap-8 py-20 px-10 relative overflow-hidden">
        {/* ── Blurred glow blobs ── */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-400 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500 rounded-full opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-300 rounded-full opacity-10 blur-2xl pointer-events-none" />

        {/* ── Dot grid — top left ── */}
        <svg
          className="absolute top-6 left-6 w-28 h-28 opacity-10 pointer-events-none"
          viewBox="0 0 80 80"
        >
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 16 + 8}
                cy={row * 16 + 8}
                r="2"
                fill="white"
              />
            )),
          )}
        </svg>

        <svg
          className="absolute bottom-6 right-6 w-28 h-28 opacity-10 pointer-events-none"
          viewBox="0 0 80 80"
        >
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 16 + 8}
                cy={row * 16 + 8}
                r="2"
                fill="white"
              />
            )),
          )}
        </svg>

        <svg
          className="absolute bottom-16 left-6 w-32 h-20 opacity-15 pointer-events-none"
          viewBox="0 0 120 60"
          fill="none"
        >
          <polyline
            points="0,55 20,42 40,48 60,28 80,18 100,10 120,2"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,60 0,55 20,42 40,48 60,28 80,18 100,10 120,2 120,60"
            fill="white"
            fillOpacity="0.08"
            stroke="none"
          />
          {[0, 20, 40, 60, 80, 100, 120].map((x, i) => {
            const ys = [55, 42, 48, 28, 18, 10, 2];
            return <circle key={x} cx={x} cy={ys[i]} r="3" fill="white" />;
          })}
        </svg>

        {/* ── Large faint ring — mid right ── */}
        <svg
          className="absolute top-1/3 -right-10 w-40 h-40 opacity-10 pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="2" />
          <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="1" />
        </svg>

        {/* ── Rupee symbol — top right ── */}
        <svg
          className="absolute top-8 right-8 w-14 h-14 opacity-10 pointer-events-none"
          viewBox="0 0 60 60"
          fill="none"
        >
          <text
            x="6"
            y="46"
            fontSize="44"
            fill="white"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            ₹
          </text>
        </svg>

        {/* ── Small floating card shadow — top centre ── */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-12 bg-white opacity-5 rounded-xl rotate-6 pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-12 bg-white opacity-5 rounded-xl -rotate-3 pointer-events-none" />

        {/* ── Wallet icon — bottom centre ── */}
        <svg
          className="absolute bottom-32 right-14 w-16 h-16 opacity-10 pointer-events-none"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>

        {/* ── Logo — top left ── */}
        <div className="relative z-10 self-start flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
            <span className="text-blue-600 font-bold text-xs">E</span>
          </div>
          <span className="text-white font-bold">ExpenseTrack</span>
        </div>

        {/* Slide content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 w-full">
          <div className="w-full h-72 flex items-center justify-center transition-all duration-500">
            {slides[current].illustration}
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">
              {slides[current].title}
            </h2>
            <p className="text-blue-200 text-sm mt-2 max-w-xs mx-auto">
              {slides[current].subtitle}
            </p>
          </div>
        </div>

        {/* Dots + arrows */}
        <div className="relative z-10 flex justify-center items-center gap-4">
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-blue-200  transition-colors text-2xl cursor-pointer leading-none"
          >
            ‹
          </button>
          <div className="flex h-full justify-center items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${i === current ? "w-2 h-2 bg-white" : "w-2 h-2 bg-blue-300 hover:bg-blue-100"}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-blue-200  transition-colors text-2xl cursor-pointer leading-none"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm ">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back!
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in to continue managing your finances
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow-2xs p-2 rounded-lg">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
              <div className="absolute left-1 top-1/2 -translate-y-1/2  bg-white shadow-2xs  p-2 rounded-lg">
                <svg
                  className="w-4 h-4 text-blue-400 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="w-full border border-gray-300  rounded-xl pl-11  pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                {...register("password", {
                  required: "Password is required",
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              {strength && (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className={`text-xs font-medium mt-1 ${strength.text}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
