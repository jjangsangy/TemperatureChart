# Project Brief: TemperatureChart

## 1. Overview

TemperatureChart is a web application that provides users with a 24-hour temperature forecast for a specified US zip code. The core functionality revolves around fetching weather data from the Open Meteo API, geolocating the zip code to determine latitude and longitude, and displaying the hourly temperature data in an intuitive bar chart format.

## 2. Core Requirements

### Functional
- **Zip Code Input**: A clear and accessible input field for users to enter a US zip code.
- **Weather Data Fetching**: The application must fetch 24-hour temperature data from the Open Meteo API. This includes:
    - Geolocating the zip code to get latitude and longitude.
    - Handling API errors gracefully and notifying the user.
    - Displaying the location corresponding to the zip code.
- **Temperature Chart**: The primary data visualization component, displaying the hourly temperature forecast as a bar chart.
- **Current Hour Highlighting**: The bar on the chart corresponding to the current hour must be visually distinct.

### Non-Functional
- **Styling**: The application should adhere to a specific style guide to ensure a clean and modern user interface.
- **Animation**: A subtle fade-in animation should be implemented for loading the temperature data and chart to enhance user experience.

## 3. Scope

The project is focused on delivering the core features listed above. Future enhancements could include extended forecasts, different chart types, or support for international locations, but these are currently out of scope.
