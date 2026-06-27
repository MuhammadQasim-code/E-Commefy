import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { mergeGuestCart } from '../features/cart/cartSlice';
import { validateEmail, validatePassword, validatePhone } from '../utils/validators';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Send payload without confirmPassword
    const { confirmPassword, ...registerPayload } = formData;

    try {
      await dispatch(register(registerPayload)).unwrap();
      
      // Merge guest cart if items exist
      const guestCart = localStorage.getItem('ecommefy_guest_cart');
      if (guestCart) {
        try {
          const items = JSON.parse(guestCart);
          if (items && items.length > 0) {
            await dispatch(mergeGuestCart(items)).unwrap();
          }
        } catch (mergeErr) {
          console.error('Failed to merge guest cart:', mergeErr);
        }
      }
      
      toast.success('Registration successful! Welcome to E-Commefy.');
    } catch (err) {
      toast.error(err || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-scale-in">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-8 md:p-10 shadow-lg backdrop-blur-md">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Get started with E-Commefy today
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-semibold border border-red-500/20 mb-6 text-center">
            {error.message || error || 'Registration failed. Try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
              } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
              } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
              } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
              } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1 leading-normal">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-5 py-3 rounded-xl border ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
              } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-center font-bold text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="text-primary-500 font-bold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
