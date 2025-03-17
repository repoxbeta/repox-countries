import { Country, CountryState, Currency, Language, PhoneCode, StateCity } from '../types';
import { CountryAdditional } from '../crawl/types';

async function readFile<T = unknown>(name: string): Promise<T> {
  return (await import(`./${name}.json`, { assert: { type: 'json' } })).default as T;
}

export async function getCountries(): Promise<Country[]> {
  return readFile<Country[]>('countries');
}

export async function getCountriesAdditional(): Promise<CountryAdditional[]> {
  return readFile<CountryAdditional[]>('countries.additional');
}

export async function getStates(): Promise<CountryState[]> {
  return readFile<CountryState[]>('states');
}

export async function getCities(): Promise<StateCity[]> {
  return readFile<StateCity[]>('cities');
}

export async function getPhoneCodes(): Promise<PhoneCode[]> {
  return readFile<PhoneCode[]>('phone.codes');
}

export async function getLanguages(): Promise<Language[]> {
  return readFile<Language[]>('languages');
}

export async function getCurrencies(): Promise<Currency[]> {
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
