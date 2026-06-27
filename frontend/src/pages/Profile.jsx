import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice';
import { validatePhone } from '../utils/validators';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

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
    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUpdating(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !user) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and contact details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Col: Avatar display */}
        <div className="md:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 text-center shadow-sm">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center font-bold text-white text-3xl uppercase shadow-md shadow-primary-500/20 mx-auto">
            {user?.name?.substring(0, 2) || 'US'}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-250 mt-4 truncate">
            {user?.name}
          </h3>
          <span className="inline-block text-xs font-bold text-slate-400 mt-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full capitalize">
            {user?.role || 'Customer'}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 break-all">
            {user?.email}
          </p>
        </div>

        {/* Right Col: Edit fields */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-slate-450 dark:text-slate-500 cursor-not-allowed focus:outline-none"
              />
              <p className="text-[10px] text-slate-450 dark:text-slate-550 mt-1">
                Email cannot be modified.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                } bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 transition-all`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3.5 bg-primary-650 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
