import { getCountriesAdditional } from './../metadata';
import { get } from './../libs/axios';
import { savingFile } from './../libs/store';
import { CountryGeoname, StateGeoname, CityGeoname, CountryAdditional } from './types';
import { Country, CountryState, Currency, PhoneCode, StateCity } from '../types';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const USER_NAMES = (process.env.USER_NAME || '__username__').split(',');

const META_DATA_FOLDER = 'src/metadata';
const batchSize = USER_NAMES.length;
const delayBetweenBatches = 2000; // 2s

/**
 * Sleep function to delay execution.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Crawl countries from the API.
 * Then map the response to the Country type.
 * Write the list of countries to the /metadata/countries.json file.
 */
export const crawlCountries = async (): Promise<Country[]> => {
  console.log('Crawling countries...');
  const response = await get<{ geonames: CountryGeoname[] }>('/countryInfoJSON', {}, { params: { username: USER_NAMES[0] } });
  const countries = response.geonames;
  console.log('Countries crawled: ', countries.length);

  const countriesAdditional = getCountriesAdditional() as CountryAdditional[];
  const phoneCodes: PhoneCode[] = [];
  const currencies: Currency[] = [];
  const list = countries.map((country) => {
    const countryAdditional = countriesAdditional.find(
      (e) => e.countryCode === country.countryCode,
    );

    phoneCodes.push({
      countryCode: country.countryCode,
      phoneCode: countryAdditional?.phoneCode ?? '',
      emoji: countryAdditional?.emoji ?? '',
    } as PhoneCode);

    currencies.push({
      countryCode: country.countryCode,
      code: countryAdditional?.countryCode ?? '',
      name: countryAdditional?.currencyName ?? '',
      symbol: countryAdditional?.currencySymbol ?? '',
    } as Currency);

    return {
      id: country.geonameId,
      name: country.countryName,
      nativeName: countryAdditional?.native ?? country.countryName,
      code: country.countryCode,
      isoAlpha3: country.isoAlpha3,
      continent: country.continent,
      continentName: country.continentName,
      phoneCode: countryAdditional?.phoneCode ?? '',
      postalCodeFormat: country.postalCodeFormat,
      currencyCode: countryAdditional?.countryCode ?? '',
      currencyName: countryAdditional?.currencyName ?? '',
      currencySymbol: countryAdditional?.currencySymbol ?? '',
      capital: country.capital,
      languages: country.languages,
      emoji: countryAdditional?.emoji ?? '',
    } as Country;
  });

  await savingFile(META_DATA_FOLDER + '/countries.json', list);
  console.log('Countries crawled and saved.');

  await savingFile(META_DATA_FOLDER + '/phone.codes.json', phoneCodes);
  console.log('PhoneCodes crawled and saved.');

  await savingFile(META_DATA_FOLDER + '/currencies.json', currencies);
  console.log('Currencies crawled and saved.');

  return list;
};

/**
 * Crawl states from the API.
 * Then map the response to the CountryState type.
 * Write the list of states to the /metadata/states.json file.
 */
export const crawlStates = async (countries: Country[]): Promise<CountryState[]> => {
  console.log('Crawling states...');

  const states: CountryState[] = [];
  const totalBatches = Math.ceil(countries.length / batchSize);
  for (let i = 0; i < countries.length; i += batchSize) {
    const batchCountries = countries.slice(i, i + batchSize);
    const batchPromises = batchCountries.map(async (country, index) => {
      const usernameIdx = index % USER_NAMES.length;
      const username = USER_NAMES[usernameIdx];
      console.log('Crawling states for country: ', country.id, country.code, country.name, 'with username index: ', usernameIdx);

      try {
        const response = await get<{ totalResultsCount: number; geonames: StateGeoname[] }>('/childrenJSON', {
          geonameId: country.id,
          username,
        });

        const statesCrawled = response.geonames || [];
        return {
          countryId: country.id,
          countryCode: country.code,
          states: statesCrawled.map((state) => ({
            id: state.geonameId,
            name: state.name,
            nativeName: state.toponymName,
            code: `${country.code}-${state.adminCodes1?.ISO3166_2 || state.adminCode1}`,
            internalCode: state.adminCodes1?.ISO3166_2 ?? '',
            countryId: country.id,
            countryCode: country.code,
            latitude: parseFloat(state.lat) as number,
            longitude: parseFloat(state.lng) as number,
          })),
        } as CountryState;
      } catch (error) {
        console.log(`Error crawling states for country ${country.id} (${country.code}): `, error);
        return null;
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    states.push(...batchResults.filter(r => r.status === 'fulfilled' && r.value !== null).map(r => (r as PromiseFulfilledResult<CountryState>).value));

    console.log(`Batch ${i / batchSize + 1} / ${totalBatches} completed, waiting ${delayBetweenBatches}ms...`);
    if (i + batchSize < countries.length) await sleep(delayBetweenBatches);
  }

  console.log('States crawled: ', states.length);

  // Save separately in each folder by country code
  for (const countryStates of states) {
    const countryCode = countryStates.countryCode.toLowerCase();
    await savingFile(`${META_DATA_FOLDER}/countries/${countryCode}/${countryCode}.states.json`, countryStates);
  }

  // await savingFile(META_DATA_FOLDER + '/states.json', states);
  console.log('States crawled and saved.');

  return states;
};

/**
 * Crawl cities and save them separately per state
 */
export const crawlCities = async (countryStates: CountryState[]): Promise<StateCity[]> => {
  console.log('Crawling cities...');

  const cities: StateCity[] = [];
  const states = countryStates.flatMap(cState => cState.states);
  const totalBatches = Math.ceil(states.length / batchSize);
  for (let i = 0; i < states.length; i += batchSize) {
    const batchStates = states.slice(i, i + batchSize);
    const batchPromises = batchStates.map(async (state, index) => {
      const usernameIdx = index % USER_NAMES.length;
      const username = USER_NAMES[usernameIdx];
      console.log('Crawling cities for state: ', state.id, state.code, state.name, 'with username index: ', usernameIdx);

      try {
        const response = await get<{ totalResultsCount: number; geonames: CityGeoname[] }>('/childrenJSON', {
          geonameId: state.id,
          username,
        });

        const citiesCrawled = response.geonames || [];
        return {
          stateId: state.id,
          stateCode: state.code,
          countryCode: state.countryCode,
          cities: citiesCrawled.map((city) => ({
            id: city.geonameId,
            name: city.name,
            nativeName: city.toponymName,
            code: `${state.code}-${city.geonameId}`,
            countryId: state.countryId,
            countryCode: state.countryCode,
            stateCode: state.code,
            latitude: parseFloat(city.lat) as number,
            longitude: parseFloat(city.lng) as number,
          })),
        } as StateCity;
      } catch (error) {
        console.log(`Error crawling cities for state ${state.id} (${state.code}): `, error);
        return null;
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    cities.push(...batchResults.filter(r => r.status === 'fulfilled' && r.value !== null).map(r => (r as PromiseFulfilledResult<StateCity>).value));

    console.log(`Batch ${i / batchSize + 1} / ${totalBatches} completed, waiting ${delayBetweenBatches}ms...`);
    if (i + batchSize < states.length) await sleep(delayBetweenBatches);
  }

  console.log('Cities crawled: ', cities.length);

  // Save separately in each folder by country code-internal state code
  for (const stateCities of cities) {
    const countryCode = stateCities.countryCode.toLowerCase();
    const stateCode = stateCities.stateCode.toLowerCase();
    await savingFile(`${META_DATA_FOLDER}/countries/${countryCode}/${stateCode}.cities.json`, stateCities);
  }

  // await savingFile(META_DATA_FOLDER + '/cities.json', cities);
  console.log('Cities crawled and saved.');

  return cities;
};


/**
 * Execute all crawling steps sequentially.
 */
export const crawling = async () => {
  const countries = await crawlCountries();
  const states = await crawlStates(countries);
  await crawlCities(states);
};
