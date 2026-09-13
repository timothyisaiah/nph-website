import countryMapping from './country-mapping.json';
import dhsCountries from './dhs-countries.json';

export interface CountryOption {
  value: string;
  label: string;
}

export interface CountryIdentity extends CountryOption {
  iso3Code: string | null;
}

type CountryMappingRecord = {
  dhsCode: string;
  countryName: string;
  iso3Code: string | null;
};

// The DHS country codes are not ISO country codes. These corrections cover
// entries that are present in the supplied topology but were omitted by the
// original generated mapping because DHS uses a different code or name.
const ISO3_OVERRIDES: Record<string, string> = {
  ES: 'SLV',
  EK: 'GNQ',
  ER: 'ERI',
  SZ: 'SWZ',
  GU: 'GTM',
  GY: 'GUY',
  IA: 'IND',
  KK: 'KAZ',
  KY: 'KGZ',
  LB: 'LBR',
  MD: 'MDG',
  MV: 'MDV',
  MB: 'MDA',
  MM: 'MMR',
  NM: 'NAM',
  NC: 'NIC',
  NI: 'NER',
  PG: 'PNG',
  WS: 'WSM',
  ST: 'STP',
  TJ: 'TJK',
};

const mappings = new Map(
  (countryMapping as CountryMappingRecord[]).map((country) => [
    country.dhsCode,
    country,
  ]),
);

export const COUNTRY_IDENTITIES: CountryIdentity[] = (dhsCountries as Array<{
  DHS_CountryCode: string;
  CountryName: string;
}>)
  .map((country) => {
    const mapping = mappings.get(country.DHS_CountryCode);
    return {
      value: country.DHS_CountryCode,
      label: country.CountryName,
      iso3Code: ISO3_OVERRIDES[country.DHS_CountryCode] ?? mapping?.iso3Code ?? null,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

export const COUNTRY_OPTIONS: CountryOption[] = COUNTRY_IDENTITIES.map(({ value, label }) => ({
  value,
  label,
}));

export const DEFAULT_COUNTRY = COUNTRY_OPTIONS.find((country) => country.value === 'UG') ?? null;

export const countryByDhsCode = new Map(
  COUNTRY_IDENTITIES.map((country) => [country.value, country]),
);

export const countryByIso3Code = new Map(
  COUNTRY_IDENTITIES.flatMap((country) =>
    country.iso3Code ? [[country.iso3Code, country] as const] : [],
  ),
);
