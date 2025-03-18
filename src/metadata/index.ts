import { Country, CountryState, Currency, Language, PhoneCode, StateCity } from '../types';
import { CountryAdditional } from '../crawl/types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getAbsolutePath(fileName: string): string {
  let dirname;
  
  // is ESM env
  if (typeof import.meta !== 'undefined') {
    dirname = path.dirname(fileURLToPath(import.meta.url));
  } else {
    dirname = __dirname; // CommonJS
  }

  return path.join(dirname, fileName);
}

function readFile<T = unknown>(name: string): T {
  const filePath = getAbsolutePath(`./${name}.json`);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

export function getCountries(): Country[] {
  try {
    return readFile<Country[]>('countries');
  } catch (error) {
    return [];
  }
}

export function getCountriesAdditional(): CountryAdditional[] {
  try {
    return readFile<CountryAdditional[]>('countries.additional');
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function getStates(countryCode: string): CountryState | undefined {
  try {
    const cCode = countryCode.toLocaleLowerCase();
    return readFile<CountryState>(`countries/${cCode}/${cCode}.states`);
  } catch (error) {
    return undefined;
  }
}

export function getCities(countryCode: string, stateCode: string): StateCity | undefined {
  try {
    const cCode = countryCode.toLocaleLowerCase();
    const sCode = stateCode.toLocaleLowerCase();
    return readFile<StateCity>(`countries/${cCode}/${sCode}.cities`);
  } catch (error) {
    return undefined;
  }
}

export function getPhoneCodes(): PhoneCode[] {
  try {
    return readFile<PhoneCode[]>('phone.codes');
  } catch (error) {
    return [];
  }
}

export function getLanguages(): Language[] {
  try {
    return readFile<Language[]>('languages');
  } catch (error) {
    return [];
  }
}

export function getCurrencies(): Currency[] {
  try {
    return readFile<Currency[]>('currencies');
  } catch (error) {
    return [];
  }
}

export default {
  getCountries,
  getCountriesAdditional,
  getStates,
  getCities,
  getPhoneCodes,
  getLanguages,
  getCurrencies,
};
