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

export const getCountries = Metadata.getCountries;
export const getStates = Metadata.getStates;
export const getCities = Metadata.getCities;
export const getPhoneCodes = Metadata.getPhoneCodes;
export const getCurrencies = Metadata.getCurrencies;
export const getLanguages = Metadata.getLanguages;

export const CountryOptions = async (): Promise<Option[]> => {
  const countries = await getCountries();
  return countries.map((e) => ({
    id: e.id,
    code: e.name,
    name: e.name,
    nativeName: e.nativeName,
    emoji: e.emoji,
  })) as Option[];
};

export const CountryById = async (id: number): Promise<Country | undefined> => {
  const countries = await getCountries();
  return countries.find((e) => e.id === id);
};

export const CountryByCode = async (code: string): Promise<Country | undefined> => {
  const countries = await getCountries();
  return countries.find((e) => e.code === code);
};

export const StatesByCountryId = async (countryId: number): Promise<State[]> => {
  const countryStates = await getStates();
  const countryState = countryStates.find((e) => e.countryId === countryId);
  return (countryState && countryState.states) ?? [];
};

export const StatesByCountryCode = async (countryCode: string): Promise<State[]> => {
  const countryStates = await getStates();
  const countryState = countryStates.find((e) => e.countryCode === countryCode);
  return (countryState && countryState.states) ?? [];
};

export const CitiesByStateId = async (stateId: number): Promise<City[]> => {
  const stateCities = await getCities();
  const stateCity = stateCities.find((e) => e.stateId === stateId);
  return (stateCity && stateCity.cities) ?? [];
};

export const CitiesByStateCode = async (stateCode: string): Promise<City[]> => {
  const stateCities = await getCities();
  const stateCity = stateCities.find((e) => e.stateCode === stateCode);
  return (stateCity && stateCity.cities) ?? [];
};

export const CountryStateCities = async (): Promise<CountryStateCity[]> => {
  const countryStates = await getStates();

  return Promise.all(
    countryStates.map(async (countryState) => {
      const states = await Promise.all(
        countryState.states.map(async (state) => {
          const cities = await CitiesByStateId(state.id);
          return {
            stateId: state.id,
            stateCode: state.code,
            cities,
          } as StateCity;
        })
      );

      return {
        countryId: countryState.countryId,
        countryCode: countryState.countryCode,
        states,
      } as CountryStateCity;
    })
  );
};

export const CountryStateCitiesByCountryId = async (countryId: number): Promise<CountryStateCity | undefined> => {
  const countryStateCities = await CountryStateCities();
  return countryStateCities.find((e) => e.countryId === countryId);
};

export const PhoneCodeByCountryCode = async (countryCode: string): Promise<PhoneCode | undefined> => {
  const phoneCodes = await getPhoneCodes();
  return phoneCodes.find((e) => e.countryCode === countryCode);
};

export const CurrencyByCountryCode = async (countryCode: string): Promise<Currency | undefined> => {
  const currencies = await getCurrencies();
  return currencies.find((e) => e.countryCode === countryCode);
};

export const CurrencyByCode = async (code: string): Promise<Currency | undefined> => {
  const currencies = await getCurrencies();
  return currencies.find((e) => e.code === code);
};

export const LanguageByCode = async (code: string): Promise<Language | undefined> => {
  const languages = await getLanguages();
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
