// Home.tsx
// Main landing page for NPH Solutions website
// Features: Globe visualization, responsive indicator lists, details panel, health tools, and more

import React, { useState, useCallback, useEffect, Suspense, lazy, startTransition } from 'react';
import { useNavigate } from "react-router-dom";
import MobileCountrySelector from "../components/globe/MobileCountrySelector";
import Footer from "../components/layout/Footer";
import SEOHead from "../components/seo/SEOHead";
import { indicators as localIndicators } from "../data/indicators";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import LoadingSpinner from '../components/common/LoadingSpinner';
import { calculateGrowthZScores } from '../utils/whoLMS';

// Lazy load heavy components
const GlobeVisualization = lazy(() => import("../components/globe/OptimizedGlobeVisualization"));
const FeedingTipsCarousel = lazy(() => import("../components/carousel/FeedingTipsCarousel"));
const Select = lazy(() => import('react-select'));
const TrendChart = lazy(() => import("../components/data/TrendChart"));

// Lazy load axios for API calls
let axios: any = null;
const loadAxios = async () => {
  if (!axios) {
    const axiosModule = await import('axios');
    axios = axiosModule.default;
  }
  return axios;
};




// Feeding tips data for carousel (used in Health Tools section)
const feedingTips = {
  breastfeedingBasics: {
    title: "🤱 Breastfeeding Basics (0-6 months)",
    icon: "🍼",
    tips: [
      "Give only breastmilk for the first 6 months—no water, porridge, or herbal drinks.",
      "Breastmilk contains all the nutrients your baby needs in the first 6 months.",
      "Feed your baby on demand—at least 8 times a day including at night.",
      "Avoid using feeding bottles—they are hard to clean and may cause infections.",
      "In hot weather, breastmilk still provides all the water your baby needs.",
    ],
  },
  breastfeedingBest: {
    title: "🤱 Breastfeeding Best Practices",
    icon: "🍼",
    tips: [
      "Start breastfeeding within the first hour of birth to protect your baby from infections.",
      "Skin-to-skin contact right after birth helps your baby start breastfeeding sooner.",
      "Early breastfeeding improves bonding and boosts milk production.",
      "Even C-section babies should be breastfed as soon as the mother is alert.",
      "The first breastmilk (colostrum) is golden and full of antibodies—do not discard it.",
    ],
  },
  complementaryStart: {
    title: "🥣 Starting Complementary Foods (6-24 months)",
    icon: "🥄",
    tips: [
      "Start giving mashed and soft foods at 6 months, while continuing breastfeeding.",
      "Feed thick porridge, mashed fruits, soft vegetables, and small pieces of meat.",
      "Introduce one new food at a time and watch for allergies.",
      "Do not replace breastmilk; food complements it.",
      "Ensure food is soft enough to avoid choking.",
    ],
  },
  complementaryVariety: {
    title: "🥣 Complementary Feeding Variety",
    icon: "🥄",
    tips: [
      "Feed your child from at least 5 food groups daily.",
      "Include eggs, dairy, grains, fruits, and vegetables every day.",
      "Colorful meals are more nutritious—use orange, green, red vegetables and fruits.",
      "Use local foods—pumpkin, bananas, beans, greens—to add variety.",
      "Diversity helps prevent micronutrient deficiencies.",
    ],
  },
  mealFrequency: {
    title: "⏰ Meal Frequency & Growth",
    icon: "🍽️",
    tips: [
      "Feed 6–8-month-olds at least 2–3 meals a day.",
      "Feed 9–23-month-olds 3–4 meals + 1–2 snacks daily.",
      "Children need small frequent meals due to small stomachs.",
      "During illness, feed more often and offer favorite foods.",
      "Extra feeding after sickness helps the child catch up in growth.",
    ],
  },
  foodSafety: {
    title: "🧼 Food Safety & Hygiene",
    icon: "🧽",
    tips: [
      "Wash hands with soap before preparing and feeding food.",
      "Clean feeding utensils thoroughly with soap and water.",
      "Serve freshly prepared food. Avoid keeping leftovers.",
      "Boil water used for baby food preparation.",
      "Avoid street food or uncovered food for children.",
    ],
  },
  healthyHabits: {
    title: "🍏 Healthy Feeding Habits",
    icon: "🥗",
    tips: [
      "Do not give soda, juice, or sugary drinks to children under 2.",
      "Avoid giving sweets, biscuits, and chips—they displace healthy food.",
      "Herbal teas and concoctions are not safe for babies.",
      "Do not force-feed your child; encourage and offer with love.",
      "Avoid distractions like screens during mealtime.",
    ],
  },
  nutritionDiversity: {
    title: "🌽 Nutrition & Food Diversity",
    icon: "🍠",
    tips: [
      "Offer fruits like banana, papaya, and avocado daily.",
      "Include soft-cooked greens like amaranth or pumpkin leaves.",
      "Fruits and vegetables build immunity and prevent disease.",
      "Chop fruits finely or mash to avoid choking.",
      "Serve vegetables in every meal starting at 6 months.",
    ],
  },
  proteinCalcium: {
    title: "🥚 Protein, Iron & Calcium",
    icon: "🥚",
    tips: [
      "Give eggs 3–4 times a week for protein and nutrients.",
      "Add small pieces of meat, fish, or liver into meals.",
      "Animal foods help prevent anemia in young children.",
      "Yogurt and milk are great sources of calcium.",
      "Mash or blend meat for easy swallowing.",
    ],
  },
  positiveFeeding: {
    title: "😊 Positive Feeding Practices",
    icon: "😊",
    tips: [
      "Make mealtime happy—talk and smile while feeding.",
      "Be patient—offer food slowly and encourage your child.",
      "Respect your child's hunger and fullness cues.",
      "Feed your child in a quiet space with minimal distractions.",
      "Involve older siblings in feeding to make it fun.",
    ],
  },
  illnessRecovery: {
    title: "🤒 Illness & Recovery",
    icon: "💊",
    tips: [
      "Offer food and fluids more frequently during illness.",
      "Give small portions more often when appetite is low.",
      "Continue breastfeeding during illness—it helps with recovery.",
      "Use nutrient-dense, soft foods during recovery.",
      "Extra feeding after illness helps regain lost weight.",
    ],
  },
  parentalSupport: {
    title: "👨‍👩‍👧 Parental Support & Guidance",
    icon: "👨‍👩‍👧",
    tips: [
      "Fathers should support feeding by helping with chores.",
      "Join a mother support group for shared learning.",
      "Ask health workers when unsure about feeding.",
      "Encourage other caregivers to follow safe feeding practices.",
      "Create a consistent feeding routine to help your child feel secure.",
    ],
  },
};

// Remove indicatorsWithDHS mapping and use localIndicators directly

const Home: React.FC = () => {
  // State for calculator
  const [calculatorData, setCalculatorData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: ''
  });
  const [bmiData, setBmiData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: ''
  });
  const [zScoreResult, setZScoreResult] = useState<any>(null);
  const [bmiResult, setBmiResult] = useState<any>(null);
  const [calculatorErrors, setCalculatorErrors] = useState({
    age: false,
    weight: false,
    height: false,
    gender: false
  });
  const [bmiErrors, setBmiErrors] = useState({
    age: false,
    weight: false,
    height: false,
    gender: false
  });
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [overlayCountry, setOverlayCountry] = useState<{ value: string; label: string } | null>(null);
  const [overlayData, setOverlayData] = useState<any[]>([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [overlayError, setOverlayError] = useState<string | null>(null);
  const [overlayChartMode, setOverlayChartMode] = useState<'latest' | 'chart'>('latest');
  const [overlayAvailableCountries, setOverlayAvailableCountries] = useState<{ value: string; label: string }[]>([]);
  
  // Demographic data state
  const [demographicData, setDemographicData] = useState<{
    population?: { value: number; year: number; source?: string };
    genderParity?: { value: number; year: number; source?: string };
    wealthParity?: { value: number; year: number; source?: string };
    residence?: { urban: number; rural: number; year: number; source?: string };
    education?: { 
      primary?: { value: number; year: number; source?: string } | number; 
      secondary?: { value: number; year: number; source?: string } | number; 
      tertiary?: { value: number; year: number; source?: string } | number; 
      year?: number;
      source?: string;
    };
    currency?: string;
    gdpPerCapita?: { value: number; year: number; source?: string };
  }>({});
  const [demographicLoading, setDemographicLoading] = useState(false);
  const [selectedGlobeCountry, setSelectedGlobeCountry] = useState<{ value: string; label: string } | null>(null);
  const [showNutritionModal, setShowNutritionModal] = useState(false);


  // Function to fetch demographic data for a country
  const fetchDemographicData = useCallback(async (countryCode: string) => {
    setDemographicLoading(true);
    // Clear existing data to show loading state
    setDemographicData({});
    try {
      const axiosInstance = await loadAxios();
      
      // Try multiple data sources in order of preference
      const dataSources = [
        () => fetchFromWorldBank(countryCode, axiosInstance),
        () => fetchFromRestCountries(countryCode, axiosInstance)
        // Note: DHS removed as it doesn't provide population-level demographic data
      ];

      let demographicData = null;
      
      for (let i = 0; i < dataSources.length; i++) {
        try {
          demographicData = await dataSources[i]();
          
          if (demographicData && Object.keys(demographicData).length > 1) {
            break; // Use first successful source
          }
        } catch (error) {
          continue;
        }
      }

      if (demographicData && Object.keys(demographicData).length > 1) {
        setDemographicData(demographicData);
      } else {
        // Fallback to hardcoded data
        const fallbackData = getFallbackDemographicData(countryCode);
        setDemographicData(fallbackData);
      }
    } catch (error) {
      const fallbackData = getFallbackDemographicData(countryCode);
      setDemographicData(fallbackData);
    } finally {
      setDemographicLoading(false);
    }
  }, []);

  // Replace handleGlobeCountrySelect to update selectedCountry and selectedGlobeCountry
  const handleGlobeCountrySelect = useCallback((country: { value: string; label: string }) => {
    startTransition(() => {
      setSelectedGlobeCountry(country);
      
      // Update overlay country if it matches
      const foundCountry = overlayAvailableCountries.find(c => c.value === country.value);
      
      if (foundCountry) {
        setOverlayCountry({ value: country.value, label: country.label });
        
        // If no indicator is selected, automatically select the first indicator and show overlay
        if (selectedIdx === null) {
          setSelectedIdx(0);
        }
        
        // Fetch demographic data immediately when country is selected
        fetchDemographicData(country.value);
      }
    });
  }, [overlayAvailableCountries, selectedIdx, fetchDemographicData]);



  // Fetch available countries for overlay on mount
  useEffect(() => {
    loadAxios().then(axiosInstance => {
      axiosInstance.get('https://api.dhsprogram.com/rest/dhs/countries', { params: { f: 'json' } })
        .then((res: any) => {
          const opts = res.data.Data.map((c: any) => ({ value: c.DHS_CountryCode, label: c.CountryName }));
          setOverlayAvailableCountries(opts);
          const defaultCountry = opts.find((c: any) => c.value === 'UG') || opts[0];
          setOverlayCountry(defaultCountry as { value: string; label: string } | null);
        })
        .catch(() => {
          // Silently handle error
        });
    });
  }, []);

  // World Bank API data fetcher
  const fetchFromWorldBank = async (countryCode: string, axiosInstance: any) => {
    const countryMapping: { [key: string]: string } = {
      'UG': 'UG', 'KE': 'KE', 'TZ': 'TZ', 'RW': 'RW', 'ET': 'ET',
      'NG': 'NG', 'ZA': 'ZA', 'EG': 'EG', 'GH': 'GH', 'MA': 'MA'
    };
    
    const wbCountryCode = countryMapping[countryCode] || countryCode;
    
    const indicators = {
      // Core indicators you need
      population: 'SP.POP.TOTL', // Total population
      gdpPerCapita: 'NY.GDP.PCAP.CD', // GDP per capita
      urbanPopulation: 'SP.URB.TOTL.IN.ZS', // Urban population % (for residence distribution)
      
      // Gender parity indicators (literacy rates)
      femaleLiteracy: 'SE.ADT.LITR.FE.ZS', // Female literacy rate
      maleLiteracy: 'SE.ADT.LITR.MA.ZS', // Male literacy rate
      
      // Education indicators
      primaryEnrollment: 'SE.PRM.NENR', // Primary enrollment rate
      secondaryEnrollment: 'SE.SEC.NENR', // Secondary enrollment rate
      tertiaryEnrollment: 'SE.TER.ENRR' // Tertiary enrollment rate
    };

    const promises = Object.entries(indicators).map(async ([key, indicator]) => {
      try {
        const response = await axiosInstance.get('https://api.worldbank.org/v2/country/' + wbCountryCode + '/indicator/' + indicator, {
          params: {
            format: 'json',
            date: '2020:2023',
            per_page: 1
          }
        });
        
        const data = response.data[1];
        if (data && data.length > 0) {
          const latest = data[0];
          return {
            key,
            value: latest.value,
            year: latest.date
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    });

    const results = await Promise.all(promises);
    const processedData: any = {};

    results.forEach(result => {
      if (result) {
        switch (result.key) {
          case 'population':
            processedData.population = {
              value: Math.round(result.value),
              year: result.year,
              source: 'World Bank'
            };
            break;
          case 'gdpPerCapita':
            processedData.gdpPerCapita = {
              value: Math.round(result.value),
              year: result.year,
              source: 'World Bank'
            };
            break;
          case 'urbanPopulation':
            processedData.residence = {
              urban: result.value,
              rural: 100 - result.value,
              year: result.year,
              source: 'World Bank'
            };
            break;
          case 'femaleLiteracy':
          case 'maleLiteracy':
            // Store for gender parity calculation (only if value is not null)
            if (result.value !== null) {
              if (!processedData.literacyRates) processedData.literacyRates = {};
              processedData.literacyRates[result.key] = {
                value: result.value,
                year: result.year,
                source: 'World Bank'
              };
            }
            break;
          case 'primaryEnrollment':
          case 'secondaryEnrollment':
          case 'tertiaryEnrollment':
            // Store for education levels (only if value is not null)
            if (result.value !== null) {
              if (!processedData.education) processedData.education = {};
              const level = result.key.replace('Enrollment', '');
              processedData.education[level] = {
                value: result.value,
                year: result.year,
                source: 'World Bank'
              };
            }
            break;
        }
      }
    });

    // Calculate gender parity index from literacy rates
    if (processedData.literacyRates?.femaleLiteracy && processedData.literacyRates?.maleLiteracy) {
      const femaleRate = processedData.literacyRates.femaleLiteracy.value;
      const maleRate = processedData.literacyRates.maleLiteracy.value;
      processedData.genderParity = {
        value: maleRate > 0 ? femaleRate / maleRate : 1,
        year: processedData.literacyRates.femaleLiteracy.year,
        source: 'World Bank (calculated from literacy rates)'
      };
    } else {
      // If no literacy data available, set a default gender parity
      processedData.genderParity = {
        value: 0.95, // Default gender parity
        year: 2023,
        source: 'Default estimate'
      };
    }

    processedData.currency = getCurrencyForCountry(countryCode);
    return processedData;
  };

  // REST Countries API data fetcher
  const fetchFromRestCountries = async (countryCode: string, axiosInstance: any) => {
    const countryMapping: { [key: string]: string } = {
      'UG': 'UGA', 'KE': 'KEN', 'TZ': 'TZA', 'RW': 'RWA', 'ET': 'ETH',
      'NG': 'NGA', 'ZA': 'ZAF', 'EG': 'EGY', 'GH': 'GHA', 'MA': 'MAR'
    };
    
    const iso3Code = countryMapping[countryCode] || countryCode;
    
    try {
      const response = await axiosInstance.get(`https://restcountries.com/v3.1/alpha/${iso3Code}`);
      const country = response.data[0];
      
      if (country) {
        const result = {
          population: {
            value: country.population,
            year: 2023,
            source: 'REST Countries API'
          },
          currency: Object.keys(country.currencies || {})[0] || getCurrencyForCountry(countryCode),
          area: country.area,
          capital: country.capital?.[0],
          region: country.region,
          subregion: country.subregion,
          languages: Object.values(country.languages || {}),
          // Estimate urban/rural based on region
          residence: {
            urban: getEstimatedUrbanPercentage(country.region),
            rural: 100 - getEstimatedUrbanPercentage(country.region),
            year: 2023,
            source: 'REST Countries API (estimated from region)'
          }
        };
        return result;
      }
    } catch (error) {
      // Silently handle error
    }
    return null;
  };


  // Helper function to get fallback demographic data for a country
  const getFallbackDemographicData = (countryCode: string) => {
    // Fallback demographic data for countries where APIs might not be available
    const fallbackData: { [key: string]: any } = {
      population: { value: 50000000, year: 2023, source: 'Fallback data' }, // Default population
      genderParity: { value: 0.95, year: 2023, source: 'Fallback data' }, // Default gender parity
      residence: { urban: 35, rural: 65, year: 2023, source: 'Fallback data' }, // Default urban/rural split
      education: { primary: 50, secondary: 30, tertiary: 20, year: 2023, source: 'Fallback data' }, // Default education levels
      gdpPerCapita: { value: 2000, year: 2023, source: 'Fallback data' } // Default GDP per capita
    };
    
    // Country-specific fallback data
    const countrySpecificData: { [key: string]: any } = {
      'UG': { // Uganda
        population: { value: 48582300, year: 2023, source: 'Country-specific fallback' },
        gdpPerCapita: { value: 1056, year: 2023, source: 'Country-specific fallback' },
        residence: { urban: 25, rural: 75, year: 2023, source: 'Country-specific fallback' },
        genderParity: { value: 0.98, year: 2023, source: 'Country-specific fallback' },
        education: { primary: 85, secondary: 45, tertiary: 8, year: 2023, source: 'Country-specific fallback' }
      },
      'KE': { // Kenya
        population: { value: 56983400, year: 2023, source: 'Country-specific fallback' },
        gdpPerCapita: { value: 2047, year: 2023, source: 'Country-specific fallback' },
        residence: { urban: 30, rural: 70, year: 2023, source: 'Country-specific fallback' },
        genderParity: { value: 0.97, year: 2023, source: 'Country-specific fallback' },
        education: { primary: 90, secondary: 60, tertiary: 15, year: 2023, source: 'Country-specific fallback' }
      },
      'TZ': { // Tanzania
        population: { value: 65497000, year: 2023, source: 'Country-specific fallback' },
        gdpPerCapita: { value: 1200, year: 2023, source: 'Country-specific fallback' },
        residence: { urban: 35, rural: 65, year: 2023, source: 'Country-specific fallback' },
        genderParity: { value: 0.96, year: 2023, source: 'Country-specific fallback' },
        education: { primary: 80, secondary: 40, tertiary: 6, year: 2023, source: 'Country-specific fallback' }
      },
      'RW': { // Rwanda
        population: { value: 14095000, year: 2023, source: 'Country-specific fallback' },
        gdpPerCapita: { value: 966, year: 2023, source: 'Country-specific fallback' },
        residence: { urban: 20, rural: 80, year: 2023, source: 'Country-specific fallback' },
        genderParity: { value: 0.99, year: 2023, source: 'Country-specific fallback' },
        education: { primary: 95, secondary: 50, tertiary: 12, year: 2023, source: 'Country-specific fallback' }
      },
      'ET': { // Ethiopia
        population: { value: 126527000, year: 2023, source: 'Country-specific fallback' },
        gdpPerCapita: { value: 1028, year: 2023, source: 'Country-specific fallback' },
        residence: { urban: 25, rural: 75, year: 2023, source: 'Country-specific fallback' },
        genderParity: { value: 0.94, year: 2023, source: 'Country-specific fallback' },
        education: { primary: 75, secondary: 35, tertiary: 5, year: 2023, source: 'Country-specific fallback' }
      }
    };
    
    return countrySpecificData[countryCode] || fallbackData;
  };

  // Helper function to estimate urban percentage based on region
  const getEstimatedUrbanPercentage = (region: string): number => {
    const regionEstimates: { [key: string]: number } = {
      'Africa': 45,
      'Asia': 55,
      'Europe': 75,
      'Americas': 80,
      'Oceania': 70
    };
    return regionEstimates[region] || 50; // Default to 50% if region not found
  };

  // Helper function to get currency for a country
  const getCurrencyForCountry = (countryCode: string): string => {
    const currencyMap: { [key: string]: string } = {
      'UG': 'UGX', // Uganda Shilling
      'KE': 'KES', // Kenya Shilling
      'TZ': 'TZS', // Tanzania Shilling
      'RW': 'RWF', // Rwanda Franc
      'BI': 'BIF', // Burundi Franc
      'ET': 'ETB', // Ethiopian Birr
      'SO': 'SOS', // Somali Shilling
      'SS': 'SSP', // South Sudanese Pound
      'DJ': 'DJF', // Djibouti Franc
      'ER': 'ERN', // Eritrean Nakfa
      'SD': 'SDG', // Sudanese Pound
      'EG': 'EGP', // Egyptian Pound
      'LY': 'LYD', // Libyan Dinar
      'TN': 'TND', // Tunisian Dinar
      'DZ': 'DZD', // Algerian Dinar
      'MA': 'MAD', // Moroccan Dirham
      'NG': 'NGN', // Nigerian Naira
      'GH': 'GHS', // Ghanaian Cedi
      'CI': 'XOF', // West African CFA Franc
      'SN': 'XOF', // West African CFA Franc
      'ML': 'XOF', // West African CFA Franc
      'BF': 'XOF', // West African CFA Franc
      'NE': 'XOF', // West African CFA Franc
      'TD': 'XAF', // Central African CFA Franc
      'CM': 'XAF', // Central African CFA Franc
      'CF': 'XAF', // Central African CFA Franc
      'CG': 'XAF', // Central African CFA Franc
      'GA': 'XAF', // Central African CFA Franc
      'GQ': 'XAF', // Central African CFA Franc
      'CD': 'CDF', // Congolese Franc
      'AO': 'AOA', // Angolan Kwanza
      'ZM': 'ZMW', // Zambian Kwacha
      'BW': 'BWP', // Botswana Pula
      'NA': 'NAD', // Namibian Dollar
      'ZA': 'ZAR', // South African Rand
      'LS': 'LSL', // Lesotho Loti
      'SZ': 'SZL', // Eswatini Lilangeni
      'MG': 'MGA', // Malagasy Ariary
      'MU': 'MUR', // Mauritian Rupee
      'SC': 'SCR', // Seychellois Rupee
      'KM': 'KMF', // Comorian Franc
      'MW': 'MWK', // Malawian Kwacha
      'MZ': 'MZN', // Mozambican Metical
    };
    return currencyMap[countryCode] || 'USD';
  };

  // Fetch DHS data for overlay when indicator or country changes
  useEffect(() => {
    if (selectedIdx === null || !overlayCountry) {
      return;
    }
    const indicator = localIndicators[selectedIdx];
    setOverlayLoading(true);
    setOverlayError(null);
    setOverlayData([]);
    
    // Fetch both indicator data and demographic data
    const fetchData = async () => {
      try {
        const axiosInstance = await loadAxios();
        
        // Fetch indicator data
        const indicatorResponse = await axiosInstance.get('https://api.dhsprogram.com/rest/dhs/data', {
          params: {
            indicatorIds: indicator.indicatorId,
            countryIds: overlayCountry.value,
            surveyYearStart: 1990,
            surveyYearEnd: new Date().getFullYear(),
            returnFields: 'CountryName,SurveyYear,Value,CharacteristicLabel',
            f: 'json',
          },
        });
        
        setOverlayData(indicatorResponse.data.Data || []);
        
        // Fetch demographic data
        await fetchDemographicData(overlayCountry.value);
        
      } catch (error) {
        setOverlayError('Failed to load data from DHS.');
      } finally {
        setOverlayLoading(false);
      }
    };
    
    fetchData();
  }, [selectedIdx, overlayCountry, fetchDemographicData]);

  // Calculator input change handler
  const handleCalculatorChange = (field: string, value: string) => {
    setCalculatorData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (value) {
      setCalculatorErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleBmiChange = (field: string, value: string) => {
    setBmiData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (value) {
      setBmiErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const calculateZScore = () => {
    const { age, weight, height, gender } = calculatorData;
    
    // Validate inputs
    const errors = {
      age: !age,
      weight: !weight,
      height: !height,
      gender: !gender
    };
    
    setCalculatorErrors(errors);
    
    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      return;
    }

    try {
      // Use proper WHO LMS calculation
      const result = calculateGrowthZScores({
        ageMonths: parseFloat(age),
        weightKg: parseFloat(weight),
        heightCm: parseFloat(height),
        sex: gender.toLowerCase()
      });

      setZScoreResult({
        weightZScore: result.waz.toFixed(2),
        heightZScore: result.haz.toFixed(2),
        wastingZScore: result.whzOrBaz.toFixed(2),
        weightStatus: result.weightStatus,
        heightStatus: result.heightStatus,
        wastingStatus: result.nutritionStatus,
        recommendations: getRecommendations(result.weightStatus, result.heightStatus, result.nutritionStatus)
      });
    } catch (error) {
      console.error('Z-score calculation error:', error);
      alert('Error calculating z-scores. Please check your inputs and try again.');
    }
  };

  const calculateBMI = () => {
    const { age, weight, height, gender } = bmiData;
    
    const errors = {
      age: !age,
      weight: !weight,
      height: !height,
      gender: !gender
    };
    
    setBmiErrors(errors);
    
    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Calculate BMI: weight (kg) / height (m)²
    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);

    let bmiCategory = '';
    let bmiColor = '';

    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'bg-red-100 text-red-700';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = 'bg-green-100 text-green-700';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'bg-yellow-100 text-yellow-700';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'bg-red-100 text-red-700';
    }

    setBmiResult({
      bmi: bmi.toFixed(1),
      category: bmiCategory,
      color: bmiColor,
      recommendations: getBmiRecommendations(bmiCategory)
    });
  };

  const getBmiRecommendations = (category: string) => {
    const recommendations = [];
    
    if (category === 'Underweight') {
      recommendations.push('Increase caloric intake with nutrient-dense foods');
      recommendations.push('Include protein-rich foods in your diet');
      recommendations.push('Consider consulting a nutritionist');
    } else if (category === 'Overweight' || category === 'Obese') {
      recommendations.push('Focus on balanced nutrition and regular exercise');
      recommendations.push('Limit processed foods and sugary drinks');
      recommendations.push('Consider working with a healthcare provider');
    } else {
      recommendations.push('Maintain your current healthy lifestyle');
      recommendations.push('Continue with regular physical activity');
    }
    
    return recommendations;
  };

  const getRecommendations = (weightStatus: string, heightStatus: string, wastingStatus: string) => {
    const recommendations = [];
    
    // Weight status recommendations
    if (weightStatus === "Moderately underweight" || weightStatus === "Severely underweight") {
      recommendations.push("Increase caloric intake with nutrient-dense foods");
      recommendations.push("Consider nutritional supplements under medical supervision");
      recommendations.push("Monitor weight gain progress regularly");
    } else if (weightStatus === "Overweight" || weightStatus === "Obesity") {
      recommendations.push("Focus on balanced nutrition and physical activity");
      recommendations.push("Limit sugary drinks and processed foods");
      recommendations.push("Consult with healthcare provider for weight management");
    }
    
    // Height status recommendations
    if (heightStatus === "Stunted" || heightStatus === "Severely stunted") {
      recommendations.push("Ensure adequate protein and micronutrient intake");
      recommendations.push("Monitor for underlying health conditions");
      recommendations.push("Consider early intervention programs");
    }
    
    // Nutrition status recommendations
    if (wastingStatus === 'Wasting' || wastingStatus === 'Severe wasting') {
      recommendations.push('Immediate nutritional intervention may be needed');
      recommendations.push('Consult healthcare provider for specialized care');
      recommendations.push('Monitor for signs of malnutrition');
    } else if (wastingStatus === 'Overweight' || wastingStatus === 'Obesity') {
      recommendations.push('Focus on healthy eating habits and physical activity');
      recommendations.push('Limit high-calorie, low-nutrient foods');
      recommendations.push('Encourage regular physical activity appropriate for age');
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Continue with current healthy feeding practices");
      recommendations.push("Regular growth monitoring recommended");
      recommendations.push("Maintain balanced diet and physical activity");
    }
    
    return recommendations;
  };

  // Details panel navigation handlers
  const handleNext = () => {
    startTransition(() => {
      if (selectedIdx === null) setSelectedIdx(0);
      else setSelectedIdx((selectedIdx + 1) % localIndicators.length);
    });
  };
  const handlePrev = () => {
    startTransition(() => {
      if (selectedIdx === null) setSelectedIdx(localIndicators.length - 1);
      else setSelectedIdx((selectedIdx - 1 + localIndicators.length) % localIndicators.length);
    });
  };
  const handleClose = () => {
    startTransition(() => setSelectedIdx(null));
  };

  const handleCheckNutrition = () => {
    const { age, weight, height, gender } = calculatorData;
    const errors = {
      age: !age,
      weight: !weight,
      height: !height,
      gender: !gender
    };
    
    setCalculatorErrors(errors);
    
    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      return;
    }
    
    setShowNutritionModal(true);
  };

  const handleAcknowledgeWarning = () => {
    setShowNutritionModal(false);
    calculateZScore();
  };

  return (
    <>
      <SEOHead
        title="NPH Solutions - Public Health Research & Data Analytics"
        description="NPH Solutions provides comprehensive public health research, monitoring & evaluation, data systems, and health promotion services. Unlocking health data for community and policy action across Africa."
        keywords="public health, health research, data analytics, monitoring evaluation, health promotion, Africa health, DHS data, health systems, epidemiology, health policy, Uganda health, Kenya health, Tanzania health"
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "NPH Solutions - Public Health Research & Data Analytics",
          "description": "NPH Solutions provides comprehensive public health research, monitoring & evaluation, data systems, and health promotion services. Unlocking health data for community and policy action across Africa.",
          "url": "https://nph-solutions.com/",
          "mainEntity": {
            "@type": "Organization",
            "name": "NPH Solutions",
            "url": "https://nph-solutions.com",
            "logo": "https://nph-solutions.com/src/assets/Company-logo.jpg",
            "description": "Public health research and data analytics organization serving Africa",
            "service": [
              "Public Health Research",
              "Monitoring & Evaluation", 
              "Data Systems",
              "Health Promotion"
            ]
          }
        }}
      />
      {/* Main Page Container */}
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        {/* Redesigned Full-Width Hero Section with Solid Background */}
        <div className="w-full border-b border-blue-100 pb-0 pt-6 md:pt-10 relative overflow-hidden" style={{ backgroundColor: '#e2f6e5' }}>
          <div className="flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 gap-2 md:gap-4 text-center relative z-10">
            {/* Title and Description (centered, compact) */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 leading-tight pt-14">
                  Unlocking health data for community and policy action
                </h1>
            {/* Services (compact, inline, centered) */}
            <ul className="flex flex-wrap gap-2 justify-center text-xs md:text-sm text-gray-700 mb-2 pt-0">
              <li className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span>Public health research</li>
              <li className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span>Monitoring & evaluation</li>
              <li className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span>Data systems</li>
              <li className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span>Health promotion</li>
            </ul>
            {/* Navigation Buttons (smaller, inline, centered) */}
            <div className="flex gap-2 mt-2 justify-center pb-10">
              <button
                onClick={() => navigate("/data")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs md:text-sm shadow"
              >
                Explore Data
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-xs md:text-sm shadow"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        {/* End Hero Section */}
        {/* Dynamic Country Data Section (shown when a country is selected on the globe) */}
        {/* {selectedCountry && countryData && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              📊 DHS Data for {selectedCountry}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {countryData.indicators}
                </div>
                <div className="text-gray-600">Health Indicators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {countryData.surveys}
                </div>
                <div className="text-gray-600">Surveys Available</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-600">
                  {countryData.lastUpdated}
                </div>
                <div className="text-gray-600">Last Updated</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click on indicators below to explore detailed data for {selectedCountry}
            </p>
          </div>
        )} */}
        {/* Globe and Arc Overlay Section */}
        <div className="relative w-full h-auto mt-8 md:mt-0 flex flex-col items-center py-6 md:py-10" style={{ 
          background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)" 
        }}>
                               {/* Desktop Layout: Globe and Indicator List Side by Side */}
          <div className="hidden lg:flex w-full max-w-7xl mx-auto gap-8 items-start">
            {/* Globe Visualization (left) with floating country selector */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md h-[700px] rounded-lg overflow-visible relative flex items-center justify-center" style={{ top: "50px" }}>
                <Suspense fallback={
                  <div className="flex items-center justify-center w-full h-full">
                    <LoadingSpinner />
                  </div>
                }>
                  <GlobeVisualization 
                    onCountrySelect={handleGlobeCountrySelect}
                    selectedCountry={selectedGlobeCountry} // Pass selected country for highlighting
                    width={800}
                    height={700}
                    className="w-full h-full"
                  />
                </Suspense>
                
                {/* Floating Country Selector Dialog */}
                <div className="absolute top-4 left-4 z-10">
                  <MobileCountrySelector
                    onCountrySelect={handleGlobeCountrySelect}
                    onCountryClear={() => {
                      setSelectedGlobeCountry(null);
                    }}
                    selectedCountry={selectedGlobeCountry}
                  />
                </div>
              </div>
            </div>
            {/* Desktop Indicator List (right) */}
            <div className="flex-2 flex justify-center">
              <div className="w-full max-w-2xl">
                <h2 className="text-lg font-bold mb-3 text-gray-800 text-left" style={{ transform: "translatex(-300px)", textDecoration: "underline" }}>
                  Health Indicators
                </h2>
                <div className="space-y-0">
                  {/* Desktop Arc Cards: Each card is only as wide as its content */}
                  {localIndicators.map((indicator, idx) => {
                    const colors = [
                      "#00A0DC", "#7AC36A", "#F15A60", "#9B5DE5", "#F5A623", "#2CCCE4", "#FF66B2", "#5C6BC0", "#42B883", "#FF7043", "#FFD600", "#8D6E63", "#00B8D4", "#C51162", "#43A047", "#FF3D00", "#6D4C41", "#1DE9B6", "#D500F9", "#FFAB00",
                    ];
                    const color = colors[idx % colors.length];
                    // Arc transformations for arc effect
                    const arcTransformations = [
                      -300, -220, -110, -60, -20, 10, 20, 30, 40, 40, 30, 20, 10, -20, -60, -110, -200, -300,
                    ];
                    const translateX = arcTransformations[idx] || 0;
                    return (
                      <motion.div
                        key={indicator.indicatorId}
                        className={classNames(
                          "home-arc-card cursor-pointer transition-all duration-200 hover:scale-105",
                          selectedIdx === idx && "selected"
                        )}
                        style={{
                          transform: `translateX(${translateX}px)`,
                          height: "40px",
                          padding: "0",
                          "--indicator-color": color,
                        } as React.CSSProperties}
                        onClick={() => startTransition(() => setSelectedIdx(idx))}
                      >
                        <div className="home-arc-number" style={{ borderColor: color }}>{idx + 1}</div>
                        <div className="home-arc-content flex-1 min-w-0">
                          <div className="home-arc-title whitespace-nowrap">{indicator.label}</div>
                          <hr style={{borderColor: color, borderWidth: '1px', borderStyle: 'solid'}}/>
                          <div className="home-arc-description whitespace-nowrap">{indicator.shortDescription}</div>
                        </div>
                        <div className="home-arc-arrow flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                        </svg>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Mobile/Tablet Layout: Country Selector + Globe (stacked) */}
          <div className="lg:hidden w-full flex flex-col items-center space-y-8 px-4">
            
            {/* Mobile Country Selector */}
            <MobileCountrySelector
              onCountrySelect={handleGlobeCountrySelect}
              onCountryClear={() => {
                setSelectedGlobeCountry(null);
              }}
              selectedCountry={selectedGlobeCountry}
            />
            
            {/* Mobile Globe */}
            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden relative flex items-center justify-center">
              <Suspense fallback={
                <div className="flex items-center justify-center w-full h-full">
                  <LoadingSpinner />
                </div>
              }>
              <GlobeVisualization 
                   onCountrySelect={handleGlobeCountrySelect}
                   selectedCountry={selectedGlobeCountry} // Pass selected country for highlighting
                   width={330}
                   height={300}
                   className="w-full h-full"
                 />
              </Suspense>
            </div>
          </div>
        </div>
        {/* Details/Story Panel: Shows indicator details on all screen sizes */}
        <AnimatePresence>
          {selectedIdx !== null && localIndicators[selectedIdx] && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="sticky top-0 z-10 bg-white p-4 pb-2 mt-10 pt-10">
                <button
                  onClick={handleClose}
                  className="self-end text-gray-400 hover:text-gray-700 text-2xl mb-4"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 pb-4">
                <h2 className="text-2xl font-bold mb-2">{localIndicators[selectedIdx].label}</h2>
                <p className="text-gray-700 mb-6">{localIndicators[selectedIdx].definition}</p>
                {/* Country Picker */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Select
                    options={overlayAvailableCountries}
                    value={overlayCountry}
                    onChange={(opt: any) => setOverlayCountry(opt)}
                    classNamePrefix="react-select"
                    placeholder="Select country..."
                    isSearchable
                    menuPlacement="auto"
                    styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
                  />
                </div>
                {/* Chart/Latest Toggle */}
                <div className="mb-4 flex gap-4 items-center">
                  <button
                    className={`px-4 py-2 rounded ${overlayChartMode === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setOverlayChartMode('latest')}
                  >
                    Latest Value
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${overlayChartMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setOverlayChartMode('chart')}
                  >
                    Trend
                  </button>
                </div>
                {/* Data Display */}
                {overlayLoading ? (
                  <div className="py-8 flex justify-center items-center"><LoadingSpinner /></div>
                ) : overlayError ? (
                  <div className="py-8 text-center text-red-600">{overlayError}</div>
                ) : overlayChartMode === 'latest' ? (
                  <>
                    {overlayData.length > 0 ? (
                      (() => {
                        const sorted = [...overlayData].sort((a, b) => b.SurveyYear - a.SurveyYear);
                        const latest = sorted[0];
                        const indicator = localIndicators[selectedIdx];
                        const valueDisplay = indicator.measurementType.toLowerCase() === 'percent'
                          ? `${latest.Value}%`
                          : latest.Value;
                        return (
                          <div className="mb-4">
                            <div className="text-4xl font-bold text-blue-700">{valueDisplay}</div>
                            <div className="text-gray-600">{latest.CountryName} ({latest.SurveyYear})</div>
                            <div className="text-xs text-gray-500 mt-2">Source: DHS STATcompiler</div>
                            
                            {/* Demographic Information Section */}
                            {demographicLoading ? (
                              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-2">Loading demographic data...</div>
                                <LoadingSpinner />
                              </div>
                            ) : Object.keys(demographicData).length > 0 ? (
                              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                  Country Demographics
                                  {demographicData.population?.value === 50000000 && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      Fallback Data
                                    </span>
                                  )}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {demographicData.population && (
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-medium text-gray-700">Population</div>
                                      <div className="text-2xl font-bold text-blue-600">
                                        {demographicData.population.value.toLocaleString()}
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{demographicData.population.year}</span>
                                        <span className="text-blue-600 font-medium">{demographicData.population.source}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {demographicData.currency && (
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-medium text-gray-700">Currency</div>
                                      <div className="text-lg font-semibold text-green-600">
                                        {demographicData.currency}
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">-</span>
                                        <span className="text-green-600 font-medium">Currency mapping</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {demographicData.gdpPerCapita && (
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-medium text-gray-700">GDP per Capita</div>
                                      <div className="text-lg font-semibold text-purple-600">
                                        ${demographicData.gdpPerCapita.value.toLocaleString()}
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{demographicData.gdpPerCapita.year}</span>
                                        <span className="text-purple-600 font-medium">{demographicData.gdpPerCapita.source}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {demographicData.genderParity && (
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-medium text-gray-700">Gender Parity Index</div>
                                      <div className="text-lg font-semibold text-pink-600">
                                        {demographicData.genderParity.value.toFixed(2)}
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{demographicData.genderParity.year}</span>
                                        <span className="text-pink-600 font-medium">{demographicData.genderParity.source}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {demographicData.residence && (
                                    <div className="bg-white p-3 rounded border col-span-2">
                                      <div className="font-medium text-gray-700 mb-2">Residence Distribution</div>
                                      <div className="flex justify-between items-center">
                                        <div className="text-center">
                                          <div className="text-lg font-semibold text-orange-600">
                                            {demographicData.residence.urban.toFixed(1)}%
                                          </div>
                                          <div className="text-xs text-gray-500">Urban</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-lg font-semibold text-teal-600">
                                            {demographicData.residence.rural.toFixed(1)}%
                                          </div>
                                          <div className="text-xs text-gray-500">Rural</div>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-500">{demographicData.residence.year}</span>
                                        <span className="text-orange-600 font-medium">{demographicData.residence.source}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {demographicData.education && (
                                    <div className="bg-white p-3 rounded border col-span-2">
                                      <div className="font-medium text-gray-700 mb-2">Education Levels</div>
                                      <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                          <div className="text-sm font-semibold text-blue-600">
                                            {(() => {
                                              const primary = demographicData.education.primary;
                                              if (typeof primary === 'object' && primary?.value) {
                                                return primary.value.toFixed(1) + '%';
                                              } else if (typeof primary === 'number') {
                                                return primary.toFixed(1) + '%';
                                              }
                                              return 'N/A';
                                            })()}
                                          </div>
                                          <div className="text-xs text-gray-500">Primary</div>
                                        </div>
                                        <div>
                                          <div className="text-sm font-semibold text-green-600">
                                            {(() => {
                                              const secondary = demographicData.education.secondary;
                                              if (typeof secondary === 'object' && secondary?.value) {
                                                return secondary.value.toFixed(1) + '%';
                                              } else if (typeof secondary === 'number') {
                                                return secondary.toFixed(1) + '%';
                                              }
                                              return 'N/A';
                                            })()}
                                          </div>
                                          <div className="text-xs text-gray-500">Secondary</div>
                                        </div>
                                        <div>
                                          <div className="text-sm font-semibold text-purple-600">
                                            {(() => {
                                              const tertiary = demographicData.education.tertiary;
                                              if (typeof tertiary === 'object' && tertiary?.value) {
                                                return tertiary.value.toFixed(1) + '%';
                                              } else if (typeof tertiary === 'number') {
                                                return tertiary.toFixed(1) + '%';
                                              }
                                              return 'N/A';
                                            })()}
                                          </div>
                                          <div className="text-xs text-gray-500">Tertiary</div>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-500">
                                          {(() => {
                                            const primary = demographicData.education.primary;
                                            const secondary = demographicData.education.secondary;
                                            const tertiary = demographicData.education.tertiary;
                                            
                                            if (typeof primary === 'object' && primary?.year) return primary.year;
                                            if (typeof secondary === 'object' && secondary?.year) return secondary.year;
                                            if (typeof tertiary === 'object' && tertiary?.year) return tertiary.year;
                                            if (demographicData.education.year) return demographicData.education.year;
                                            return 'N/A';
                                          })()}
                                        </span>
                                        <span className="text-blue-600 font-medium">
                                          {(() => {
                                            const primary = demographicData.education.primary;
                                            const secondary = demographicData.education.secondary;
                                            const tertiary = demographicData.education.tertiary;
                                            
                                            if (typeof primary === 'object' && primary?.source) return primary.source;
                                            if (typeof secondary === 'object' && secondary?.source) return secondary.source;
                                            if (typeof tertiary === 'object' && tertiary?.source) return tertiary.source;
                                            if (demographicData.education.source) return demographicData.education.source;
                                            return 'N/A';
                                          })()}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-gray-500">No data available for this indicator/country.</div>
                    )}
                  </>
                ) : (
                  <div className="h-64 w-full">
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                        <LoadingSpinner />
                      </div>
                    }>
                      <TrendChart
                        data={overlayData}
                        measurementType={localIndicators[selectedIdx].measurementType}
                        indicatorName={localIndicators[selectedIdx].label}
                        countryName={overlayCountry?.label || ''}
                        height={240}
                      />
                    </Suspense>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 z-10 bg-white p-4 flex justify-between">
                <button onClick={handlePrev} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
                <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      {/* Mobile Indicator List: Single column below globe */}
      <div className="block md:hidden w-full mt-8">
        <h2 className="text-lg font-bold mb-3 text-gray-800 text-center">Health Indicators</h2>
        <div className="grid grid-cols-1 gap-4 px-2">
          {localIndicators.map((indicator, idx) => {
            const colors = [
              "#00A0DC", "#7AC36A", "#F15A60", "#9B5DE5", "#F5A623", "#2CCCE4", "#FF66B2", "#5C6BC0", "#42B883", "#FF7043", "#FFD600", "#8D6E63", "#00B8D4", "#C51162", "#43A047", "#FF3D00", "#6D4C41", "#1DE9B6", "#D500F9", "#FFAB00",
            ];
            const color = colors[idx % colors.length];
            return (
              <motion.div
                key={indicator.indicatorId}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={classNames(
                  "home-tablet-card cursor-pointer transition",
                  selectedIdx === idx && "selected"
                )}
                style={{ borderColor: color }}
                                  onClick={() => startTransition(() => setSelectedIdx(idx))}
              >
                <div className="home-tablet-number" style={{ borderColor: color }}>{idx + 1}</div>
                <div className="home-tablet-content">
                  <div className="home-tablet-title">{indicator.label}</div>
                  <div className="home-tablet-description">{indicator.shortDescription}</div>
                </div>
                <div className="home-tablet-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                        </svg>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Tablet Indicator List: 2-column grid below globe */}
      <div className="hidden md:block lg:hidden w-full mt-8">
        <h2 className="text-lg font-bold mb-3 text-gray-800 text-center">Health Indicators</h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl px-4">
            {localIndicators.map((indicator, idx) => {
              const colors = [
                "#00A0DC", "#7AC36A", "#F15A60", "#9B5DE5", "#F5A623", "#2CCCE4", "#FF66B2", "#5C6BC0", "#42B883", "#FF7043", "#FFD600", "#8D6E63", "#00B8D4", "#C51162", "#43A047", "#FF3D00", "#6D4C41", "#1DE9B6", "#D500F9", "#FFAB00",
              ];
              const color = colors[idx % colors.length];
              return (
                <motion.div
                  key={indicator.indicatorId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={classNames(
                    "home-tablet-card cursor-pointer transition-all duration-200",
                    selectedIdx === idx && "selected"
                  )}
                  style={{ borderColor: color }}
                  onClick={() => startTransition(() => setSelectedIdx(idx))}
                >
                  <div className="home-tablet-number" style={{ borderColor: color }}>{idx + 1}</div>
                  <div className="home-tablet-content">
                    <div className="home-tablet-title">{indicator.label}</div>
                    <div className="home-tablet-description">{indicator.shortDescription}</div>
                  </div>
                  <div className="home-tablet-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Health Tools & Resources Section */}
      <div className="relative z-10 bg-white py-16 md:py-24 mt-16 md:mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Health Tools & Resources
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Box: Dynamic Health Feeding Tips */}
            <Suspense fallback={
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 shadow-lg border border-green-200">
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              </div>
            }>
              <FeedingTipsCarousel feedingTips={feedingTips} />
            </Suspense>
            {/* Middle Box: Child Growth Z-Score Calculator */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Growth Z-Score Calculator</h3>
              </div>
              {/* Calculator Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (months)</label>
                    <input
                      type="number"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        calculatorErrors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="24"
                      value={calculatorData.age}
                      onChange={(e) => handleCalculatorChange("age", e.target.value)}
                    />
                    {calculatorErrors.age && <p className="text-xs text-red-500 mt-1">Age is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        calculatorErrors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="12.5"
                      value={calculatorData.weight}
                      onChange={(e) => handleCalculatorChange("weight", e.target.value)}
                    />
                    {calculatorErrors.weight && <p className="text-xs text-red-500 mt-1">Weight is required</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        calculatorErrors.height ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="85.2"
                      value={calculatorData.height}
                      onChange={(e) => handleCalculatorChange("height", e.target.value)}
                    />
                    {calculatorErrors.height && <p className="text-xs text-red-500 mt-1">Height is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        calculatorErrors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      value={calculatorData.gender}
                      onChange={(e) => handleCalculatorChange("gender", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {calculatorErrors.gender && <p className="text-xs text-red-500 mt-1">Gender is required</p>}
                  </div>
                </div>
              </div>
              <button
                className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                onClick={handleCheckNutrition}
              >
                Check Child Nutrition Status
              </button>
              {/* Results Section */}
              {zScoreResult && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 Growth Assessment Results</h4>
                  
                  {/* Z-Score Gauges */}
                  <div className="grid grid-cols-3 gap-6 mb-4">
                    {/* Weight Z-Score Gauge */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-12 mb-2 pt-2">
                        <svg className="w-full h-full" viewBox="0 0 100 60">
                          {/* Gauge background */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          {/* Filled path based on status */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke={zScoreResult.weightStatus === "Normal" ? "#10B981" : zScoreResult.weightStatus.includes("underweight") ? "#EF4444" : "#F59E0B"}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="100 100"
                            strokeDashoffset={zScoreResult.weightStatus === "Normal" ? "0" : zScoreResult.weightStatus.includes("underweight") ? "70" : "40"}
                          />
                        </svg>
                      </div>
                      
                      {/* Weight Z-Score value display - positioned independently */}
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-base font-bold text-gray-800">{zScoreResult.weightZScore}</div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">Weight Z-Score</div>
                      <div className={`text-xs font-medium px-3 py-1 ${
                        zScoreResult.weightStatus === "Normal" ? "bg-green-100 text-green-700" : 
                        zScoreResult.weightStatus.includes("underweight") ? "bg-red-100 text-red-700" : 
                        "bg-yellow-100 text-yellow-700"
                      }`}>{zScoreResult.weightStatus}</div>
                    </div>
                    
                    {/* Height Z-Score Gauge */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-12 mb-2 pt-2">
                        <svg className="w-full h-full" viewBox="0 0 100 60">
                          {/* Gauge background */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          {/* Filled path based on status */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke={zScoreResult.heightStatus === "Normal" ? "#10B981" : zScoreResult.heightStatus.includes("stunted") ? "#EF4444" : "#10B981"}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="100 100"
                            strokeDashoffset={zScoreResult.heightStatus === "Normal" ? "0" : zScoreResult.heightStatus.includes("stunted") ? "70" : "0"}
                          />
                        </svg>
                      </div>
                      
                      {/* Height Z-Score value display - positioned independently */}
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-base font-bold text-gray-800">{zScoreResult.heightZScore}</div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">Height Z-Score</div>
                      <div className={`text-xs font-medium px-3 py-1 ${
                        zScoreResult.heightStatus === "Normal" ? "bg-green-100 text-green-700" : 
                        zScoreResult.heightStatus.includes("stunted") ? "bg-red-100 text-red-700" : 
                        "bg-green-100 text-green-700"
                      }`}>{zScoreResult.heightStatus}</div>
                    </div>
                    
                    {/* Wasting Z-Score Gauge */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-12 mb-2 pt-2">
                        <svg className="w-full h-full" viewBox="0 0 100 60">
                          {/* Gauge background */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          {/* Filled path based on status */}
                          <path
                            d="M 10 45 A 30 30 0 0 1 90 45"
                            fill="none"
                            stroke={zScoreResult.wastingStatus === "Normal" ? "#10B981" : 
                              zScoreResult.wastingStatus.includes("wasting") ? "#EF4444" : 
                              zScoreResult.wastingStatus.includes("overweight") || zScoreResult.wastingStatus.includes("obesity") ? "#F59E0B" : "#10B981"}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="100 100"
                            strokeDashoffset={zScoreResult.wastingStatus === "Normal" ? "0" : 
                              zScoreResult.wastingStatus.includes("wasting") ? "70" : 
                              zScoreResult.wastingStatus.includes("overweight") || zScoreResult.wastingStatus.includes("obesity") ? "40" : "0"}
                          />
                        </svg>
                      </div>
                      
                      {/* Wasting Z-Score value display - positioned independently */}
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-base font-bold text-gray-800">{zScoreResult.wastingZScore}</div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">Wasting Z-Score</div>
                      <div className={`text-xs font-medium px-3 py-1 ${
                        zScoreResult.wastingStatus === "Normal" ? "bg-green-100 text-green-700" : 
                        zScoreResult.wastingStatus.includes("wasting") ? "bg-red-100 text-red-700" : 
                        zScoreResult.wastingStatus.includes("overweight") || zScoreResult.wastingStatus.includes("obesity") ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>{zScoreResult.wastingStatus}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h5 className="font-medium text-gray-800 mb-2">💡 Recommendations:</h5>
                    <ul className="space-y-1">
                      {zScoreResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {/* Feedback Section (shown before calculation) */}
              {!zScoreResult && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Growth Assessment</h4>
                  <p className="text-sm text-gray-600">Enter the child's measurements above to get personalized growth feedback and recommendations.</p>
                </div>
              )}
            </div>
            {/* Right Box: BMI Calculator */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">BMI Calculator</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                    <input 
                      type="number" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        bmiErrors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="25"
                      value={bmiData.age}
                      onChange={(e) => handleBmiChange('age', e.target.value)}
                    />
                    {bmiErrors.age && <p className="text-xs text-red-500 mt-1">Age is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        bmiErrors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="70"
                      value={bmiData.weight}
                      onChange={(e) => handleBmiChange('weight', e.target.value)}
                    />
                    {bmiErrors.weight && <p className="text-xs text-red-500 mt-1">Weight is required</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        bmiErrors.height ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="175"
                      value={bmiData.height}
                      onChange={(e) => handleBmiChange('height', e.target.value)}
                    />
                    {bmiErrors.height && <p className="text-xs text-red-500 mt-1">Height is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        bmiErrors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      value={bmiData.gender}
                      onChange={(e) => handleBmiChange('gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {bmiErrors.gender && <p className="text-xs text-red-500 mt-1">Gender is required</p>}
                  </div>
                </div>
              </div>
              
              <button 
                className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={calculateBMI}
              >
                Calculate BMI
              </button>
              
              {/* Results Section */}
              {bmiResult && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 BMI Results</h4>
                  
                  {/* BMI Gauge Visualization */}
                  <div className="flex flex-col items-center mb-4">
                    {/* Gradient gauge */}
                    <div className="relative w-40 h-20 mb-4 pt-4">
                      <svg className="w-full h-full" viewBox="0 0 100 60">
                        {/* Gauge background */}
                        <path
                          d="M 10 45 A 30 30 0 0 1 90 45"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                        {/* Filled path based on status */}
                        <path
                          d="M 10 45 A 30 30 0 0 1 90 45"
                          fill="none"
                          stroke={bmiResult.category === "Normal weight" ? "#10B981" : bmiResult.category === "Overweight" ? "#F59E0B" : "#EF4444"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="100 100"
                          strokeDashoffset={bmiResult.category === "Normal weight" ? "0" : bmiResult.category === "Overweight" ? "40" : "70"}
                        />
                      </svg>
                    </div>
                    
                    {/* BMI value display - positioned independently */}
                    <div className="flex flex-col items-center mb-3">
                      <div className="text-xl font-bold text-gray-800">{bmiResult.bmi}</div>
                      <div className="text-xs text-gray-600">BMI</div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={`px-6 py-2 text-sm font-medium ${bmiResult.color}`}>
                      {bmiResult.category}
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h5 className="font-medium text-gray-800 mb-2">💡 Recommendations:</h5>
                    <ul className="space-y-1">
                      {bmiResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Feedback Section */}
              {!bmiResult && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 BMI Assessment</h4>
                  <p className="text-sm text-gray-600">Enter your measurements above to get personalized BMI feedback and recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      
      {/* Nutrition Warning Modal */}
      <AnimatePresence>
        {showNutritionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNutritionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-yellow-500">⚠️</span>
                  Important Notice
                </h3>
                <button
                  onClick={() => setShowNutritionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Warning:</strong> The data used for the calculation and graphics generation come from the World Health Organization. 
                  Use this calculator at your own risk. This calculator may not be accurate or reliable. 
                  By using this calculator you acknowledge any reliance on this calculator shall be at your sole risk.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAcknowledgeWarning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
      