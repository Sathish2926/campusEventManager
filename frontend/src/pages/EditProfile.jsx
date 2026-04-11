import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/routeHelpers';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [preview, setPreview] = useState(user?.profileImage || '');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    year: user?.year || '',
    profileImage: user?.profileImage || '',
  });

  useEffect(() => {
    if (user) {
      setPreview(user.profileImage || '');
      setFormData({
        name: user.name || '',
        department: user.department || '',
        year: user.year || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFormData({ ...formData, profileImage: objectUrl });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(formData);
    navigate(getHomePath(user.role), { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Edit Profile</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Keep your details current for a cleaner dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            {preview ? <img src={preview} alt="Profile preview" className="h-full w-full object-cover" /> : null}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="Name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            required
          />
          <Input
            label="Department"
            value={formData.department}
            onChange={(event) => setFormData({ ...formData, department: event.target.value })}
          />
          <Input
            label="Year"
            type="number"
            min="1"
            value={formData.year}
            onChange={(event) => setFormData({ ...formData, year: event.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={() => navigate(getHomePath(user.role))}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;