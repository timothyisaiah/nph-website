import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeVisualization from '../components/globe/GlobeVisualization';
import FeedingTipsCarousel from '../components/carousel/FeedingTipsCarousel';
import { useIndicator } from '../context/IndicatorContext';
import Footer from '../components/layout/Footer';
import { images } from '../assets/images';
import companyLogo from '../assets/Company-logo.jpg';

// Memoized Globe Component to prevent unnecessary re-renders
const MemoizedGlobe = React.memo(({ onError, onIndicatorSelect }: any) => (
  <GlobeVisualization 
    onError={onError} 
    onIndicatorSelect={onIndicatorSelect}
  />
));

const feedingTips = {
  breastfeedingBasics: {
    title: "🤱 Breastfeeding Basics (0-6 months)",
    icon: "🍼",
    tips: [
      "Give only breastmilk for the first 6 months—no water, porridge, or herbal drinks.",
      "Breastmilk contains all the nutrients your baby needs in the first 6 months.",
      "Feed your baby on demand—at least 8 times a day including at night.",
      "Avoid using feeding bottles—they are hard to clean and may cause infections.",
      "In hot weather, breastmilk still provides all the water your baby needs."
    ]
  },
  breastfeedingBest: {
    title: "🤱 Breastfeeding Best Practices",
    icon: "🍼",
    tips: [
      "Start breastfeeding within the first hour of birth to protect your baby from infections.",
      "Skin-to-skin contact right after birth helps your baby start breastfeeding sooner.",
      "Early breastfeeding improves bonding and boosts milk production.",
      "Even C-section babies should be breastfed as soon as the mother is alert.",
      "The first breastmilk (colostrum) is golden and full of antibodies—do not discard it."
    ]
  },
  complementaryStart: {
    title: "🥣 Starting Complementary Foods (6-24 months)",
    icon: "🥄",
    tips: [
      "Start giving mashed and soft foods at 6 months, while continuing breastfeeding.",
      "Feed thick porridge, mashed fruits, soft vegetables, and small pieces of meat.",
      "Introduce one new food at a time and watch for allergies.",
      "Do not replace breastmilk; food complements it.",
      "Ensure food is soft enough to avoid choking."
    ]
  },
  complementaryVariety: {
    title: "🥣 Complementary Feeding Variety",
    icon: "🥄",
    tips: [
      "Feed your child from at least 5 food groups daily.",
      "Include eggs, dairy, grains, fruits, and vegetables every day.",
      "Colorful meals are more nutritious—use orange, green, red vegetables and fruits.",
      "Use local foods—pumpkin, bananas, beans, greens—to add variety.",
      "Diversity helps prevent micronutrient deficiencies."
    ]
  },
  mealFrequency: {
    title: "⏰ Meal Frequency & Growth",
    icon: "🍽️",
    tips: [
      "Feed 6–8-month-olds at least 2–3 meals a day.",
      "Feed 9–23-month-olds 3–4 meals + 1–2 snacks daily.",
      "Children need small frequent meals due to small stomachs.",
      "During illness, feed more often and offer favorite foods.",
      "Extra feeding after sickness helps the child catch up in growth."
    ]
  },
  foodSafety: {
    title: "🧼 Food Safety & Hygiene",
    icon: "🧽",
    tips: [
      "Wash hands with soap before preparing and feeding food.",
      "Clean feeding utensils thoroughly with soap and water.",
      "Serve freshly prepared food. Avoid keeping leftovers.",
      "Boil water used for baby food preparation.",
      "Avoid street food or uncovered food for children."
    ]
  },
  healthyHabits: {
    title: "🍏 Healthy Feeding Habits",
    icon: "🥗",
    tips: [
      "Do not give soda, juice, or sugary drinks to children under 2.",
      "Avoid giving sweets, biscuits, and chips—they displace healthy food.",
      "Herbal teas and concoctions are not safe for babies.",
      "Do not force-feed your child; encourage and offer with love.",
      "Avoid distractions like screens during mealtime."
    ]
  },
  nutritionDiversity: {
    title: "🌽 Nutrition & Food Diversity",
    icon: "🍠",
    tips: [
      "Offer fruits like banana, papaya, and avocado daily.",
      "Include soft-cooked greens like amaranth or pumpkin leaves.",
      "Fruits and vegetables build immunity and prevent disease.",
      "Chop fruits finely or mash to avoid choking.",
      "Serve vegetables in every meal starting at 6 months."
    ]
  },
  proteinCalcium: {
    title: "🥚 Protein, Iron & Calcium",
    icon: "🥚",
    tips: [
      "Give eggs 3–4 times a week for protein and nutrients.",
      "Add small pieces of meat, fish, or liver into meals.",
      "Animal foods help prevent anemia in young children.",
      "Yogurt and milk are great sources of calcium.",
      "Mash or blend meat for easy swallowing."
    ]
  },
  positiveFeeding: {
    title: "😊 Positive Feeding Practices",
    icon: "😊",
    tips: [
      "Make mealtime happy—talk and smile while feeding.",
      "Be patient—offer food slowly and encourage your child.",
      "Respect your child's hunger and fullness cues.",
      "Feed your child in a quiet space with minimal distractions.",
      "Involve older siblings in feeding to make it fun."
    ]
  },
  illnessRecovery: {
    title: "🤒 Illness & Recovery",
    icon: "💊",
    tips: [
      "Offer food and fluids more frequently during illness.",
      "Give small portions more often when appetite is low.",
      "Continue breastfeeding during illness—it helps with recovery.",
      "Use nutrient-dense, soft foods during recovery.",
      "Extra feeding after illness helps regain lost weight."
    ]
  },
  parentalSupport: {
    title: "👨‍👩‍👧 Parental Support & Guidance",
    icon: "👨‍👩‍👧",
    tips: [
      "Fathers should support feeding by helping with chores.",
      "Join a mother support group for shared learning.",
      "Ask health workers when unsure about feeding.",
      "Encourage other caregivers to follow safe feeding practices.",
      "Create a consistent feeding routine to help your child feel secure."
    ]
  }
};

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<any>(null);
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
  const navigate = useNavigate();
  const { setSelectedIndicator } = useIndicator();

  // Memoize globe event handlers
  const handleIndicatorSelect = useCallback((indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    navigate(`/data?indicator=${indicatorId}`);
  }, [setSelectedIndicator, navigate]);

  const handleCountrySelect = useCallback((country: any) => {
    setSelectedCountry(country?.properties?.name || null);
    setCountryData({
      indicators: Math.floor(Math.random() * 50) + 10,
      surveys: Math.floor(Math.random() * 20) + 5,
      lastUpdated: new Date().toLocaleDateString()
    });
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleCalculatorChange = (field: string, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBmiChange = (field: string, value: string) => {
    setBmiData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateZScore = () => {
    const { age, weight, height, gender } = calculatorData;
    
    if (!age || !weight || !height || !gender) {
      alert('Please fill in all fields');
      return;
    }

    // Mock Z-Score calculation (in real implementation, use WHO growth standards)
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    // Simplified mock calculation
    const weightZScore = ((weightNum - 12) / 2) + (Math.random() - 0.5) * 0.5;
    const heightZScore = ((heightNum - 85) / 5) + (Math.random() - 0.5) * 0.5;
    const wastingZScore = ((weightNum / heightNum) - 0.14) / 0.02 + (Math.random() - 0.5) * 0.5;
    
    let weightStatus = 'Normal';
    let heightStatus = 'Normal';
    let wastingStatus = 'Normal';
    
    if (weightZScore < -2) weightStatus = 'Underweight';
    else if (weightZScore > 2) weightStatus = 'Overweight';
    
    if (heightZScore < -2) heightStatus = 'Stunted';
    else if (heightZScore > 2) heightStatus = 'Tall';
    
    if (wastingZScore < -2) wastingStatus = 'Wasted';
    else if (wastingZScore > 2) wastingStatus = 'Overweight';
    
    setZScoreResult({
      weightZScore: weightZScore.toFixed(2),
      heightZScore: heightZScore.toFixed(2),
      wastingZScore: wastingZScore.toFixed(2),
      weightStatus,
      heightStatus,
      wastingStatus,
      recommendations: getRecommendations(weightStatus, heightStatus, wastingStatus)
    });
  };

  const calculateBMI = () => {
    const { age, weight, height, gender } = bmiData;
    
    if (!age || !weight || !height || !gender) {
      alert('Please fill in all fields');
      return;
    }

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Calculate BMI: weight (kg) / height (m)²
    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);

    let bmiCategory = '';
    let bmiColor = '';

    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'bg-yellow-100 text-yellow-700';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = 'bg-green-100 text-green-700';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'bg-orange-100 text-orange-700';
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
    
    if (weightStatus === 'Underweight') {
      recommendations.push('Increase caloric intake with nutrient-dense foods');
      recommendations.push('Consider nutritional supplements under medical supervision');
    } else if (weightStatus === 'Overweight') {
      recommendations.push('Focus on balanced nutrition and physical activity');
      recommendations.push('Limit sugary drinks and processed foods');
    }
    
    if (heightStatus === 'Stunted') {
      recommendations.push('Ensure adequate protein and micronutrient intake');
      recommendations.push('Monitor for underlying health conditions');
    }
    
    if (wastingStatus === 'Wasted') {
      recommendations.push('Immediate nutritional intervention may be needed');
      recommendations.push('Consult healthcare provider for specialized care');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue with current healthy feeding practices');
      recommendations.push('Regular growth monitoring recommended');
    }
    
    return recommendations;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content Section with Globe */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start pt-16 md:pt-24 z-0">
          {/* Globe Container */}
          <div className="w-full md:w-1/2 aspect-square rounded-full overflow-hidden order-2 md:order-1">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700 max-w-md text-center mx-4">
                  <p className="text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <MemoizedGlobe 
                  onError={handleError} 
                  onIndicatorSelect={handleIndicatorSelect}
                />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 order-1 md:order-2 md:pl-12">
            <div className="text-center md:text-left mb-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <img 
                  src={companyLogo}
                  alt="NPH Solutions Logo" 
                  className="w-30 h-30 md:w-24 md:h-24 object-contain rounded-lg shadow-lg"
                />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-800 leading-tight">
                Narratives of Public Health Solutions LTD
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Unlocking health data for community and policy action
              </p>
              
              {/* Services Bullet Points */}
              <div className="mb-10">
                <ul className="space-y-4 text-base md:text-lg text-gray-700">
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium break-words leading-snug">Public health research</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium break-words leading-snug">Monitoring and evaluation of public health interventions</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium break-words leading-snug">Data systems and analytics</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium break-words leading-snug">Health promotion</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('/data')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105 duration-200"
                >
                  Explore All Data
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-lg transform hover:scale-105 duration-200"
                >
                  Learn More
                </button>
              </div>

              {/* Dynamic Country Data Section */}
              {selectedCountry && countryData && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    📊 DHS Data for {selectedCountry}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{countryData.indicators}</div>
                      <div className="text-gray-600">Health Indicators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{countryData.surveys}</div>
                      <div className="text-gray-600">Surveys Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{countryData.lastUpdated}</div>
                      <div className="text-gray-600">Last Updated</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Click on indicators above to explore detailed data for {selectedCountry}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Images Section */}
      <div className="relative z-10 bg-white py-16 md:py-24 mt-16 md:mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Health Tools & Resources</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Box: Dynamic Health Feeding Tips */}
            <FeedingTipsCarousel feedingTips={feedingTips} />
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
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age (months)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="24"
                      value={calculatorData.age}
                      onChange={(e) => handleCalculatorChange('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12.5"
                      value={calculatorData.weight}
                      onChange={(e) => handleCalculatorChange('weight', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="85.2"
                      value={calculatorData.height}
                      onChange={(e) => handleCalculatorChange('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={calculatorData.gender}
                      onChange={(e) => handleCalculatorChange('gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button 
                className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={calculateZScore}
              >
                Calculate Z-Score
              </button>
              
              {/* Results Section */}
              {zScoreResult && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 Growth Assessment Results</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{zScoreResult.weightZScore}</div>
                      <div className="text-xs text-gray-600">Weight Z-Score</div>
                      <div className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        zScoreResult.weightStatus === 'Normal' ? 'bg-green-100 text-green-700' :
                        zScoreResult.weightStatus === 'Underweight' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {zScoreResult.weightStatus}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{zScoreResult.heightZScore}</div>
                      <div className="text-xs text-gray-600">Height Z-Score</div>
                      <div className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        zScoreResult.heightStatus === 'Normal' ? 'bg-green-100 text-green-700' :
                        zScoreResult.heightStatus === 'Stunted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {zScoreResult.heightStatus}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{zScoreResult.wastingZScore}</div>
                      <div className="text-xs text-gray-600">Wasting Z-Score</div>
                      <div className={`text-xs font-medium mt-1 px-2 py-1 rounded ${
                        zScoreResult.wastingStatus === 'Normal' ? 'bg-green-100 text-green-700' :
                        zScoreResult.wastingStatus === 'Wasted' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {zScoreResult.wastingStatus}
                      </div>
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
              
              {/* Feedback Section */}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                      value={bmiData.age}
                      onChange={(e) => handleBmiChange('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="70"
                      value={bmiData.weight}
                      onChange={(e) => handleBmiChange('weight', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="175"
                      value={bmiData.height}
                      onChange={(e) => handleBmiChange('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bmiData.gender}
                      onChange={(e) => handleBmiChange('gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{bmiResult.bmi}</div>
                      <div className="text-xs text-gray-600">BMI</div>
                      <div className={bmiResult.color}>
                        {bmiResult.category}
                      </div>
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
    </div>
  );
};

export default Home; 