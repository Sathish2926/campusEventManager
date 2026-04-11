import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children, title }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full py-4">
      {title && (
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2 -mx-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child) => (
          <div className="min-w-[300px] sm:min-w-[350px] snap-start">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
