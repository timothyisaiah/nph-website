import axios from 'axios';
import type { Feature, Point, Polygon, MultiPolygon } from 'geojson';

export type CountryFeature = Feature<Point | Polygon | MultiPolygon, {
  name: string;
  iso_a2?: string;
  iso_a3?: string;
  dhs_code?: string;
  highlighted?: boolean;
}>;

class CountryBoundariesService {
  private countries: CountryFeature[] = [];
  private loaded = false;

  async loadBoundaries(): Promise<void> {
    if (this.loaded) return;

    try {
      // Fetch countries from DHS API
      const response = await axios.get('https://api.dhsprogram.com/rest/dhs/countries', {
        params: {
          returnFields: 'CountryName,DHS_CountryCode,ISO_Code',
          f: 'json'
        }
      });

      // Convert to GeoJSON features with point geometry (fallback)
      this.countries = response.data.Data.map((country: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: this.getCountryCoordinates(country.DHS_CountryCode)
        } as Point,
        properties: {
          name: country.CountryName,
          iso_a2: country.ISO_Code,
          iso_a3: country.DHS_CountryCode,
          dhs_code: country.DHS_CountryCode
        }
      }));

      this.loaded = true;
    } catch (error) {
      console.error('Failed to load country boundaries:', error);
      throw error;
    }
  }

  getAllCountries(): CountryFeature[] {
    return this.countries;
  }

  getCountryByCode(code: string): CountryFeature | undefined {
    return this.countries.find(country => 
      country.properties.iso_a2 === code ||
      country.properties.iso_a3 === code ||
      country.properties.dhs_code === code
    );
  }

  // Fallback coordinates for countries (simplified)
  private getCountryCoordinates(dhsCode: string): [number, number] {
    const coordinates: Record<string, [number, number]> = {
      'AF': [67.709953, 33.93911], // Afghanistan
      'AL': [20.168331, 41.153332], // Albania
      'DZ': [1.659626, 28.033886], // Algeria
      'AO': [17.873887, -11.202692], // Angola
      'AR': [-63.616672, -38.416097], // Argentina
      'AM': [45.038189, 40.069099], // Armenia
      'AZ': [47.576927, 40.143105], // Azerbaijan
      'BD': [90.356331, 23.684994], // Bangladesh
      'BJ': [2.315834, 9.30769], // Benin
      'BO': [-63.588653, -16.290154], // Bolivia
      'BW': [24.684866, -22.328474], // Botswana
      'BR': [-51.92528, -14.235004], // Brazil
      'BF': [-1.561593, 12.238333], // Burkina Faso
      'BI': [29.918886, -3.373056], // Burundi
      'KH': [104.990963, 12.565679], // Cambodia
      'CM': [12.354722, 7.369722], // Cameroon
      'TD': [18.732207, 15.454166], // Chad
      'CL': [-71.542969, -35.675147], // Chile
      'CO': [-74.297333, 4.570868], // Colombia
      'CG': [15.827659, -0.228021], // Congo
      'CD': [21.758664, -4.038333], // DR Congo
      'CR': [-83.753428, 9.928069], // Costa Rica
      'CI': [-5.54708, 7.539989], // Cote d'Ivoire
      'DO': [-70.162651, 18.735693], // Dominican Republic
      'EC': [-78.183406, -1.831239], // Ecuador
      'EG': [30.802498, 26.820553], // Egypt
      'SV': [-88.89653, 13.794185], // El Salvador
      'ET': [40.489673, 9.145], // Ethiopia
      'GA': [11.609444, -0.803689], // Gabon
      'GM': [-15.310139, 13.443182], // Gambia
      'GH': [-1.023194, 7.946527], // Ghana
      'GT': [-90.230759, 15.783471], // Guatemala
      'GN': [-9.696645, 9.945587], // Guinea
      'GW': [-15.180413, 11.803749], // Guinea-Bissau
      'GY': [-58.93018, 4.860416], // Guyana
      'HT': [-72.285215, 18.971187], // Haiti
      'HN': [-86.241905, 15.199999], // Honduras
      'IN': [78.96288, 20.593684], // India
      'ID': [113.921327, -0.789275], // Indonesia
      'JO': [36.238414, 30.585164], // Jordan
      'KZ': [66.923684, 48.019573], // Kazakhstan
      'KE': [37.906193, -0.023559], // Kenya
      'KG': [74.766098, 41.20438], // Kyrgyzstan
      'LA': [102.495496, 19.85627], // Laos
      'LS': [28.233608, -29.609988], // Lesotho
      'LR': [-9.429499, 6.428055], // Liberia
      'MG': [46.869107, -18.766947], // Madagascar
      'MW': [34.301525, -13.254308], // Malawi
      'ML': [-3.996166, 17.570692], // Mali
      'MR': [-10.940835, 21.00789], // Mauritania
      'MX': [-102.552784, 23.634501], // Mexico
      'MD': [28.369885, 47.411631], // Moldova
      'MA': [-7.09262, 31.791702], // Morocco
      'MZ': [35.529562, -18.665695], // Mozambique
      'MM': [95.956223, 21.916221], // Myanmar
      'NA': [17.209635, -22.95764], // Namibia
      'NP': [84.124008, 28.394857], // Nepal
      'NI': [-85.207229, 12.865416], // Nicaragua
      'NE': [8.081666, 17.607789], // Niger
      'NG': [8.675277, 9.081999], // Nigeria
      'PK': [69.345116, 30.375321], // Pakistan
      'PA': [-80.782127, 8.537981], // Panama
      'PG': [143.95555, -6.315001], // Papua New Guinea
      'PY': [-58.443832, -23.442503], // Paraguay
      'PE': [-75.015152, -9.190967], // Peru
      'PH': [121.774017, 12.879721], // Philippines
      'RW': [29.873888, -1.940278], // Rwanda
      'SN': [-14.452362, 14.497401], // Senegal
      'SL': [-11.779889, 8.460555], // Sierra Leone
      'ZA': [24.991639, -30.559482], // South Africa
      'LK': [80.771797, 7.873054], // Sri Lanka
      'SD': [30.217636, 12.862807], // Sudan
      'TZ': [34.888822, -6.369028], // Tanzania
      'TG': [0.824782, 8.619543], // Togo
      'TN': [9.537499, 33.886917], // Tunisia
      'TR': [35.243322, 38.963745], // Turkey
      'UG': [32.290275, 1.373333], // Uganda
      'UA': [31.16558, 48.379433], // Ukraine
      'UZ': [64.585262, 41.377491], // Uzbekistan
      'VN': [108.277199, 14.058324], // Vietnam
      'ZM': [27.849332, -13.133897], // Zambia
      'ZW': [29.154857, -19.015438], // Zimbabwe
    };

    return coordinates[dhsCode] || [0, 0]; // Default to [0, 0] if not found
  }
}

export const countryBoundariesService = new CountryBoundariesService(); 