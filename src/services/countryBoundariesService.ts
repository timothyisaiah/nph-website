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
  private centroids: Array<{
    alpha2: string;
    alpha3: string;
    latitude: number;
    longitude: number;
    name: string;
  }> = [];

  async loadBoundaries(): Promise<void> {
    if (this.loaded) return;

    try {
      // Load centroids from JSON file
      const centroidsModule = await import('../data/country-centroids.json');
      this.centroids = centroidsModule.default || centroidsModule;

      // Fetch countries from DHS API
      const response = await axios.get('https://api.dhsprogram.com/rest/dhs/countries', {
        params: {
          returnFields: 'CountryName,DHS_CountryCode,ISO_Code',
          f: 'json'
        }
      });

      // Convert to GeoJSON features with point geometry (using centroids)
      this.countries = response.data.Data.map((country: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: this.getCountryCoordinates(country.DHS_CountryCode, country.ISO_Code)
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

  // Get coordinates from loaded centroids file
  private getCountryCoordinates(dhsCode: string, isoA2?: string): [number, number] {
    if (!this.centroids.length) return [0, 0];
    // Try to match by alpha2, alpha3, or dhsCode
    const centroid = this.centroids.find(c =>
      c.alpha2 === dhsCode ||
      c.alpha3 === dhsCode ||
      c.alpha2 === isoA2 ||
      c.alpha3 === isoA2
    );
    if (centroid) {
      return [centroid.longitude, centroid.latitude];
    }
    return [0, 0]; // Default if not found
  }
}

export const countryBoundariesService = new CountryBoundariesService(); 