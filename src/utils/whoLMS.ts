// WHO LMS Z-Score Calculator
// Based on WHO Child Growth Standards and LMS methodology

// Core LMS calculation function
function zFromLMS(x: number, { L, M, S }: { L: number; M: number; S: number }): number {
  if (!Number.isFinite(x) || !Number.isFinite(L) || !Number.isFinite(M) || !Number.isFinite(S)) {
    throw new Error("Invalid inputs to LMS z-score");
  }
  return L !== 0 ? ((x / M) ** L - 1) / (L * S) : Math.log(x / M) / S;
}

// Input validation
function validateNumber(n: any, name: string): number {
  const v = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(v) || v <= 0) throw new Error(`${name} must be a positive number`);
  return v;
}

// Classification functions
function classifyWAZ(z: number): string {
  if (z < -3) return "Severely underweight";
  if (z < -2) return "Moderately underweight";
  return "Normal"; // WAZ not used for overweight classification
}

function classifyHAZ(z: number): string {
  if (z < -3) return "Severely stunted";
  if (z < -2) return "Stunted";
  return "Normal";
}

function classifyWHZorBAZ(z: number): string {
  if (z < -3) return "Severe wasting";
  if (z < -2) return "Wasting";
  if (z > 3) return "Obesity";
  if (z > 2) return "Overweight";
  return "Normal";
}

// Simplified WHO LMS tables (sample data - in practice, you'd use complete WHO tables)
// These are approximate values for demonstration - real implementation should use complete WHO data
const WHO_LMS_TABLES = {
  // Weight-for-age (WAZ) - Boys 0-60 months
  WAZ_MALE: {
    0: { L: -0.0631, M: 3.530, S: 0.15218 },
    1: { L: 0.3448, M: 4.470, S: 0.11395 },
    2: { L: 0.1977, M: 5.567, S: 0.10125 },
    3: { L: 0.1050, M: 6.376, S: 0.09570 },
    6: { L: -0.0647, M: 7.929, S: 0.09272 },
    9: { L: -0.2020, M: 8.789, S: 0.09354 },
    12: { L: -0.3153, M: 9.568, S: 0.09524 },
    18: { L: -0.5117, M: 10.662, S: 0.09947 },
    24: { L: -0.6767, M: 11.542, S: 0.10384 },
    30: { L: -0.8173, M: 12.318, S: 0.10882 },
    36: { L: -0.9377, M: 13.024, S: 0.11394 },
    42: { L: -1.0434, M: 13.669, S: 0.11908 },
    48: { L: -1.1377, M: 14.257, S: 0.12418 },
    54: { L: -1.2228, M: 14.792, S: 0.12925 },
    60: { L: -1.3003, M: 15.276, S: 0.13430 }
  },
  // Weight-for-age (WAZ) - Girls 0-60 months
  WAZ_FEMALE: {
    0: { L: -0.0631, M: 3.400, S: 0.14602 },
    1: { L: 0.3448, M: 4.150, S: 0.11047 },
    2: { L: 0.1977, M: 5.128, S: 0.09872 },
    3: { L: 0.1050, M: 5.845, S: 0.09370 },
    6: { L: -0.0647, M: 7.297, S: 0.09056 },
    9: { L: -0.2020, M: 8.103, S: 0.09133 },
    12: { L: -0.3153, M: 8.823, S: 0.09293 },
    18: { L: -0.5117, M: 9.851, S: 0.09695 },
    24: { L: -0.6767, M: 10.665, S: 0.10111 },
    30: { L: -0.8173, M: 11.397, S: 0.10588 },
    36: { L: -0.9377, M: 12.072, S: 0.11079 },
    42: { L: -1.0434, M: 12.695, S: 0.11573 },
    48: { L: -1.1377, M: 13.266, S: 0.12071 },
    54: { L: -1.2228, M: 13.789, S: 0.12574 },
    60: { L: -1.3003, M: 14.266, S: 0.13082 }
  },
  // Height-for-age (HAZ) - Boys 0-60 months
  HAZ_MALE: {
    0: { L: 1.0000, M: 49.884, S: 0.03838 },
    1: { L: 1.0000, M: 54.724, S: 0.03838 },
    2: { L: 1.0000, M: 58.425, S: 0.03838 },
    3: { L: 1.0000, M: 61.429, S: 0.03838 },
    6: { L: 1.0000, M: 67.623, S: 0.03838 },
    9: { L: 1.0000, M: 72.247, S: 0.03838 },
    12: { L: 1.0000, M: 76.755, S: 0.03838 },
    18: { L: 1.0000, M: 85.715, S: 0.03838 },
    24: { L: 1.0000, M: 92.562, S: 0.03838 },
    30: { L: 1.0000, M: 98.105, S: 0.03838 },
    36: { L: 1.0000, M: 103.317, S: 0.03838 },
    42: { L: 1.0000, M: 108.194, S: 0.03838 },
    48: { L: 1.0000, M: 112.731, S: 0.03838 },
    54: { L: 1.0000, M: 116.929, S: 0.03838 },
    60: { L: 1.0000, M: 120.788, S: 0.03838 }
  },
  // Height-for-age (HAZ) - Girls 0-60 months
  HAZ_FEMALE: {
    0: { L: 1.0000, M: 49.147, S: 0.03790 },
    1: { L: 1.0000, M: 53.687, S: 0.03790 },
    2: { L: 1.0000, M: 57.067, S: 0.03790 },
    3: { L: 1.0000, M: 59.802, S: 0.03790 },
    6: { L: 1.0000, M: 65.731, S: 0.03790 },
    9: { L: 1.0000, M: 70.143, S: 0.03790 },
    12: { L: 1.0000, M: 74.440, S: 0.03790 },
    18: { L: 1.0000, M: 83.592, S: 0.03790 },
    24: { L: 1.0000, M: 90.200, S: 0.03790 },
    30: { L: 1.0000, M: 95.250, S: 0.03790 },
    36: { L: 1.0000, M: 99.000, S: 0.03790 },
    42: { L: 1.0000, M: 102.500, S: 0.03790 },
    48: { L: 1.0000, M: 105.750, S: 0.03790 },
    54: { L: 1.0000, M: 108.750, S: 0.03790 },
    60: { L: 1.0000, M: 111.500, S: 0.03790 }
  },
  // Weight-for-height (WHZ) - Boys 65-120 cm
  WHZ_MALE: {
    65: { L: 0.0000, M: 7.400, S: 0.10000 },
    70: { L: 0.0000, M: 8.300, S: 0.10000 },
    75: { L: 0.0000, M: 9.200, S: 0.10000 },
    80: { L: 0.0000, M: 10.100, S: 0.10000 },
    85: { L: 0.0000, M: 11.000, S: 0.10000 },
    90: { L: 0.0000, M: 12.000, S: 0.10000 },
    95: { L: 0.0000, M: 13.100, S: 0.10000 },
    100: { L: 0.0000, M: 14.200, S: 0.10000 },
    105: { L: 0.0000, M: 15.300, S: 0.10000 },
    110: { L: 0.0000, M: 16.500, S: 0.10000 },
    115: { L: 0.0000, M: 17.700, S: 0.10000 },
    120: { L: 0.0000, M: 18.900, S: 0.10000 }
  },
  // Weight-for-height (WHZ) - Girls 65-120 cm
  WHZ_FEMALE: {
    65: { L: 0.0000, M: 7.200, S: 0.10000 },
    70: { L: 0.0000, M: 8.100, S: 0.10000 },
    75: { L: 0.0000, M: 9.000, S: 0.10000 },
    80: { L: 0.0000, M: 9.900, S: 0.10000 },
    85: { L: 0.0000, M: 10.800, S: 0.10000 },
    90: { L: 0.0000, M: 11.700, S: 0.10000 },
    95: { L: 0.0000, M: 12.600, S: 0.10000 },
    100: { L: 0.0000, M: 13.500, S: 0.10000 },
    105: { L: 0.0000, M: 14.400, S: 0.10000 },
    110: { L: 0.0000, M: 15.300, S: 0.10000 },
    115: { L: 0.0000, M: 16.200, S: 0.10000 },
    120: { L: 0.0000, M: 17.100, S: 0.10000 }
  }
};

// Helper function to get LMS values by interpolation
function getLMSByAge(ageMonths: number, sex: string, indicator: 'WAZ' | 'HAZ'): { L: number; M: number; S: number } {
  const tableKey = `${indicator}_${sex.toUpperCase()}` as keyof typeof WHO_LMS_TABLES;
  const table = WHO_LMS_TABLES[tableKey];
  
  if (!table) {
    throw new Error(`No LMS table found for ${indicator} ${sex}`);
  }
  
  // Find the closest age in the table
  const ages = Object.keys(table).map(Number).sort((a, b) => a - b);
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (ageMonths >= ages[i] && ageMonths <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  // If age is outside the range, use the closest boundary
  if (ageMonths < lowerAge) {
    return table[lowerAge];
  }
  if (ageMonths > upperAge) {
    return table[upperAge];
  }
  
  // Interpolate between the two closest ages
  const lowerLMS = table[lowerAge];
  const upperLMS = table[upperAge];
  const ratio = (ageMonths - lowerAge) / (upperAge - lowerAge);
  
  return {
    L: lowerLMS.L + (upperLMS.L - lowerLMS.L) * ratio,
    M: lowerLMS.M + (upperLMS.M - lowerLMS.M) * ratio,
    S: lowerLMS.S + (upperLMS.S - lowerLMS.S) * ratio
  };
}

// Helper function to get LMS values by height for WHZ
function getLMSByHeight(heightCm: number, sex: string): { L: number; M: number; S: number } {
  const tableKey = `WHZ_${sex.toUpperCase()}` as keyof typeof WHO_LMS_TABLES;
  const table = WHO_LMS_TABLES[tableKey];
  
  if (!table) {
    throw new Error(`No WHZ LMS table found for ${sex}`);
  }
  
  // Find the closest height in the table
  const heights = Object.keys(table).map(Number).sort((a, b) => a - b);
  let lowerHeight = heights[0];
  let upperHeight = heights[heights.length - 1];
  
  for (let i = 0; i < heights.length - 1; i++) {
    if (heightCm >= heights[i] && heightCm <= heights[i + 1]) {
      lowerHeight = heights[i];
      upperHeight = heights[i + 1];
      break;
    }
  }
  
  // If height is outside the range, use the closest boundary
  if (heightCm < lowerHeight) {
    return table[lowerHeight];
  }
  if (heightCm > upperHeight) {
    return table[upperHeight];
  }
  
  // Interpolate between the two closest heights
  const lowerLMS = table[lowerHeight];
  const upperLMS = table[upperHeight];
  const ratio = (heightCm - lowerHeight) / (upperHeight - lowerHeight);
  
  return {
    L: lowerLMS.L + (upperLMS.L - lowerLMS.L) * ratio,
    M: lowerLMS.M + (upperLMS.M - lowerLMS.M) * ratio,
    S: lowerLMS.S + (upperLMS.S - lowerLMS.S) * ratio
  };
}

// Main calculation function
export function calculateGrowthZScores({ 
  ageMonths, 
  weightKg, 
  heightCm, 
  sex 
}: { 
  ageMonths: number; 
  weightKg: number; 
  heightCm: number; 
  sex: string; 
}): {
  waz: number;
  haz: number;
  whzOrBaz: number;
  weightStatus: string;
  heightStatus: string;
  nutritionStatus: string;
} {
  const age = validateNumber(ageMonths, "Age (months)");
  const wt = validateNumber(weightKg, "Weight (kg)");
  const ht = validateNumber(heightCm, "Height (cm)");
  
  if (!["male", "female"].includes(String(sex).toLowerCase())) {
    throw new Error("Sex must be 'male' or 'female'");
  }

  // Get LMS values for each indicator
  const wazLMS = getLMSByAge(age, sex, 'WAZ');
  const hazLMS = getLMSByAge(age, sex, 'HAZ');
  
  // For 0–5y use WHZ (weight-for-height); for 5–19y use BAZ (BMI-for-age)
  const useWHZ = age <= 60;
  let whzOrBazLMS;
  
  if (useWHZ) {
    whzOrBazLMS = getLMSByHeight(ht, sex);
  } else {
    // For older children, we'd need BMI-for-age tables
    // For now, using simplified approach
    whzOrBazLMS = { L: 1.0, M: 16.0, S: 0.1 }; // Simplified BMI reference
  }

  // Calculate z-scores
  const waz = zFromLMS(wt, wazLMS);
  const haz = zFromLMS(ht, hazLMS);
  
  let whzOrBaz;
  if (useWHZ) {
    whzOrBaz = zFromLMS(wt, whzOrBazLMS);
  } else {
    const bmi = wt / ((ht / 100) ** 2);
    whzOrBaz = zFromLMS(bmi, whzOrBazLMS);
  }

  return {
    waz,
    haz,
    whzOrBaz,
    weightStatus: classifyWAZ(waz),
    heightStatus: classifyHAZ(haz),
    nutritionStatus: classifyWHZorBAZ(whzOrBaz),
  };
}

// Export individual functions for testing
export {
  zFromLMS,
  validateNumber,
  classifyWAZ,
  classifyHAZ,
  classifyWHZorBAZ,
  getLMSByAge,
  getLMSByHeight
};
