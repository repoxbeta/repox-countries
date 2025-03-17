import { Country, CountryState, Currency, Language, PhoneCode, StateCity } from '../types';
import { CountryAdditional } from '../crawl/types';
import fs from 'fs/promises';
import path from 'path';

async function readFile<T = unknown>(name: string): Promise<T> {
  const resolvedPath = path.resolve(__dirname, `./../metadata/${name}.json`);
  const data = await fs.readFile(resolvedPath, 'utf8');
  return JSON.parse(data) as T;
}

async function getCountries(): Promise<Country[]> {
  return readFile<Country[]>('countries');
}

async function getCountriesAdditional(): Promise<CountryAdditional[]> {
  return readFile<CountryAdditional[]>('countries.additional');
}

async function getStates(): Promise<CountryState[]> {
  return readFile<CountryState[]>('states');
}

async function getCities(): Promise<StateCity[]> {
  return readFile<StateCity[]>('cities');
}

async function getPhoneCodes(): Promise<PhoneCode[]> {
  return readFile<PhoneCode[]>('phone.codes');
}

async function getLanguages(): Promise<Language[]> {
  return readFile<Language[]>('languages');
}

async function getCurrencies(): Promise<Currency[]> {
  return readFile<Currency[]>('currencies');
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
