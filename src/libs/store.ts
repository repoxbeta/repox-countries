import fs from 'fs/promises';

/**
 * Loads a JSON file and converts it into a Set<T>.
 * If the file does not exist or an error occurs, it returns an empty Set.
 *
 * @template T - The type of elements stored in the Set.
 * @param {string} path - The file path to load data from.
 * @returns {Promise<Set<T>>} - A promise that resolves to a Set containing parsed data.
 */
export const loadingFile = async <T = unknown>(path: string): Promise<Set<T>> => {
  try {
    const fileContent = await fs.readFile(path, 'utf-8');
    return new Set<T>(JSON.parse(fileContent));
  } catch (error) {
    console.warn(`Failed to load file: ${path}. Returning empty set.`, error);
    return new Set<T>();
  }
};

/**
 * Saves an array of data to a JSON file.
 * If the file exists, it overwrites it with the new data.
 *
 * @template T - The type of elements stored in the file.
 * @param {string} path - The file path where data should be saved.
 * @param {T[]} data - The array of data to be saved.
 * @returns {Promise<void>} - A promise that resolves once the data is written successfully.
 */
export const savingFile = async <T = unknown>(path: string, data: T[]): Promise<void> => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to save data to ${path}:`, error);
  }
};
