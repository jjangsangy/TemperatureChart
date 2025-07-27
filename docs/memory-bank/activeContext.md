# Active Context: TemperatureChart

## 1. Current Focus

The current focus is on implementing a feature to allow users to select different hourly weather variables for display on the chart. This involves creating a new UI component for variable selection, integrating it with the main application page and the chart component, and ensuring all related tests are passing.

## 2. Recent Changes

- **Removed Unused AI Features**: Deleted the `src/ai` directory and removed Genkit-related dependencies from `package.json`.
- **Removed Unused UI Components**: Deleted numerous unused `shadcn/ui` components from `src/components/ui`.
- **Removed Unused Hooks**: Deleted `src/hooks/use-mobile.tsx` and `src/hooks/use-toast.ts`.
- **Fixed Import Errors**: Corrected import statements in `src/app/layout.tsx` and `src/app/page.tsx` after component removals.
- **Updated Memory Bank**: Updated `techContext.md` and `systemPatterns.md` to reflect the removal of AI features.
- **Dependency Optimization**: Unnecessary dependencies have been identified and removed, streamlining the project.
- **Fixed `tailwindcss-animate` reference**: Removed the `tailwindcss-animate` reference from `tailwind.config.ts` after uninstalling the package.
- **Re-added `next-themes` and `lucide-react`**: These dependencies were found to be in use and were reinstalled to resolve module not found errors.
- **User Re-added Dependencies**: The user re-added `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `class-variance-authority`, `recharts`, `tailwind-merge`, and `zod`, indicating their necessity.
- **API Enhancement**: Modified `src/lib/weather.ts` to include `daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,daylight_duration` in the Open Meteo API call, fetching additional daily metadata.
- **New Component Added**: Created `src/components/metadata.tsx` to display daily weather metadata.
- **Chart Visualization Enhancement**: Updated `src/components/temperature-chart.tsx` to use the fetched sunrise and sunset data to visually distinguish between day and night hours by dimming the bar color for night and brightening it for day. The current hour highlighting remains.
- **Data Flow Update**: Modified `src/app/page.tsx` to pass the new `sunrise`, `sunset`, and other daily metadata to the `TemperatureChart` and `Metadata` components.
- **Added Footer Component**: Created `src/components/footer.tsx` and integrated it into `src/app/page.tsx` to display a link to the GitHub repository and author acknowledgment, including the current year.
- **Dependency Added**: Installed `date-fns` for date and time formatting in the `Metadata` component.
- **Tooltip Shading**: Removed `cursor={false}` from `ChartTooltip` in `src/components/temperature-chart.tsx` to enable hover-activated shading on the bar chart.
- **CI/CD Setup**: Created `.github/workflows/ci.yml` to run tests on push and pull requests to the `main` branch.
- **Test Dependency Fix**: Added `ts-node` to `devDependencies` in `package.json` and ran `npm install` to resolve CI test failures.
- **Hourly Variable Integration**:
  - Modified `src/lib/weather.ts` to include `relative_humidity_2m`, `apparent_temperature`, `precipitation_probability`, and `weather_code` in the Open-Meteo API request and updated the `ForecastData` interface.
  - Updated `src/components/temperature-chart.tsx` to display these new data points in the chart's tooltip, including a `getWeatherDescription` helper function.
  - Refactored `getWeatherDescription` to use `function functionName() {}` syntax.
  - Enhanced tooltip aesthetics in `src/components/temperature-chart.tsx` with `lucide-react` icons, improved layout, and bolded key-value pairs.
- **Test Fixes (Complete)**:
  - Removed the hour display from the tooltip content in `src/components/temperature-chart.tsx`.
  - Updated `src/lib/weather.test.ts` to include new hourly variables in mock API responses, resolving `TypeError` issues.
  - Updated `src/components/temperature-chart.test.tsx` to no longer assert the presence of the hour in the tooltip.
- **Time Format Toggle**: Implemented a toggle for AM/PM and military time format with `localStorage` persistence.
  - `src/app/page.tsx`: Added `timeFormat` state with `localStorage` integration, a UI toggle button, and passed the `timeFormat` to `TemperatureChart`.
  - `src/components/temperature-chart.tsx`: Updated to accept `timeFormat` prop and format chart x-axis labels accordingly using a new `formatTime` helper function.
- **Responsive Header Layout**: Updated the header in `src/app/page.tsx` to adjust its layout at the `lg` breakpoint instead of `md`, ensuring better responsiveness on tablet-sized screens and preventing text overlap. The unit toggle, time format toggle, and theme toggle buttons are now positioned inline with the main title on larger screens for a cleaner and more integrated look.
- **Responsive Text Sizes**: Implemented responsive text size adjustments across `src/app/page.tsx`, `src/components/temperature-chart.tsx`, and `src/components/metadata.tsx` to ensure optimal readability on mobile devices while maintaining aesthetics on larger screens.
- **Daily Overview Layout**: Adjusted the `Metadata` component (`src/components/metadata.tsx`) to display daily overview items in a 2-column grid on mobile, improving layout and readability.
- **Date Selection Feature**: Added a "Change Day" button with a calendar dropdown to allow users to select a specific date for the weather forecast. The `getWeatherDataByZip` function was updated to accept and use this date for API calls.
- **Bug Fix**: Corrected the geocoding API URL in `src/lib/weather.ts` from `api.zippopot.us` to `api.zippopotam.us` to resolve `ERR_NAME_NOT_RESOLVED` errors.
- **Bug Fix**: Removed `forecast_days=1` parameter from Open-Meteo API call in `src/lib/weather.ts` to resolve conflict with `start_date` and `end_date` parameters.
- **Type and Test Issues Fixed**:
  - Updated `src/lib/weather.test.ts` to pass the `date` argument to `getWeatherDataByZip` in all test calls.
  - Corrected the mocked Open-Meteo API URL assertion in `src/lib/weather.test.ts` to use `start_date` and `end_date` parameters instead of `forecast_days=1`.
- **Mobile Layout Adjustment**: Modified `src/app/page.tsx` to adjust the layout for mobile devices, ensuring the date picker appears below the zip code input and submit button, while the latter two remain on the same row.
- **Geolocation Feature**: Implemented a geolocation button in `src/app/page.tsx` that uses the browser's `navigator.geolocation.getCurrentPosition` API to fetch latitude and longitude.
  - When geolocation is used, the stored zip code in `localStorage` is cleared, and the fetched coordinates are saved.
  - Refactored `src/lib/weather.ts` to include a new `getWeatherDataByCoords` function and modified `handleFetchWeather` in `src/app/page.tsx` to use either zip code or coordinates for fetching weather data.
  - Added tests for `getWeatherDataByCoords` in `src/lib/weather.test.ts`.
- **Input Field Layout Fix**: Adjusted the layout of the input fields and buttons in `src/app/page.tsx` to ensure the calendar selector is always below the zip code input and "Get Weather" button, providing more space for the zip code input.
- **Location Display Logic**: Modified `src/lib/weather.ts` to display the actual location name (city, state) when using a zip code, and latitude/longitude when using the geolocation feature. Updated `src/lib/weather.test.ts` to reflect this change in expected output.
- **Weather Icons and Color Coding**: Implemented a comprehensive system for displaying weather icons at the base of the chart bars, with specific icons and color variations for all WMO weather codes, including distinctions for day/night and precipitation intensity (light, moderate, heavy). This involved adding `CloudHail` and refining the `getWeatherIcon` function in `src/components/temperature-chart.tsx`.
- **Hourly Variable Selection Feature**:
  - Created `src/components/variable-selector.tsx` for variable selection.
  - Integrated `VariableSelector` into `src/app/page.tsx`, managing `selectedHourlyVariable` state and passing it to `TemperatureChart`.
  - Updated `src/components/temperature-chart.tsx` to dynamically render chart based on `selectedHourlyVariable`, including `YAxis` and `CardTitle` updates.
  - Refactored `Forecast` and introduced `ChartDataItem` interfaces for type consistency across `src/lib/weather.ts` and `src/components/temperature-chart.tsx`.
  - Adjusted `VariableSelector` dropdown styling (`w-full`, `z-50`) and moved its placement in `src/app/page.tsx` to align with the calendar selector.
  - Added Lucide icons to the `VariableSelector` button and dropdown menu items, and ensured left-alignment of text.
  - Updated `src/components/temperature-chart.test.tsx` to reflect new data structures and test dynamic chart title and tooltip content for different hourly variables.

## 3. Next Steps

- Investigate why tests are still reported as failing despite local `npm test` showing success. This might be an environment-specific issue or a misunderstanding of the test runner's output.

## 4. Key Decisions & Insights

- The project is now streamlined, focusing solely on its core functionality of displaying temperature data.
- The removal of unused code improves maintainability and reduces bundle size.
- The Memory Bank has been updated to accurately reflect the current state of the project.
- It's crucial to thoroughly verify dependency usage, as simple file searches might miss indirect or framework-level usages.
- User feedback is paramount in determining necessary dependencies, especially for those not directly imported but used by the framework or other components.
- Implemented a temperature unit toggle (Fahrenheit/Celsius) with `localStorage` persistence, enhancing user experience and customization.
- The application now fetches temperature data exclusively in Celsius and performs the conversion to Fahrenheit on the client-side. This avoids making separate API calls when the user toggles the temperature unit.
- The temperature unit toggle button in `src/app/page.tsx` was refined to be smaller, use "°C" / "°F" symbols, and repositioned next to the theme toggle for better aesthetics.
- **Visual Clarity**: The addition of day/night visual distinction in the chart significantly improves the readability and contextual understanding of the temperature forecast.
- **Enhanced Interactivity**: Enabling the tooltip cursor provides a more interactive and informative user experience when hovering over chart elements.
- **Automated Testing**: Implemented CI with GitHub Actions to ensure code quality and prevent regressions.
- **Testing Challenges**: Mocking complex UI components like tooltips requires careful attention to the rendered DOM structure and flexible querying strategies. The resolution involved aligning the component's rendering with the test's expectations by explicitly including the hour in the tooltip, and then removing it as per user feedback, updating the test accordingly.
- **Time Format Customization**: Added a time format toggle (AM/PM vs. 24H) with `localStorage` persistence, providing more user customization options.
- **Improved Responsiveness**: The application now features improved responsiveness, particularly with text sizes, ensuring a better user experience across various device sizes.
- **Date Selection Feature**: Added a "Change Day" button with a calendar dropdown to allow users to select a specific date for the weather forecast. The `getWeatherDataByZip` function was updated to accept and use this date for API calls.
- **Bug Fix**: Corrected the geocoding API URL in `src/lib/weather.ts` from `api.zippopot.us` to `api.zippopotam.us` to resolve `ERR_NAME_NOT_RESOLVED` errors.
- **Bug Fix**: Removed `forecast_days=1` parameter from Open-Meteo API call in `src/lib/weather.ts` to resolve conflict with `start_date` and `end_date` parameters.
