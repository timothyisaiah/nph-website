import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadCountries() {
  try {
    console.log('Downloading countries from DHS API...');
    
    const response = await fetch('https://api.dhsprogram.com/rest/dhs/countries?returnFields=CountryName,DHS_CountryCode,ISO_Code&f=json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Data || !Array.isArray(data.Data)) {
      throw new Error('Invalid data structure received from API');
    }
    
    console.log(`Downloaded ${data.Data.length} countries`);
    
    // Create the output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save the raw API response
    const rawOutputPath = path.join(outputDir, 'dhs-countries-raw.json');
    fs.writeFileSync(rawOutputPath, JSON.stringify(data, null, 2));
    console.log(`Raw data saved to: ${rawOutputPath}`);
    
    // Save a processed version with just the countries array
    const processedOutputPath = path.join(outputDir, 'dhs-countries.json');
    fs.writeFileSync(processedOutputPath, JSON.stringify(data.Data, null, 2));
    console.log(`Processed data saved to: ${processedOutputPath}`);
    
    // Log some sample data
    console.log('\nSample countries:');
    data.Data.slice(0, 5).forEach(country => {
      console.log(`- ${country.CountryName} (${country.DHS_CountryCode}, ISO: ${country.ISO_Code})`);
    });
    
    console.log('\nDownload completed successfully!');
    
  } catch (error) {
    console.error('Error downloading countries:', error);
    process.exit(1);
  }
}

// Run the download
downloadCountries();
