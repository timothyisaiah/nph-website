import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mapCountries() {
  try {
    console.log('Mapping DHS countries with topology data...');
    
    // Read the DHS countries data
    const dhsCountriesPath = path.join(__dirname, '..', 'src', 'data', 'dhs-countries.json');
    const dhsCountries = JSON.parse(fs.readFileSync(dhsCountriesPath, 'utf8'));
    
    // Read the shortcodes (ISO3 codes from topology)
    const shortcodesPath = path.join(__dirname, '..', 'src', 'data', 'shortcodes.js');
    const shortcodesContent = fs.readFileSync(shortcodesPath, 'utf8');
    
    // Extract the array from the shortcodes file
    const shortcodesMatch = shortcodesContent.match(/const R=\[([^\]]+)\]/);
    if (!shortcodesMatch) {
      throw new Error('Could not parse shortcodes file');
    }
    
    const shortcodes = shortcodesMatch[1].split(',').map(code => code.replace(/"/g, '').trim());
    
    console.log(`Found ${dhsCountries.length} DHS countries`);
    console.log(`Found ${shortcodes.length} topology countries`);
    
    // Create a mapping object
    const countryMapping = [];
    
    // Map DHS countries to topology countries
    dhsCountries.forEach(dhsCountry => {
      const dhsCode = dhsCountry.DHS_CountryCode;
      const countryName = dhsCountry.CountryName;
      
      // Try to find matching ISO3 code in shortcodes
      // This is a simplified mapping - in practice, you'd need a more sophisticated mapping
      let iso3Code = null;
      
      // Some common mappings
      const commonMappings = {
        'AF': 'AFG', // Afghanistan
        'AL': 'ALB', // Albania
        'AO': 'AGO', // Angola
        'AM': 'ARM', // Armenia
        'AZ': 'AZE', // Azerbaijan
        'BD': 'BGD', // Bangladesh
        'BJ': 'BEN', // Benin
        'BO': 'BOL', // Bolivia
        'BT': 'BWA', // Botswana
        'BR': 'BRA', // Brazil
        'BF': 'BFA', // Burkina Faso
        'BU': 'BDI', // Burundi
        'KH': 'KHM', // Cambodia
        'CM': 'CMR', // Cameroon
        'CV': 'CPV', // Cape Verde
        'CF': 'CAF', // Central African Republic
        'TD': 'TCD', // Chad
        'CO': 'COL', // Colombia
        'KM': 'COM', // Comoros
        'CG': 'COG', // Congo
        'CD': 'COD', // Congo Democratic Republic
        'CI': 'CIV', // Cote d'Ivoire
        'DR': 'DOM', // Dominican Republic
        'EC': 'ECU', // Ecuador
        'EG': 'EGY', // Egypt
        'ES': 'SLV', // El Salvador
        'EK': 'GNQ', // Equatorial Guinea
        'ER': 'ERI', // Eritrea
        'SZ': 'SWZ', // Eswatini
        'ET': 'ETH', // Ethiopia
        'GA': 'GAB', // Gabon
        'GM': 'GMB', // Gambia
        'GH': 'GHA', // Ghana
        'GU': 'GTM', // Guatemala
        'GN': 'GIN', // Guinea
        'GY': 'GUY', // Guyana
        'GW': 'GNB', // Guinea-Bissau
        'HT': 'HTI', // Haiti
        'HN': 'HND', // Honduras
        'IA': 'IND', // India
        'ID': 'IDN', // Indonesia
        'JO': 'JOR', // Jordan
        'KK': 'KAZ', // Kazakhstan
        'KE': 'KEN', // Kenya
        'KY': 'KGZ', // Kyrgyz Republic
        'LA': 'LAO', // Laos
        'LS': 'LSO', // Lesotho
        'LB': 'LBR', // Liberia
        'MD': 'MDG', // Madagascar
        'MV': 'MDV', // Maldives
        'MW': 'MWI', // Malawi
        'ML': 'MLI', // Mali
        'MR': 'MRT', // Mauritania
        'MU': 'MUS', // Mauritius
        'MX': 'MEX', // Mexico
        'MB': 'MDA', // Moldova
        'MA': 'MAR', // Morocco
        'MZ': 'MOZ', // Mozambique
        'MM': 'MMR', // Myanmar
        'NM': 'NAM', // Namibia
        'NP': 'NPL', // Nepal
        'NC': 'NIC', // Nicaragua
        'NI': 'NER', // Niger
        'NG': 'NGA', // Nigeria
        'PK': 'PAK', // Pakistan
        'PG': 'PNG', // Papua New Guinea
        'PY': 'PRY', // Paraguay
        'PE': 'PER', // Peru
        'PH': 'PHL', // Philippines
        'RW': 'RWA', // Rwanda
        'WS': 'WSM', // Samoa
        'ST': 'STP', // Sao Tome and Principe
        'SN': 'SEN', // Senegal
        'SL': 'SLE', // Sierra Leone
        'ZA': 'ZAF', // South Africa
        'LK': 'LKA', // Sri Lanka
        'SD': 'SDN', // Sudan
        'TJ': 'TJK', // Tajikistan
        'TZ': 'TZA', // Tanzania
        'TH': 'THA', // Thailand
        'TL': 'TLS', // Timor-Leste
        'TG': 'TGO', // Togo
        'TT': 'TTO', // Trinidad and Tobago
        'TN': 'TUN', // Tunisia
        'TR': 'TUR', // Turkey
        'TM': 'TKM', // Turkmenistan
        'UG': 'UGA', // Uganda
        'UA': 'UKR', // Ukraine
        'UZ': 'UZB', // Uzbekistan
        'VN': 'VNM', // Vietnam
        'YE': 'YEM', // Yemen
        'ZM': 'ZMB', // Zambia
        'ZW': 'ZWE', // Zimbabwe
      };
      
      iso3Code = commonMappings[dhsCode];
      
      if (iso3Code && shortcodes.includes(iso3Code)) {
        countryMapping.push({
          dhsCode,
          countryName,
          iso3Code,
          hasGeometry: true
        });
      } else {
        countryMapping.push({
          dhsCode,
          countryName,
          iso3Code: null,
          hasGeometry: false
        });
      }
    });
    
    // Save the mapping
    const mappingPath = path.join(__dirname, '..', 'src', 'data', 'country-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(countryMapping, null, 2));
    
    // Log statistics
    const mappedCountries = countryMapping.filter(c => c.hasGeometry);
    const unmappedCountries = countryMapping.filter(c => !c.hasGeometry);
    
    console.log(`\nMapping completed:`);
    console.log(`- Total DHS countries: ${countryMapping.length}`);
    console.log(`- Successfully mapped: ${mappedCountries.length}`);
    console.log(`- Unmapped: ${unmappedCountries.length}`);
    
    console.log(`\nMapped countries:`);
    mappedCountries.slice(0, 10).forEach(country => {
      console.log(`- ${country.countryName} (${country.dhsCode} → ${country.iso3Code})`);
    });
    
    if (unmappedCountries.length > 0) {
      console.log(`\nUnmapped countries:`);
      unmappedCountries.slice(0, 10).forEach(country => {
        console.log(`- ${country.countryName} (${country.dhsCode})`);
      });
    }
    
    console.log(`\nMapping saved to: ${mappingPath}`);
    
  } catch (error) {
    console.error('Error mapping countries:', error);
    process.exit(1);
  }
}

// Run the mapping
mapCountries();


