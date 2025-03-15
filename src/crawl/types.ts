export interface CountryGeoname {
  geonameId: number;        // Unique GeoNames ID
  countryCode: string;      // ISO 3166-1 Alpha-2 country code (e.g., "AD")
  isoAlpha3: string;        // ISO 3166-1 Alpha-3 country code (e.g., "AND")
  isoNumeric: string;       // ISO 3166-1 numeric code (e.g., "020")

  countryName: string;      // Official country name
  capital: string;          // Capital city name
  languages: string;        // Official languages spoken

  continent: string;        // Continent code (e.g., "EU")
  continentName: string;    // Continent full name (e.g., "Europe")

  fipsCode?: string;        // FIPS country code (optional)

  population: number;       // Population count
  areaInSqKm: number;       // Total land area in square kilometers

  currencyCode: string;     // ISO 4217 currency code (e.g., "EUR")
  postalCodeFormat?: string;// Postal code format (if available)

  north: number;            // Northernmost latitude
  south: number;            // Southernmost latitude
  east: number;             // Easternmost longitude
  west: number;             // Westernmost longitude
}

export interface StateGeoname {
  geonameId: number;        // Unique GeoNames ID
  name: string;             // Official state/province name
  toponymName: string;      // Alternative name (if applicable)
  adminCode1: string;       // Internal administrative code for the state
  countryId: string;        // Country ID in GeoNames database
  countryCode: string;      // ISO 3166-1 Alpha-2 country code (e.g., "VN")
  countryName: string;      // Full country name

  population: number;       // Population count
  latitude: number;         // Latitude
  longitude: number;        // Longitude

  adminName1: string;       // Official state/province name (alternative)
  fcl: string;              // Feature class (e.g., "A" for administrative region)
  fclName: string;          // Description of feature class
  fcode: string;            // Feature code (e.g., "ADM1" for first-order division)
  fcodeName: string;        // Feature code description

  adminCodes1: {            // ISO 3166-2 code (if available)
    ISO3166_2?: string;
  };
}

export interface CityGeoname {
  geonameId: number;        // Unique GeoNames ID
  name: string;             // Official city/district name
  toponymName: string;      // Toponym name (alternative name)

  countryId: string;        // Unique GeoNames country ID
  countryCode: string;      // ISO 3166-1 Alpha-2 country code (e.g., "VN")
  countryName: string;      // Official country name

  adminCode1: string;       // Internal state/province code
  adminName1: string;       // Official state/province name
  adminCodes1: {            // ISO 3166-2 subdivision code
    ISO3166_2: string;
  };

  population: number;       // Population count
  lat: number;              // Latitude coordinate
  lng: number;              // Longitude coordinate

  fcl: string;              // Feature class (e.g., "A" for administrative division)
  fclName: string;          // Feature class name (e.g., "country, state, region, ...")
  fcode: string;            // Feature code (e.g., "ADM2" for second-order admin division)
  fcodeName: string;        // Feature code name (e.g., "second-order administrative division")
}

export interface CountryAdditional {
  countryCode: string;     // ISO 3166-1 Alpha-2 country code (e.g., "AF")
  isoAlpha3: string;       // ISO 3166-1 Alpha-3 country code (e.g., "AFG")
  countryName: string;     // Official country name (e.g., "Afghanistan")
  native: string;          // Native country name (e.g., "افغانستان")

  phoneCode: string;       // International dialing code (e.g., "93")

  currency: string;        // ISO 4217 currency code (e.g., "AFN")
  currencyName: string;    // Official currency name (e.g., "Afghan afghani")
  currencySymbol: string;  // Currency symbol (e.g., "؋")

  emoji: string;           // Emoji flag representation (e.g., "🇦🇫")
}
