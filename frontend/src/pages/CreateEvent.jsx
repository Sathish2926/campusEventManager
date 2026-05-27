import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/mockData';
import { useEvents } from '../context/EventsContext';

const PREDEFINED_VENUES = [
  "Main Auditorium",
  "Computer Science Lab",
  "Open Air Theater",
  "Student Center Gallery",
  "Sports Complex",
  "Library Seminar Hall",
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [imageMode, setImageMode] = useState('url');
  const [imagePreview, setImagePreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    imageUrl: '',
    description: '',
  });

  const previewSource = useMemo(() => {
    return imagePreview || formData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
  }, [formData.imageUrl, imagePreview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.time || !formData.venue || !formData.category) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    const selectedImage = imageMode === 'upload' ? imagePreview : formData.imageUrl;

    if (!selectedImage) {
      setErrorMessage('Please provide an event image');
      return;
    }

    setSubmitting(true);

    addEvent({
      ...formData,
      image: selectedImage,
    })
      .then(() => {
        setFormData({
          title: '',
          date: '',
          time: '',
          venue: '',
          category: '',
          imageUrl: '',
          description: '',
        });
        setImagePreview('');
        setImageMode('url');
        navigate('/organizer');
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Failed to create event');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Create Event</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Publish a new event to the campus</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          <img src={previewSource} alt="Event preview" className="h-56 w-full object-cover" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Event Title" 
            placeholder="e.g. Annual Tech Symposium" 
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            required 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Date" 
              type="date" 
              value={formData.date}
              onChange={(event) => setFormData({ ...formData, date: event.target.value })}
              required 
            />
            <Input 
              label="Time" 
              type="time" 
              value={formData.time}
              onChange={(event) => setFormData({ ...formData, time: event.target.value })}
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Venue</label>
              <select 
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-colors duration-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                value={formData.venue}
                onChange={(event) => setFormData({ ...formData, venue: event.target.value })}
                required
              >
                <option value="" disabled>Select venue...</option>
                {PREDEFINED_VENUES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition-colors duration-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                required
              >
                <option value="" disabled>Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Event Image</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setImageMode('upload')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${imageMode === 'upload' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'}`}>
                Upload image
              </button>
              <button type="button" onClick={() => setImageMode('url')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${imageMode === 'url' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'}`}>
                Image URL
              </button>
            </div>
            {imageMode === 'upload' ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            ) : (
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
              />
            )}
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea 
               className="min-h-[120px] w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition-colors duration-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
               placeholder="Tell students what this event is about..."
               value={formData.description}
               onChange={(event) => setFormData({ ...formData, description: event.target.value })}
               required
            ></textarea>
          </div>

          {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

          <div className="flex justify-end gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
