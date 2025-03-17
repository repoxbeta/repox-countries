# Repox Countries

Provides up-to-date country, state, city, language, currency, phone code, and postal code data, sourced daily from the GeoNames API. Integrate easily into forms or use for data verification. Updated versions are released when changes occur.

## Features

- **Comprehensive Metadata**: Access detailed information about countries, states, and cities, including names, codes, languages, currencies, and more.
- **Dynamic Updates**: The data is maintained and updated daily from the Geonames warehouse, ensuring that you have the most current information available.
- **Reusable Interfaces**: The project utilizes TypeScript interfaces to define the structure of the data, making it easy to integrate and use in various applications.

## Installation

To install the package, use npm or yarn:

```
npm install repox-countries
```

or

```
yarn add repox-countries
```

### Usage

The metadata can be accessed through the `src/utils/index.ts` file, which provides utility functions to retrieve data based on various criteria. Here are some examples of how to use the functions:

- **Get Countries**: Retrieve a list of all countries.
- **Get Country by ID**: Fetch details of a specific country using its unique ID.
- **Get States by Country**: Access all states within a specified country.
- **Get Cities by State**: Retrieve cities within a specific state.

### Example

```typescript
import { getCountries, CountryById, CountryByCode } from 'repox-countries';

// Get a specific country by ID or code
const country = CountryById(6252001);
// const country = CountryByCode("US");
console.log(country);

// List all countries
console.log(getCountries());
```

## Data Maintenance

The geographical data is sourced from the Geonames database and is updated daily. This ensures that the information remains accurate and reflects any changes in geographical or political boundaries.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Key Changes Made:

1. **Overview Section**: Added a brief description of the project and its purpose.
2. **Features Section**: Highlighted the key features of the project.
3. **Getting Started Section**: Provided installation and usage instructions.
4. **Example Section**: Included a code example to demonstrate how to use the utility functions.
5. **Data Maintenance Section**: Clarified how the data is maintained and updated.
6. **Contributing Section**: Encouraged contributions from the community.

Feel free to adjust any sections to better fit your project's specific needs or style!

## Author

Repox Team - [repox.beta@gmail.com](mailto:repox.beta@gmail.com)
