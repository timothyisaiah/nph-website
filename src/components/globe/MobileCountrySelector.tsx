import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { COUNTRY_OPTIONS, type CountryOption } from '../../data/countryOptions';

const Select = lazy(() => import('react-select'));

interface MobileCountrySelectorProps {
  onCountrySelect: (country: CountryOption) => void;
  onCountryClear?: () => void;
  selectedCountry?: CountryOption | null;
  compact?: boolean;
}

const MobileCountrySelector: React.FC<MobileCountrySelectorProps> = ({
  onCountrySelect,
  onCountryClear,
  selectedCountry,
  compact = false,
}) => {
  const handleCountryChange = (selectedOption: CountryOption | null) => {
    if (selectedOption) onCountrySelect(selectedOption);
    else onCountryClear?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-sm mx-auto bg-white rounded-xl shadow-xl border border-gray-100 ${compact ? 'p-4' : 'mb-6 p-6'}`}
    >
      <div className="mb-3">
        <h2 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-blue-600 leading-tight mb-1`}>
          Which country interests you most?
        </h2>
        <p className="text-sm text-gray-600">
          Choose a country to focus the globe and explore its health data.
        </p>
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-slate-100" aria-label="Loading country search" />}>
        <Select<CountryOption, false>
          options={COUNTRY_OPTIONS}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Search for a country..."
          isSearchable
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🌍</span>
              <span className="text-sm">{option.label}</span>
            </div>
          )}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: '#3B82F6',
              borderWidth: '2px',
              borderRadius: '8px',
              minHeight: '48px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
              color: state.isSelected ? 'white' : 'black',
              fontSize: '14px',
              padding: '8px 12px',
            }),
            menu: (provided) => ({ ...provided, fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }),
          }}
        />
      </Suspense>

      {!compact && (
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Your selection is highlighted on the globe and used in the health-data drawer. You can change it at any time.
        </p>
      )}
    </motion.div>
  );
};

export default MobileCountrySelector;
