import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/routeHelpers';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      navigate(getHomePath(user.role), { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Email and password are required');
      return;
    }

    setSubmitting(true);

    try {
      const nextUser = await login(formData);
      navigate(getHomePath(nextUser.role), { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-gradient-primary p-[1px] shadow-soft-hover">
          <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Campus Event Manager</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Login only if you are already registered.
            </h1>
            <p className="mt-4 max-w-xl text-slate-300">
              Use your registered email and password. New users should create an account first.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Sign in</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h2>
          </div>

          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
            />

            {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
          </div>

          <Button type="submit" className="mt-8 w-full justify-center py-3 text-base" disabled={submitting}>
            {submitting ? 'Logging In...' : 'Login to Continue'}
          </Button>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            First time here?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;