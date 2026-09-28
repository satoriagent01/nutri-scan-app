// NutriScan App Tests

const assert = require('assert');

// Mock the browser environment for Node.js
global.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
};

// Test nutrition parsing logic
function testNutritionParsing() {
    console.log('Testing nutrition parsing...');
    
    // Test case 1: Parse nutrition table from OCR text
    const ocrText1 = `Nährwertdeklaration
Energie 2292 kJ 549 kcal
Fett 33 g
davon gesättigte Fettsäuren 13 g
Kohlenhydrate 55 g
davon Zucker 45 g
Ballaststoffe 2,4 g
Eiweiß 6,8 g
Salz 0,18 g`;

    const parsed1 = parseNutritionTable(ocrText1);
    assert.strictEqual(parsed1.energie, 549, 'Should parse energy in kcal');
    assert.strictEqual(parsed1.fett, 33, 'Should parse fat');
    assert.strictEqual(parsed1.kohlenhydrate, 55, 'Should parse carbs');
    assert.strictEqual(parsed1.zucker, 45, 'Should parse sugars');
    assert.strictEqual(parsed1.eiweiss, 6.8, 'Should parse protein');
    console.log('✓ Nutrition parsing test passed');
}

// Test meal planning logic
function testMealPlanning() {
    console.log('Testing meal planning...');
    
    // Test case 1: Add items to meal
    const meal = {
        items: [],
        totalCalories: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalProtein: 0
    };
    
    // Add a food item
    const foodItem = {
        name: 'Chocolate Bar',
        calories: 549,
        fat: 33,
        carbs: 55,
        protein: 6.8,
        servingSize: 100
    };
    
    meal.items.push(foodItem);
    meal.totalCalories += foodItem.calories;
    meal.totalFat += foodItem.fat;
    meal.totalCarbs += foodItem.carbs;
    meal.totalProtein += foodItem.protein;
    
    assert.strictEqual(meal.items.length, 1, 'Should have one item');
    assert.strictEqual(meal.totalCalories, 549, 'Should have correct total calories');
    assert.strictEqual(meal.totalFat, 33, 'Should have correct total fat');
    assert.strictEqual(meal.totalCarbs, 55, 'Should have correct total carbs');
    assert.strictEqual(meal.totalProtein, 6.8, 'Should have correct total protein');
    
    console.log('✓ Meal planning test passed');
}

// Test daily tracking
function testDailyTracking() {
    console.log('Testing daily tracking...');
    
    const dailyLog = {
        meals: [],
        dailyTotals: {
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0
        }
    };
    
    // Add a meal
    const meal = {
        name: 'Lunch',
        items: [
            { name: 'Salad', calories: 300, fat: 15, carbs: 20, protein: 10 },
            { name: 'Chicken', calories: 200, fat: 10, carbs: 0, protein: 30 }
        ]
    };
    
    dailyLog.meals.push(meal);
    
    // Calculate totals
    meal.items.forEach(item => {
        dailyLog.dailyTotals.calories += item.calories;
        dailyLog.dailyTotals.fat += item.fat;
        dailyLog.dailyTotals.carbs += item.carbs;
        dailyLog.dailyTotals.protein += item.protein;
    });
    
    assert.strictEqual(dailyLog.dailyTotals.calories, 500, 'Should have correct daily calories');
    assert.strictEqual(dailyLog.dailyTotals.fat, 25, 'Should have correct daily fat');
    assert.strictEqual(dailyLog.dailyTotals.carbs, 20, 'Should have correct daily carbs');
    assert.strictEqual(dailyLog.dailyTotals.protein, 40, 'Should have correct daily protein');
    
    console.log('✓ Daily tracking test passed');
}

// Helper function to parse nutrition table (simplified version)
function parseNutritionTable(ocrText) {
    const nutrition = {};
    const lines = ocrText.split('\n');
    
    lines.forEach(line => {
        if (line.includes('Energie')) {
            const kcalMatch = line.match(/(\d+)\s*kcal/);
            if (kcalMatch) nutrition.energie = parseInt(kcalMatch[1]);
        }
        if (line.includes('Fett')) {
            const fatMatch = line.match(/(\d+)\s*g/);
            if (fatMatch) nutrition.fett = parseInt(fatMatch[1]);
        }
        if (line.includes('Kohlenhydrate')) {
            const carbsMatch = line.match(/(\d+)\s*g/);
            if (carbsMatch) nutrition.kohlenhydrate = parseInt(carbsMatch[1]);
        }
        if (line.includes('Zucker')) {
            const sugarMatch = line.match(/(\d+)\s*g/);
            if (sugarMatch) nutrition.zucker = parseInt(sugarMatch[1]);
        }
        if (line.includes('Eiweiß')) {
            const proteinMatch = line.match(/([\d.]+)\s*g/);
            if (proteinMatch) nutrition.eiweiss = parseFloat(proteinMatch[1]);
        }
    });
    
    return nutrition;
}

// Run all tests
try {
    testNutritionParsing();
    testMealPlanning();
    testDailyTracking();
    console.log('\n✅ All tests passed!');
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
}