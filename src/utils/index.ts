import {
  Option,
  Country,
  State,
  City,
  StateCity,
  CountryStateCity,
  PhoneCode,
  Currency,
  Language,
} from '../types';
import Metadata from './../metadata';

const countries = Metadata.getCountries();
const phoneCodes = Metadata.getPhoneCodes();
const currencies = Metadata.getCurrencies();
const languages = Metadata.getLanguages();

export const getCountries = (): Country[] => countries;
export const getStates = Metadata.getStates;
export const getCities = Metadata.getCities;
export const getPhoneCodes = (): PhoneCode[] => phoneCodes;
export const getCurrencies = (): Currency[] => currencies;
export const getLanguages = (): Language[] => languages;

export const CountryOptions = async (): Promise<Option[]> => {
  return countries.map((e) => ({
    id: e.id,
    code: e.name,
    name: e.name,
    nativeName: e.nativeName,
    emoji: e.emoji,
  })) as Option[];
};

export const CountryById = (id: number): Country | undefined => {
  return countries.find((e) => e.id === id);
};

export const CountryByCode = (code: string): Country | undefined => {
  return countries.find((e) => e.code === code);
};

export const StatesByCountryId = (countryId: number): State[] => {
  const countryById = CountryById(countryId);
  if (!countryById) return [];

  const countryState = getStates(countryById.code);
  return (countryState && countryState.states) ?? [];
};

export const StatesByCountryCode = (countryCode: string): State[] => {
  const countryState = getStates(countryCode);
  return (countryState && countryState.states) ?? [];
};

export const CitiesByStateCode = (countryCode: string, stateCode: string): City[] => {
  const stateCity = getCities(countryCode, stateCode);
  return (stateCity && stateCity.cities) ?? [];
};

/** 
 * Get all info contains country, states and cities of specific country code.
 */
export const CountryStateCities = (countryCode: string): CountryStateCity | undefined => {
  const countryState = getStates(countryCode);
  if (!countryState) return undefined;

  const stateCities = countryState.states.map((state) => {
    const cities = CitiesByStateCode(state.countryCode, state.code);
    return {
      stateId: state.id,
      stateCode: state.code,
      cities,
    } as StateCity;
  });

  return {
    countryId: countryState.countryId,
    countryCode: countryState.countryCode,
    states: stateCities,
  } as CountryStateCity;
};

export const CountryStateCitiesByCountryId = (countryId: number): CountryStateCity | undefined => {
  const countryById = CountryById(countryId);
  if (!countryById) return undefined;
  return CountryStateCities(countryById.code);
};

export const PhoneCodeByCountryCode = (countryCode: string): PhoneCode | undefined => {
  return phoneCodes.find((e) => e.countryCode === countryCode);
};

export const CurrencyByCountryCode = (countryCode: string): Currency | undefined => {
  return currencies.find((e) => e.countryCode === countryCode);
};

export const CurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find((e) => e.code === code);
};

export const LanguageByCode = (code: string): Language | undefined => {
  return languages.find((e) => e.code === code);
};

/**
 * Normalize a string by removing diacritics and converting to lowercase.
 */
export const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
