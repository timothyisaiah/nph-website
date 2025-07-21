import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

interface Country {
  value: string;
  label: string;
  flag?: string;
}

interface MobileCountrySelectorProps {
  onCountrySelect: (country: Country) => void;
  onCountryClear?: () => void;
  selectedCountry?: Country | null;
}

const MobileCountrySelector: React.FC<MobileCountrySelectorProps> = ({
  onCountrySelect,
  onCountryClear,
  selectedCountry
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch countries from DHS API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://api.dhsprogram.com/rest/dhs/countries?f=json');
        const data = await response.json();
        const countryOptions = data.Data.map((country: any) => ({
          value: country.DHS_CountryCode,
          label: country.CountryName,
          flag: country.DHS_CountryCode.toLowerCase()
        }));
        setCountries(countryOptions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (selectedOption: Country | null) => {
    if (selectedOption) {
      onCountrySelect(selectedOption);
    } else {
      onCountryClear?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto mb-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-blue-600 leading-tight mb-1">
          Select Your Country
        </h2>
        <p className="text-sm text-gray-600">
          Choose your country to see personalized health data
        </p>
      </div>

      {/* Country Selection */}
      <div className="mb-3">
        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Search for a country..."
          isSearchable
          isLoading={isLoading}
          isClearable={true}
          className="react-select-container"
          classNamePrefix="react-select"
          formatOptionLabel={(option: Country) => (
            <div className="flex items-center">
              <span className="mr-2 text-sm">
                {option.flag ? `🏳️` : '🌍'}
              </span>
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
              color: state.isSelected ? 'white' : 'black',
              fontSize: '14px',
              padding: '8px 12px'
            }),
            menu: (provided) => ({
              ...provided,
              fontSize: '14px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }),
            placeholder: (provided) => ({
              ...provided,
              fontSize: '14px',
              color: '#6B7280'
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: '14px',
              fontWeight: '500'
            }),
            clearIndicator: (provided) => ({
              ...provided,
              color: '#6B7280',
              '&:hover': {
                color: '#374151'
              }
            })
          }}
        />
      </div>

      {/* Description */}
      <div className="text-xs text-gray-500 leading-relaxed">
        <p className="mb-2">
          Your selected country will be highlighted in the globe visualization below and used as a reference point in health data comparisons.
        </p>
        <p className="text-blue-600 font-medium">
          💡 Tip: You can change your selection anytime to explore data from different countries.
        </p>
      </div>
    </motion.div>
  );
};

export default MobileCountrySelector; 