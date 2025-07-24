# System Patterns: TemperatureChart

## 1. Application Architecture

The application follows a component-based architecture, typical of Next.js/React projects. The structure is organized as follows:

- **`src/app`**: Contains the main application pages, layouts, and global styles. `page.tsx` serves as the entry point.
- **`src/components`**: Houses reusable UI components.
    - **`src/components/ui`**: Contains the base UI components from Shadcn/UI.
    - **`src/components/temperature-chart.tsx`**: A dedicated component for the main data visualization feature.
- **`src/components/metadata.tsx`**: A new component for displaying daily weather metadata.
- **`src/lib`**: For utility functions and external service integrations (e.g., `weather.ts`).
- **`src/hooks`**: For custom React hooks.

## 2. Data Flow

1.  **User Input**: The user enters a zip code in a component likely located in `src/app/page.tsx`.
2.  **API Call**: A function, probably within `src/lib/weather.ts`, is called to handle the data fetching.
    - This function geolocates the zip code.
    - It then calls the Open Meteo API with the latitude and longitude, requesting hourly temperature data and daily metadata (max/min temperature, sunrise/sunset, precipitation probability, daylight duration).
3.  **State Management**: The fetched data and any loading/error states are managed within the `page.tsx` component using React's state management (e.g., `useState`, `useEffect`).
4.  **Component Rendering**: The `temperature-chart.tsx` component receives the hourly temperature data as props and renders the bar chart. The `metadata.tsx` component receives the daily metadata as props and displays it.
5.  **Highlighting**: The chart component contains logic to identify and highlight the current hour's bar.

## 3. Key Design Patterns

- **Component-Based UI**: The UI is broken down into smaller, reusable components, promoting modularity and maintainability.
- **Provider Pattern**: The `theme-provider.tsx` suggests the use of the Provider pattern for managing global state like themes.
- **Custom Hooks**: The `src/hooks` directory indicates the use of custom hooks to encapsulate and reuse stateful logic.
