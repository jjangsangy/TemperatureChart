# System Patterns: TemperatureChart

## 1. Application Architecture

The application follows a component-based architecture, typical of Next.js/React projects. The structure is organized as follows:

- **`src/app`**: Contains the main application pages, layouts, and global styles. `page.tsx` serves as the entry point.
- **`src/components`**: Houses reusable UI components.
  - **`src/components/ui`**: Contains the base UI components from Shadcn/UI.
  - **`src/components/temperature-chart.tsx`**: A dedicated component for the main data visualization feature.
  - **`src/components/metadata.tsx`**: A new component for displaying daily weather metadata.
  - **`src/components/MetadataSkeleton.tsx`**: A new component for displaying a skeleton loading state for metadata.
  - **`src/components/footer.tsx`**: A component for displaying footer information.
- **`src/lib`**: For utility functions and external service integrations (e.g., `weather.ts`).

## 2. Data Flow

1.  **User Input**: The user enters a zip code or uses geolocation in a component likely located in `src/app/page.tsx`.
2.  **Loading State**: While data is being fetched, a loading card with a spinner and a `MetadataSkeleton` component are displayed to provide a smoother transition.
3.  **API Call**: A function, probably within `src/lib/weather.ts` (`getWeatherDataByZip` or `getWeatherDataByCoords`), is called to handle the data fetching.
    - This function geolocates the zip code or uses provided coordinates.
    - It then calls the Open Meteo API with the latitude and longitude, requesting hourly temperature data, daily metadata (max/min temperature, sunrise/sunset, precipitation probability, daylight duration), and additional hourly variables (`relative_humidity_2m`, `apparent_temperature`, `precipitation_probability`, `weather_code`).
4.  **State Management**: The fetched data and any loading/error states are managed within the `page.tsx` component using React's state management (e.g., `useState`, `useEffect`).
5.  **Component Rendering**: The `temperature-chart.tsx` component receives the hourly temperature data, sunrise/sunset times, and time format as props and renders the bar chart with:
    - Day/night visual distinction.
    - Current hour highlighting.
    - Weather icons at the base of each bar, with color coding for intensity.
    - Dynamic Y-axis scaling based on the selected hourly variable, calculating padded minimum and maximum values to provide a user-friendly scale.
      The `metadata.tsx` component receives the daily metadata as props and displays it.
6.  **Highlighting**: The chart component contains logic to identify and highlight the current hour's bar only if the selected date is the current day.

## 3. Key Design Patterns

- **Component-Based UI**: The UI is broken down into smaller, reusable components, promoting modularity and maintainability.
- **Provider Pattern**: The `theme-provider.tsx` suggests the use of the Provider pattern for managing global state like themes.
- **Responsive Design**: The application uses responsive design principles, such as the header layout adjusting for different screen sizes and text size adjustments, to ensure a good user experience on all devices.
- **Client-Side Data Transformation**: Temperature data is fetched in Celsius and converted to Fahrenheit on the client-side to avoid multiple API calls.
- **Local Storage Persistence**: User preferences like temperature unit and time format are persisted using `localStorage`.
- **Caching**: HTTP requests for weather data are cached using `lru-cache` to improve performance and reduce API calls. Cache keys are generated based on location data (latitude/longitude or zip code) and date.
