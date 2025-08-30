import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DataPoint {
  SurveyYear: number;
  Value: number;
  CountryName: string;
  CharacteristicLabel?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  measurementType: string;
  indicatorName: string;
  countryName: string;
  height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  measurementType,
  indicatorName,
  countryName,
  height = 300
}) => {
  // Sort data by year and ensure we have valid data
  const sortedData = React.useMemo(() => {
    return data
      .filter(item => item.Value !== null && item.Value !== undefined && !isNaN(item.Value))
      .sort((a, b) => a.SurveyYear - b.SurveyYear);
  }, [data]);

  // Custom tooltip formatter
  const formatTooltip = (value: any, name: string) => {
    if (measurementType.toLowerCase() === 'percent') {
      return [`${value}%`, name];
    }
    return [value, name];
  };

  // Custom axis formatter
  const formatYAxis = (tickItem: any) => {
    if (measurementType.toLowerCase() === 'percent') {
      return `${tickItem}%`;
    }
    return tickItem;
  };

  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No trend data available</div>
          <div className="text-xs mt-1">Try selecting a different country or indicator</div>
        </div>
      </div>
    );
  }

  if (sortedData.length === 1) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-sm">Single data point</div>
          <div className="text-lg font-semibold text-blue-600 mt-2">
            {measurementType.toLowerCase() === 'percent' 
              ? `${sortedData[0].Value}%` 
              : sortedData[0].Value}
          </div>
          <div className="text-xs mt-1">{sortedData[0].SurveyYear}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="SurveyYear"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toString()}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            label={{
              value: measurementType,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#666' }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            formatter={formatTooltip}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingBottom: '10px'
            }}
          />
          <Line
            type="monotone"
            dataKey="Value"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{
              fill: '#4F46E5',
              strokeWidth: 2,
              r: 4,
              stroke: 'white'
            }}
            activeDot={{
              r: 6,
              stroke: '#4F46E5',
              strokeWidth: 2,
              fill: 'white'
            }}
            name={indicatorName}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart metadata */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>Country: {countryName}</span>
          <span>Data points: {sortedData.length}</span>
        </div>
        <div className="mt-1">
          <span>Source: DHS STATcompiler</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
