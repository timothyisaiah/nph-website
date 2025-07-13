import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useIndicator } from '../../context/IndicatorContext';
import Select from 'react-select';

interface Country {
  CountryName: string;
  DHS_CountryCode: string;
  ISO_Code: string;
  Regional_Indicator: string;
}

interface Indicator {
  IndicatorId: string;
  Label: string;
  Definition: string;
  MeasurementType: string;
  DataType: string;
  SurveyType?: string;
  IndicatorOrder?: number;
}

interface DataPoint {
  CountryName: string;
  SurveyYear: number;
  Value: number;
  CharacteristicLabel?: string;
  SurveyType?: string;
}

type VisualizationType = 'table' | 'bar' | 'line';

const DataCanvas: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { selectedIndicator, setSelectedIndicator } = useIndicator();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  // Change selectedCountry to selectedCountries (array)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ start: 2010, end: 2023 });
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('table');
  // Add state for characteristics and selected breakdowns
  const [characteristics, setCharacteristics] = useState<any[]>([]);
  const [selectedBreakdowns, setSelectedBreakdowns] = useState<string[]>(['Total']);

  // Set selected indicator from URL params or context
  useEffect(() => {
    const indicatorFromUrl = searchParams.get('indicator');
    if (indicatorFromUrl && typeof indicatorFromUrl === 'string' && indicatorFromUrl !== selectedIndicator) {
      setSelectedIndicator(indicatorFromUrl);
    }
  }, [searchParams, setSelectedIndicator, selectedIndicator]);

  // Fetch indicators and countries on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const [indicatorsRes, countriesRes] = await Promise.all([
          axios.get('https://api.dhsprogram.com/rest/dhs/indicators', {
            params: {
              returnFields: 'IndicatorId,Label,Definition,MeasurementType,DataType',
              f: 'json'
            }
          }),
          axios.get('https://api.dhsprogram.com/rest/dhs/countries', {
            params: {
              returnFields: 'CountryName,DHS_CountryCode,ISO_Code,Regional_Indicator',
              f: 'json'
            }
          })
        ]);

        // Process indicators to ensure unique entries
        const processedIndicators = indicatorsRes.data.Data.reduce((acc: Indicator[], curr: Indicator) => {
          // Create a unique key combining IndicatorId and SurveyType if available
          const existingIndicator = acc.find(
            ind => ind.IndicatorId === curr.IndicatorId && ind.SurveyType === curr.SurveyType
          );
          
          if (!existingIndicator) {
            acc.push(curr);
          }
          return acc;
        }, []);

        // Sort indicators by IndicatorOrder if available, then by Label
        const sortedIndicators = processedIndicators.sort((a: Indicator, b: Indicator) => {
          if (a.IndicatorOrder && b.IndicatorOrder) {
            return a.IndicatorOrder - b.IndicatorOrder;
          }
          return a.Label.localeCompare(b.Label);
        });

        setIndicators(sortedIndicators);
        setCountries(countriesRes.data.Data);
      } catch (err) {
        setError('Failed to load metadata. Please try again later.');
        console.error('Error fetching metadata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Fetch breakdowns (characteristics) from data API by extracting unique CharacteristicLabel values
  useEffect(() => {
    const fetchBreakdowns = async () => {
      if (!selectedIndicator || !selectedCountries.length) {
        setCharacteristics([{ CharacteristicID: 'Total', CharacteristicLabel: 'Total' }]);
        setSelectedBreakdowns(['Total']);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get('https://api.dhsprogram.com/rest/dhs/data', {
          params: {
            indicatorIds: selectedIndicator,
            countryIds: selectedCountries.join(','),
            surveyYearStart: 1990,
            surveyYearEnd: new Date().getFullYear(),
            returnFields: 'CharacteristicLabel',
            f: 'json',
          },
        });
        const labels = Array.from(
          new Set(res.data.Data.map((d: any) => d.CharacteristicLabel || 'Total'))
        ) as string[];
        const chars = labels.map((label: string) => ({
          CharacteristicID: label,
          CharacteristicLabel: label,
        }));
        setCharacteristics(chars.length ? chars : [{ CharacteristicID: 'Total', CharacteristicLabel: 'Total' }]);
        setSelectedBreakdowns(['Total']);
      } catch (err) {
        setError('Failed to load breakdowns.');
        setCharacteristics([{ CharacteristicID: 'Total', CharacteristicLabel: 'Total' }]);
        setSelectedBreakdowns(['Total']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBreakdowns();
  }, [selectedIndicator, selectedCountries]);

  // Fetch data when selections change
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedIndicator || !selectedCountries.length) return;
      try {
        setIsLoading(true);
        setError(null);
        let params: any = {
          indicatorIds: selectedIndicator,
          countryIds: selectedCountries.join(','),
          surveyYearStart: yearRange.start,
          surveyYearEnd: yearRange.end,
          returnFields: 'CountryName,SurveyYear,Value,CharacteristicLabel',
          f: 'json',
        };
        // If not just 'Total', add characteristics param
        if (
          selectedBreakdowns.length > 0 &&
          !(selectedBreakdowns.length === 1 && selectedBreakdowns[0] === 'Total')
        ) {
          params.characteristics = selectedBreakdowns
            .filter((id) => id !== 'Total')
            .join(',');
        }
        const response = await axios.get('https://api.dhsprogram.com/rest/dhs/data', {
          params,
        });
        setData(response.data.Data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedIndicator, selectedCountries, yearRange, selectedBreakdowns]);

  // Generate unique key for indicators
  const getIndicatorKey = (indicator: Indicator) => {
    return `${indicator.IndicatorId}_${indicator.SurveyType || 'default'}`;
  };

  // Color palette for countries
  const countryColors = [
    '#4F46E5', '#16A34A', '#F59E42', '#E11D48', '#6366F1', '#FBBF24', '#10B981', '#F472B6', '#0EA5E9', '#A21CAF',
  ];

  // Helper: get color for a country
  const getCountryColor = (country: string) => {
    const idx = countries.findIndex((c) => c.CountryName === country);
    return countryColors[idx % countryColors.length];
  };

  // Prepare chart data: group by SurveyYear, then by country and breakdown
  const chartData = React.useMemo(() => {
    // Group by year
    const years = Array.from(new Set(data.map((d) => d.SurveyYear))).sort();
    return years.map((year) => {
      const row: any = { SurveyYear: year };
      data.forEach((d) => {
        if (d.SurveyYear === year) {
          // Key: CountryName + (if breakdowns, CharacteristicLabel)
          const key = selectedBreakdowns.length > 1 && d.CharacteristicLabel
            ? `${d.CountryName} - ${d.CharacteristicLabel}`
            : d.CountryName;
          row[key] = d.Value;
        }
      });
      return row;
    });
  }, [data, selectedBreakdowns]);

  // Get all country/breakdown keys for chart series
  const chartKeys = React.useMemo(() => {
    const keys = new Set<string>();
    data.forEach((d) => {
      const key = selectedBreakdowns.length > 1 && d.CharacteristicLabel
        ? `${d.CountryName} - ${d.CharacteristicLabel}`
        : d.CountryName;
      keys.add(key);
    });
    return Array.from(keys);
  }, [data, selectedBreakdowns]);

  // Map countries to react-select options
  const countryOptions = countries.map((country) => ({
    value: country.DHS_CountryCode,
    label: country.CountryName,
  }));

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'bar':
        return (
          <div className="h-[500px] bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="SurveyYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartKeys.map((key, idx) => (
                  <Bar key={key} dataKey={key} fill={countryColors[idx % countryColors.length]} name={key} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className="h-[500px] bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Trend Line</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="SurveyYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartKeys.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={countryColors[idx % countryColors.length]}
                    name={key}
                    dot={{ fill: countryColors[idx % countryColors.length] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'table':
      default:
        // Sort table rows by country, then by breakdown, then by year
        const sortedData = [...data].sort((a, b) => {
          if (a.CountryName !== b.CountryName) return a.CountryName.localeCompare(b.CountryName);
          if ((a.CharacteristicLabel || '') !== (b.CharacteristicLabel || '')) return (a.CharacteristicLabel || '').localeCompare(b.CharacteristicLabel || '');
          return a.SurveyYear - b.SurveyYear;
        });
        return (
          <div className="overflow-x-auto bg-gray-50 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Characteristic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={`${item.CountryName}_${item.SurveyYear}_${item.CharacteristicLabel}_${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.CountryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.SurveyYear}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.Value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.CharacteristicLabel || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.SurveyType || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">DHS Program Data Explorer</h2>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Indicator
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedIndicator || ''}
            onChange={(e) => setSelectedIndicator(e.target.value)}
          >
            <option value="">Select an indicator...</option>
            {indicators.map((indicator) => (
              <option 
                key={getIndicatorKey(indicator)} 
                value={indicator.IndicatorId}
                title={indicator.Definition}
              >
                {indicator.Label} {indicator.SurveyType ? `(${indicator.SurveyType})` : ''}
              </option>
            ))}
          </select>
          {selectedIndicator && (
            <p className="mt-2 text-sm text-gray-500">
              {indicators.find(i => i.IndicatorId === selectedIndicator)?.Definition || ''}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Country (multiple allowed)
          </label>
          <Select
            isMulti
            options={countryOptions}
            value={countryOptions.filter((opt) => selectedCountries.includes(opt.value))}
            onChange={(selected) => {
              setSelectedCountries(selected ? selected.map((opt) => opt.value) : []);
            }}
            classNamePrefix="react-select"
            placeholder="Select countries..."
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey Year Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="1990"
              max="2023"
              value={yearRange.start}
              onChange={(e) => setYearRange({ ...yearRange, start: parseInt(e.target.value) })}
              className="w-24 p-2 border rounded-md"
            />
            <span className="self-center">to</span>
            <input
              type="number"
              min="1990"
              max="2023"
              value={yearRange.end}
              onChange={(e) => setYearRange({ ...yearRange, end: parseInt(e.target.value) })}
              className="w-24 p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Breakdown selection UI */}
      {Array.isArray(characteristics) && characteristics.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Breakdown by:</label>
          <div className="flex flex-wrap gap-4">
            {characteristics.map((char) => (
              <label key={char.CharacteristicID} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBreakdowns.includes(char.CharacteristicID) || (char.CharacteristicLabel === 'Total' && selectedBreakdowns.includes('Total'))}
                  onChange={() => {
                    if (char.CharacteristicLabel === 'Total') {
                      setSelectedBreakdowns(['Total']);
                    } else {
                      setSelectedBreakdowns((prev) => {
                        let updated = prev.filter((id) => id !== 'Total');
                        if (prev.includes(char.CharacteristicID)) {
                          updated = updated.filter((id) => id !== char.CharacteristicID);
                        } else {
                          updated = [...updated, char.CharacteristicID];
                        }
                        // If none selected, default to Total
                        if (updated.length === 0) return ['Total'];
                        return updated;
                      });
                    }
                  }}
                  disabled={char.CharacteristicLabel === 'Total' && selectedBreakdowns.length > 1}
                />
                <span>{char.CharacteristicLabel}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Visualization Type Selector */}
      {data.length > 0 && (
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">View as:</span>
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setVisualizationType('table')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                visualizationType === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setVisualizationType('bar')}
              className={`px-4 py-2 text-sm font-medium ${
                visualizationType === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-200`}
            >
              Bar
            </button>
            <button
              type="button"
              onClick={() => setVisualizationType('line')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                visualizationType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Line
            </button>
          </div>
        </div>
      )}

      {/* Visualization */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        renderVisualization()
      )}
    </div>
  );
};

export default DataCanvas;