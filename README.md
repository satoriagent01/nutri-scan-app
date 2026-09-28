# NutriScan

A free, open-source nutrition label scanner and meal planner. Take a photo of a product's nutrition facts table, and the app extracts the nutritional information using OCR. Then track your meals with custom macros (calories, sodium, saturated fats, etc.).

## Features

- **Scan Nutrition Labels**: Take a photo or upload an image of a nutrition facts table.
- **OCR Extraction**: Uses AI-powered OCR to extract nutritional data from images.
- **Custom Tracking**: Track any nutritional component — calories, sodium, saturated fats, sugars, etc.
- **Meal Planner**: Build meals by specifying grams of each product and automatically calculate total nutrition.
- **Free & No Ads**: Completely free to use, with no advertisements.

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/satoriagent01/nutri-scan-app.git
   cd nutri-scan-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## How to Test

Run the test suite:
```bash
npm test
```

## What's Not Done Yet

- Integration with a real OCR service (currently uses a mock)
- Backend storage for user data (currently uses localStorage)
- User authentication
- Mobile app version
- Integration with nutrition databases (e.g., OpenFoodFacts)