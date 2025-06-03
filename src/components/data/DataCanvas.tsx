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

interface Country {
  CountryName: string;
  DHS_CountryCode: string;
  ISO_Code: string;
  FIPS_CountryCode: string;
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
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [yearRange, setYearRange] = useState({ start: 2010, end: 2023 });
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('table');

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

  // Fetch data when selections change
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedIndicator || !selectedCountry) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get('https://api.dhsprogram.com/rest/dhs/data', {
          params: {
            indicatorIds: selectedIndicator,
            countryIds: selectedCountry,
            surveyYearStart: yearRange.start,
            surveyYearEnd: yearRange.end,
            returnFields: 'CountryName,SurveyYear,Value,CharacteristicLabel',
            f: 'json'
          }
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
  }, [selectedIndicator, selectedCountry, yearRange]);

  // Generate unique key for indicators
  const getIndicatorKey = (indicator: Indicator) => {
    return `${indicator.IndicatorId}_${indicator.SurveyType || 'default'}`;
  };

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'bar':
        return (
          <div className="h-[500px] bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="SurveyYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Value" fill="#4F46E5" name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className="h-[500px] bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Trend Line</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="SurveyYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Value"
                  stroke="#4F46E5"
                  name="Value"
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'table':
      default:
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
                {data.map((item, index) => (
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
            value={selectedIndicator}
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
            Select Country
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select a country...</option>
            {countries.map((country) => (
              <option key={country.DHS_CountryCode} value={country.DHS_CountryCode}>
                {country.CountryName}
              </option>
            ))}
          </select>
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