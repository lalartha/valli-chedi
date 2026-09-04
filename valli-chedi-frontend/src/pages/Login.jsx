import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Name is required.');
          setLoading(false);
          return;
        }
        const result = await signup(email, password, name);
        if (!result.session) {
          setError('Account created! Please check your email to confirm your account before signing in (or disable email confirmation in Supabase).');
          setIsSignup(false);
          setLoading(false);
          return;
        }
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        {/* Logo section */}
        <div className="login__brand">
          <div className="login__logo">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" fill="var(--sap-green-light)" />
              <path d="M40 64c0-16-8-24-16-28 4 0 8 2 12 6 0-8 2-16 8-24 4 8 6 16 6 24 4-4 8-6 12-6-8 4-16 12-16 28h-6z" fill="var(--sap-green)" />
              <circle cx="34" cy="36" r="3" fill="var(--brown)" />
              <circle cx="46" cy="36" r="3" fill="var(--brown)" />
              <path d="M36 44c2 2 6 2 8 0" stroke="var(--brown)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="login__title">VALLI CHEDI</h1>
          <p className="login__tagline">Permission granted. Consequences pending. 🌿</p>
        </div>

        {/* Form */}
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className="login__heading">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="login__subheading">
            {isSignup
              ? 'Start tracking your vallis.'
              : 'The chedi awaits your return.'}
          </p>

          {isSignup && (
            <div className="login__field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                required
              />
            </div>
          )}

          <div className="login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="login__error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login__submit"
            disabled={loading}
          >
            {loading && <span className="login__spinner" />}
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

          <p className="login__switch">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
