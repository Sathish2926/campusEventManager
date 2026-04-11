import React from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/mockData';

const PREDEFINED_VENUES = [
  "Main Auditorium",
  "Computer Science Lab",
  "Open Air Theater",
  "Student Center Gallery",
  "Sports Complex",
  "Library Seminar Hall",
];

const CreateEvent = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create Event</h1>
        <p className="text-slate-500 mt-1">Publish a new event to the campus</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Event created!"); }}>
          <Input 
            label="Event Title" 
            placeholder="e.g. Annual Tech Symposium" 
            required 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Date" 
              type="date" 
              required 
            />
            <Input 
              label="Time" 
              type="time" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Venue</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white transition-colors duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                defaultValue=""
                required
              >
                <option value="" disabled>Select venue...</option>
                {PREDEFINED_VENUES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white transition-colors duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                defaultValue=""
                required
              >
                <option value="" disabled>Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Cover Image URL</label>
             <Input 
              placeholder="https://example.com/image.jpg" 
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
               className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white transition-colors duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] resize-y"
               placeholder="Tell students what this event is about..."
               required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit">
              Publish Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
