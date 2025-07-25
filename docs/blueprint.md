# **App Name**: TemperatureChart

## Core Features:

- Zip Code Input: User inputs a US zip code into an input box.
- Fetch Weather Data: Fetches the 24-hour temperature data for the current day from the Open Meteo API based on the provided zip code, and catches any errors with a notification to the user. It geolocates to determine latitude and longitude. It shows the location.
- Temperature Chart: Displays the hourly temperature forecast as a bar chart.
- Current Hour Highlighting: Highlights the bar representing the current hour in the temperature chart.

## Style Guidelines:

- Primary color: Light desaturated blue (#ADD8E6) to evoke a sense of calmness and clarity, relating to the weather.
- Background color: Very light blue (#F0F8FF), almost white, maintaining a clean and airy feel.
- Accent color: Soft orange (#FFB347) to highlight the current hour on the chart, providing contrast and indicating real-time data.
- Font: 'Inter', a grotesque-style sans-serif, providing a modern, machined, neutral look, suitable for both headlines and body text.
- The zip code input box should be prominently displayed at the top. The temperature chart should take up the majority of the screen space below the input.
- A subtle fade-in animation when the temperature data and chart are loaded.
