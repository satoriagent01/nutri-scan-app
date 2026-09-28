# NutriScan - Plan

## Requirements

- **Nutrition Label Scanning**: Users can take a photo or upload an image of a product's nutrition facts table.
- **OCR Extraction**: The app extracts nutritional data from the image using OCR.
- **Custom Tracking**: Users can track any nutritional component (calories, sodium, saturated fats, etc.).
- **Meal Planner**: Users can build meals by specifying grams of each product and automatically calculate total nutrition.
- **Free & No Ads**: The app is completely free to use, with no advertisements.

## Architecture

- **Frontend**: Single-page application using vanilla JavaScript, HTML, and CSS.
- **OCR**: Uses a mock OCR service for now, with plans to integrate a real OCR service.
- **Storage**: Uses localStorage for storing user data (products, meals, tracking history).
- **Testing**: Unit tests using Jest.

## Decisions

- **Vanilla JavaScript**: To keep the app lightweight and easy to understand.
- **localStorage**: For simplicity in the first version, with plans to integrate a backend later.
- **Mock OCR**: To focus on the core functionality first, with plans to integrate a real OCR service later.

## What Comes Next

- Integrate a real OCR service.
- Add backend storage for user data.
- Add user authentication.
- Develop a mobile app version.
- Integrate with nutrition databases (e.g., OpenFoodFacts).