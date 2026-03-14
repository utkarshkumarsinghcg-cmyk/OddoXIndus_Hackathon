import { ChevronDown, Filter } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all gap-2"
        >
          {label === 'Status' ? <Filter className="w-4 h-4 text-gray-400" /> : null}
          <span className="flex-1 text-left">{selected || label}</span>
          <ChevronDown className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 z-20 mt-2 w-56 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                  selected === option.value ? 'bg-indigo-50/50 text-indigo-700 font-medium' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
