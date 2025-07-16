import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

interface Country {
  value: string;
  label: string;
  flag?: string;
}

interface CountrySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCountrySelect: (country: Country) => void;
  onCountryClear?: () => void;
  selectedCountry?: Country | null;
}

const CountrySelectionDialog: React.FC<CountrySelectionDialogProps> = ({
  isOpen,
  onClose,
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

    if (isOpen) {
      fetchCountries();
    }
  }, [isOpen]);

  const handleCountryChange = (selectedOption: Country | null) => {
    if (selectedOption) {
      onCountrySelect(selectedOption);
    } else {
      // When selection is cleared, call the reset function
      onCountryClear?.();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 left-4 w-2/3 max-w-sm bg-white rounded-lg shadow-xl p-4 z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-blue-600 leading-tight">
          Which country interests you most?
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>
      </div>

      {/* Country Selection */}
      <div className="mb-3">
        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Select a country..."
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
              <span className="text-xs">{option.label}</span>
            </div>
          )}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: '#3B82F6',
              borderWidth: '1px',
              borderRadius: '6px',
              minHeight: '36px',
              fontSize: '12px'
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
              color: state.isSelected ? 'white' : 'black',
              fontSize: '12px',
              padding: '6px 12px'
            }),
            menu: (provided) => ({
              ...provided,
              fontSize: '12px'
            }),
            placeholder: (provided) => ({
              ...provided,
              fontSize: '12px'
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: '12px'
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
      <p className="text-gray-600 text-xs mb-3 leading-relaxed">
        Choose your home country or any country of interest as a point of comparison in all stories. 
        The selected country will be highlighted in visualizations.
      </p>

      {/* Call to Action */}
      <div className="text-xs text-gray-600">
        The globe shows data from the story on health indicators.{' '}
        <span className="text-green-600 font-medium cursor-pointer hover:underline">
          Read the story on health indicators
        </span>{' '}
        to find out more!
      </div>
    </motion.div>
  );
};

export default CountrySelectionDialog; 