import {
  Option,
  Country,
  State,
  City,
  CountryState,
  StateCity,
  CountryStateCity,
  PhoneCode,
  Currency,
  Language,
} from '../types';
import Metadata from './../metadata';

export const Countries = Metadata.Countries as Country[];

export const CountryOptions = Countries.map((e) => ({
  id: e.id,
  code: e.name,
  name: e.name,
  nativeName: e.nativeName,
  emoji: e.emoji,
})) as Option[];

export const CountryById = (id: number): Country | undefined => {
  return Countries.find((e) => e.id === id);
};

export const CountryByCode = (code: string): Country | undefined => {
  return Countries.find((e) => e.code === code);
};

export const CountryStates = Metadata.States as CountryState[];

export const StatesByCountryId = (countryId: number): State[] => {
  const countryState = CountryStates.find((e) => e.countryId === countryId);
  return (countryState && countryState.states) ?? [];
};

export const StatesByCountryCode = (countryCode: string): State[] => {
  const countryState = CountryStates.find((e) => e.countryCode === countryCode);
  return (countryState && countryState.states) ?? [];
};

export const StateCities = Metadata.Cities as StateCity[];

export const CitiesByStateId = (stateId: number): City[] => {
  const stateCity = StateCities.find((e) => e.stateId === stateId);
  return (stateCity && stateCity.cities) ?? [];
};

export const CitiesByStateCode = (stateCode: string): City[] => {
  const stateCity = StateCities.find((e) => e.stateCode === stateCode);
  return (stateCity && stateCity.cities) ?? [];
};

export const CountryStateCities = CountryStates.map((countryState) => {
  const states = countryState.states.map((state) => {
    const cities = CitiesByStateId(state.id);
    return {
      stateId: state.id,
      stateCode: state.code,
      cities,
    };
  });
  return {
    countryId: countryState.countryId,
    countryCode: countryState.countryCode,
    states,
  };
}) as CountryStateCity[];

export const CountryStateCitiesByCountryId = (countryId: number): CountryStateCity | undefined => {
  return CountryStateCities.find((e) => e.countryId === countryId);
};

export const PhoneCodes = Metadata.PhoneCodes as PhoneCode[];

export const PhoneCodeByCountryCode = (countryCode: string): PhoneCode | undefined => {
  return PhoneCodes.find((e) => e.countryCode === countryCode);
};

export const Currencies = Metadata.Currencies as Currency[];

export const CurrencyByCountryCode = (countryCode: string): Currency | undefined => {
  return Currencies.find((e) => e.countryCode === countryCode);
};

export const CurrencyByCode = (code: string): Currency | undefined => {
  return Currencies.find((e) => e.code === code);
};

export const Languages = Metadata.Languages as Language[];

export const LanguageByCode = (code: string): Language | undefined => {
  return Languages.find((e) => e.code === code);
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
