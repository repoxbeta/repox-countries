/**
 * Base interface for common properties across Country, State, and City.
 */
export interface Option {
  id: number;           // Unique GeoNames ID
  code: string;         // Unique code
  name: string;         // Official name
  nativeName: string;   // Native language name
  emoji?: string;       // Emoji flag
}

/**
 * Represents a country with geographic and demographic details.
 */
export interface Country extends Option {
  id: number;               // Unique GeoNames ID
  name: string;             // Official country name
  nativeName: string;       // Native language country name
  code: string;             // ISO 3166-1 Alpha-2 country code (e.g., "AD" for Andorra)
  isoAlpha3: string;        // ISO 3166-1 Alpha-3 country code (e.g., "AND" for Andorra)

  continent: string;        // Continent code (e.g., "EU" for Europe)
  continentName: string;    // Continent name (e.g., "Europe")

  phoneCode: string;        // International dialing code
  postalCodeFormat: string; // Postal code format (e.g., "AD###")

  currencyCode: string;     // Official currency code (ISO 4217, e.g., "EUR")
  currencyName: string;     // Official currency name (e.g., "Euro")
  currencySymbol: string;   // Official currency symbol (e.g., "€")

  capital: string;          // Capital city of the country
  languages: string;        // Official languages (ISO 639-1 codes, comma-separated if multiple)

  emoji: string;            // Emoji flag (e.g., "🇦🇩" for Andorra)
}

/**
 * Represents a state/province within a country.
 */
export interface State extends Option {
  id: number;               // Unique GeoNames ID
  name: string;             // Official state/province name
  nativeName: string;       // Native state/province name
  code: string;             // Combine countryCode (ISO) - stateCode (internal) for unique identification
  internalCode: string;     // Internal state/province code by ISO 3166-2 code

  countryId: number; // Unique GeoNames ID of the country
  countryCode: string;      // ISO 3166-1 Alpha-2 country code (e.g., "VN")

  latitude: number;         // Latitude
  longitude: number;        // Longitude
}

/**
 * Represents a city or district within a state.
 */
export interface City extends Option {
  id: number;               // Unique GeoNames ID
  name: string;             // Official city/district name
  nativeName: string;       // Native city/district name
  code: string;             // Combine countryCode (ISO) - stateCode (internal) - GeoNames ID for unique identification

  countryId: number;        // Unique GeoNames ID of the country
  countryCode: string;      // Country ISO code (e.g., "VN")

  stateCode: string;        // Combine countryCode (ISO) - stateCode (internal) for unique identification

  latitude: number;         // Latitude
  longitude: number;        // Longitude
}

/**
 * Represents a mapping of a country to its states.
 */
export interface CountryState {
  countryId: number;
  countryCode: string;
  states: State[];
}

/**
 * Represents a mapping of a state to its cities.
 */
export interface StateCity {
  stateId: number;
  stateCode: string;
  cities: City[];
}

/**
 * Represents a mapping of a country to its states and cities.
 */
export interface CountryStateCity {
  countryId: number;
  countryCode: string;
  states: StateCity[];
}

/**
 * Represents international dialing codes.
 */
export interface PhoneCode {
  countryCode: string;
  phoneCode: string;
  emoji: string;
}

/**
 * Represents currency details.
 */
export interface Currency {
  countryCode: string;
  code: string;      // ISO 4217 currency code
  name: string;      // Currency name
  symbol: string;    // Currency symbol
}

/**
 * Represents language details.
 */
export interface Language {
  code: string;
  name: string;
  native: string;
}
