import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Plane, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";

type AuthMode = "login" | "register";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, signIn } = useWayNexa();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";
  const redirect = (location.state as { from?: string } | null)?.from || "/profile";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 12) return setError("Use at least 12 characters for your password.");
    if (!isLogin && name.trim().length < 2) return setError("Tell us your name so we can personalise your trips.");
    setError("");
    setBusy(true);
    try {
      if (isLogin) await signIn(email, password);
      else await register(name.trim(), email, password);
      navigate(redirect, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The account service could not complete your request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#fbfaf7] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#183927] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1500&q=85"
          alt="Coastal travel destination"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#183927]/70 to-[#183927]" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5 text-xl font-black tracking-[.16em]">
          <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#183927]">
            <Plane size={19} fill="currentColor" />
          </span>
          WayNexa
        </Link>
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d8fbcc]">Travel, made personal</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-.05em]">Keep every good idea close.</h1>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Save beautiful places, build thoughtful itineraries and keep your plans in one place.
          </p>
          <ul className="mt-9 space-y-4 text-sm font-semibold text-white/85">
            <li className="flex items-center gap-3"><CheckCircle2 size={19} className="text-[#d8fbcc]" /> Save destinations and stays</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={19} className="text-[#d8fbcc]" /> Make and manage your trips</li>
            <li className="flex items-center gap-3"><CheckCircle2 size={19} className="text-[#d8fbcc]" /> Get tailored AI trip ideas</li>
          </ul>
        </div>
        <p className="relative z-10 text-sm text-white/45">© {new Date().getFullYear()} WayNexa</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-[.14em] lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-[#183927] text-white">
              <Plane size={17} fill="currentColor" />
            </span>
            WayNexa
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[.18em] text-[#4a8558]">
            {isLogin ? "Welcome back" : "Start your journey"}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-.045em]">
            {isLogin ? "Sign in to WayNexa" : "Create your account"}
          </h2>
          <p className="mt-3 text-slate-500">
            {isLogin ? "Your saved places and travel plans are waiting." : "A calmer way to turn travel ideas into plans."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Your name</span>
                <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 ring-[#4a8558] focus-within:ring-2">
                  <UserRound size={18} className="text-slate-400" />
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full bg-transparent py-3.5 outline-none"
                    placeholder="How should we call you?"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email address</span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 ring-[#4a8558] focus-within:ring-2">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent py-3.5 outline-none"
                  placeholder="you@example.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-sm font-bold">
                Password
                {isLogin && <Link to="/forgot-password" className="font-semibold text-[#387a43] hover:underline">Forgot password?</Link>}
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 ring-[#4a8558] focus-within:ring-2">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  minLength={12}
                  maxLength={1024}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent py-3.5 outline-none"
                  placeholder="At least 12 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183927] px-5 py-4 font-bold text-white transition hover:bg-[#245239] disabled:opacity-60"
            >
              {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            {isLogin ? "New to WayNexa?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/register" : "/login"} className="font-bold text-[#387a43] hover:underline">
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Your account, saved travel data and activity history are stored in WayNexa’s MySQL database.
            The configured site owner can review account activity. Never enter payment details here.
          </p>
        </div>
      </section>
    </main>
  );
}
