# Tech Context: TemperatureChart

## 1. Frontend Framework

- **Next.js**: The project is built using Next.js, a React framework for building server-side rendered and statically generated web applications. This is indicated by the presence of `next.config.mjs` and the `src/app` directory structure.
- **React**: The core UI library, optimized with the React Compiler.
- **TypeScript**: The project uses TypeScript for static typing, as evidenced by `tsconfig.json` and `.tsx` file extensions.

## 2. Styling

- **Tailwind CSS**: A utility-first CSS framework for rapid UI development. The `tailwind.config.ts` and `postcss.config.mjs` files confirm its use.
- **Shadcn/UI**: The project appears to use shadcn/ui, a collection of re-usable components built with Radix UI and Tailwind CSS. This is suggested by the `components.json` file and the `src/components/ui` directory.

## 3. API and Data Fetching

- **Open Meteo API**: The primary source for weather data.
- **Zippopotam.us API**: Used for geocoding zip codes to latitude and longitude.

## 4. Development Environment

- **Node.js/npm**: The `package.json` and `package-lock.json` files indicate a Node.js environment with npm for package management.
- **Git**: The project is under version control with Git.
- **GitHub Actions**: Used for continuous integration (CI) to run tests automatically.

## 5. Key Libraries and Dependencies

- **`lucide-react`**: For a comprehensive set of customizable SVG icons used throughout the application, including weather icons on the chart.
- **`recharts`**: A composable charting library built with React and D3, used for rendering the temperature bar chart.
- **`date-fns`**: For date and time formatting utilities.
- **`next-themes`**: For theme management (light/dark mode).
- **`class-variance-authority`**: For managing component variants.
- **`tailwind-merge`**: For merging Tailwind CSS classes without style conflicts.
- **`zod`**: For schema validation.
- **`react-day-picker`**: For the calendar component used in date selection.
- **`@radix-ui/react-popover`**: For popover functionality, used with the calendar.
- **`@radix-ui/react-dropdown-menu`**: For dropdown menu functionality.
- **`@radix-ui/react-slot`**: For flexible component composition.
- **`ts-node`**: Used in `devDependencies` for running TypeScript tests in CI.
