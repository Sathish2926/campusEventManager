import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/routeHelpers';

const initialValues = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  department: '',
  year: '',
};

const Signup = () => {
  const navigate = useNavigate();
  const { user, signup } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordRules = useMemo(
    () => ({
      minLength: values.password.length >= 8,
      hasUpper: /[A-Z]/.test(values.password),
      hasLower: /[a-z]/.test(values.password),
      hasNumber: /\d/.test(values.password),
      hasSymbol: /[^A-Za-z\d]/.test(values.password),
    }),
    [values.password]
  );

  useEffect(() => {
    if (user) {
      navigate(getHomePath(user.role), { replace: true });
    }
  }, [navigate, user]);

  const validateForm = () => {
    if (!values.name.trim() || !values.email.trim() || !values.password.trim() || !values.role) {
      return 'Please fill all required fields';
    }

    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      return 'Please enter a valid email address';
    }

    if (!Object.values(passwordRules).every(Boolean)) {
      return 'Password must be at least 8 chars and include upper, lower, number, and symbol';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const createdUser = await signup(values);
      navigate(getHomePath(createdUser.role), { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] bg-gradient-primary p-[1px] shadow-soft-hover">
          <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Campus Event Manager</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Create your account first, then login seamlessly.</h1>
            <p className="mt-4 max-w-xl text-slate-300">First-time users register here and get routed to their student, organizer, or admin workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Sign up</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Create an account</h2>
          </div>

          <div className="space-y-5">
            <Input label="Name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required />
            <Input label="Email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required />
            <Input label="Password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  value={values.role}
                  onChange={(event) => setValues({ ...values, role: event.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input label="Department" value={values.department} onChange={(event) => setValues({ ...values, department: event.target.value })} />
            </div>

            <Input label="Year" type="number" min="1" value={values.year} onChange={(event) => setValues({ ...values, year: event.target.value })} />

            {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
          </div>

          <Button type="submit" className="mt-8 w-full justify-center py-3 text-base" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;