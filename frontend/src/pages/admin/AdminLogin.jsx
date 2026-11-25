import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/admin/dashboard';

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e50914] font-display text-2xl font-extrabold text-white shadow-[0_0_32px_-4px_rgba(229,9,20,0.7)]">
            R
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Ronak Admin Panel
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Sign in to manage projects, services, profile, and enquiries.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 pr-11 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3 text-xs text-red-200"
              >
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-[#ff303b]"
                />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e50914] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_-6px_rgba(229,9,20,0.75)] transition-colors hover:bg-[#b20710] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Back to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
