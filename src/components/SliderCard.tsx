import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderCardProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  isDark?: boolean;
}

const SliderCard: React.FC<SliderCardProps> = ({ title, icon, items, renderItem, isDark }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(items.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(items.length / 3) - 1 : prevIndex - 1
    );
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={prevSlide}
            className={`p-2 rounded-full transition-all ${
              isDark 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className={`p-2 rounded-full transition-all ${
              isDark 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
            {items
              .slice(currentIndex * 3, (currentIndex + 1) * 3)
              .map((item, index) => renderItem(item, index))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SliderCard;
