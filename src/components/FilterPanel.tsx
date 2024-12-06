import React, { useCallback, useEffect, useRef } from 'react';
import { Filter as FilterIcon, ChevronDown } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  isDark: boolean;
  options: FilterOptions;
  onFilterChange: (newOptions: FilterOptions) => void;
  universities: string[];
  departments: string[];
  years: string[];
  semesters: string[];
}

function FilterPanel({
  isDark,
  options,
  onFilterChange,
  universities,
  departments,
  years,
  semesters
}: FilterPanelProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = (key: keyof FilterOptions, value: string | number | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const newOptions = { ...options, [key]: value };
      onFilterChange(newOptions);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const renderSelect = (
    label: string,
    key: keyof FilterOptions,
    options: string[],
    placeholder: string = 'Tümü'
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <select
          value={options[key] || ''}
          onChange={(e) => handleChange(key, e.target.value || null)}
          className={`w-full pl-3 pr-10 py-2 rounded-lg appearance-none cursor-pointer
            ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border 
            ${isDark ? 'border-gray-600' : 'border-gray-200'}
            focus:ring-2 focus:ring-blue-500 outline-none`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>
    </div>
  );

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon size={20} className="text-blue-600" />
        <h3 className="font-semibold">Filtrele</h3>
      </div>

      <div className="space-y-4">
        {renderSelect('Üniversite', 'university', universities)}
        {renderSelect('Bölüm', 'department', departments)}
        {renderSelect('Yıl', 'year', years)}
        {renderSelect('Dönem', 'semester', semesters)}

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium mb-1">Sıralama</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={options.sortBy || 'date'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className={`w-full pl-3 pr-10 py-2 rounded-lg appearance-none cursor-pointer
                  ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border 
                  ${isDark ? 'border-gray-600' : 'border-gray-200'}
                  focus:ring-2 focus:ring-blue-500 outline-none`}
              >
                <option value="date">Tarih</option>
                <option value="likes">Beğeni</option>
                <option value="downloads">İndirme</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
            </div>
            <div className="relative flex-1">
              <select
                value={options.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className={`w-full pl-3 pr-10 py-2 rounded-lg appearance-none cursor-pointer
                  ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border 
                  ${isDark ? 'border-gray-600' : 'border-gray-200'}
                  focus:ring-2 focus:ring-blue-500 outline-none`}
              >
                <option value="desc">Azalan</option>
                <option value="asc">Artan</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;