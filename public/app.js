// NutriScan App Logic

// State management
const state = {
    products: JSON.parse(localStorage.getItem('nutriscan_products')) || [],
    meals: JSON.parse(localStorage.getItem('nutriscan_meals')) || [],
    dailyLog: JSON.parse(localStorage.getItem('nutriscan_daily_log')) || [],
    currentMeal: [],
    currentProduct: null
};

// Save state to localStorage
function saveState() {
    localStorage.setItem('nutriscan_products', JSON.stringify(state.products));
    localStorage.setItem('nutriscan_meals', JSON.stringify(state.meals));
    localStorage.setItem('nutriscan_daily_log', JSON.stringify(state.dailyLog));
}

// OCR Simulation (Mock)
function simulateOCR(imageFile) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock OCR result - in real app, this would call an OCR API
            const mockResult = {
                productName: "Sample Product",
                servingSize: "30g",
                nutrients: {
                    energy: { per100g: 2292, perServing: 688 },
                    fat: { per100g: 33, perServing: 10 },
                    saturatedFat: { per100g: 13, perServing: 3.9 },
                    carbohydrates: { per100g: 55, perServing: 16 },
                    sugars: { per100g: 45, perServing: 14 },
                    fiber: { per100g: 2.4, perServing: 0.7 },
                    protein: { per100g: 6.8, perServing: 2.0 },
                    salt: { per100g: 0.18, perServing: 0.05 }
                }
            };
            resolve(mockResult);
        }, 2000);
    });
}

// Parse nutrition table from image (Mock)
async function parseNutritionTable(imageFile) {
    try {
        const result = await simulateOCR(imageFile);
        state.currentProduct = result;
        displayNutritionData(result);
        return result;
    } catch (error) {
        console.error('Error parsing nutrition table:', error);
        alert('Error parsing nutrition table. Please try again.');
    }
}

// Display nutrition data in table
function displayNutritionData(product) {
    const tbody = document.getElementById('nutrition-tbody');
    tbody.innerHTML = '';

    const nutrients = [
        { key: 'energy', label: 'Energy', unit: 'kJ/kcal' },
        { key: 'fat', label: 'Fat', unit: 'g' },
        { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
        { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g' },
        { key: 'sugars', label: 'Sugars', unit: 'g' },
        { key: 'fiber', label: 'Fiber', unit: 'g' },
        { key: 'protein', label: 'Protein', unit: 'g' },
        { key: 'salt', label: 'Salt', unit: 'g' }
    ];

    nutrients.forEach(nutrient => {
        const row = document.createElement('tr');
        const per100g = product.nutrients[nutrient.key].per100g;
        const perServing = product.nutrients[nutrient.key].perServing;
        
        row.innerHTML = `
            <td>${nutrient.label}</td>
            <td>${per100g} ${nutrient.unit}</td>
            <td>${perServing} ${nutrient.unit}</td>
        `;
        tbody.appendChild(row);
    });
}

// Save product to localStorage
function saveProduct() {
    if (!state.currentProduct) return;

    const product = {
        id: Date.now(),
        name: state.currentProduct.productName,
        servingSize: state.currentProduct.servingSize,
        nutrients: state.currentProduct.nutrients
    };

    state.products.push(product);
    saveState();
    alert('Product saved successfully!');
}

// Update product select dropdown
function updateProductSelect() {
    const select = document.getElementById('product-select');
    select.innerHTML = '<option value="">Select a product</option>';

    state.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// Add item to current meal
function addToMeal() {
    const productId = document.getElementById('product-select').value;
    const grams = parseFloat(document.getElementById('grams-input').value);

    if (!productId || !grams) {
        alert('Please select a product and enter grams');
        return;
    }

    const product = state.products.find(p => p.id == productId);
    if (!product) return;

    // Calculate nutrition based on grams
    const servingGrams = parseFloat(product.servingSize) || 100;
    const factor = grams / servingGrams;

    const mealItem = {
        productId: product.id,
        productName: product.name,
        grams: grams,
        calories: Math.round(product.nutrients.energy.perServing * factor),
        protein: Math.round(product.nutrients.protein.perServing * factor * 10) / 10,
        fat: Math.round(product.nutrients.fat.perServing * factor * 10) / 10,
        carbs: Math.round(product.nutrients.carbohydrates.perServing * factor * 10) / 10
    };

    state.currentMeal.push(mealItem);
    displayMealItems();
    updateMealTotals();
}

// Display meal items
function displayMealItems() {
    const tbody = document.getElementById('meal-tbody');
    tbody.innerHTML = '';

    state.currentMeal.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.grams}g</td>
            <td>${item.calories}</td>
            <td>${item.protein}</td>
            <td>${item.fat}</td>
            <td>${item.carbs}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update meal totals
function updateMealTotals() {
    const totals = state.currentMeal.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carbs: acc.carbs + item.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    document.getElementById('total-calories').textContent = totals.calories;
    document.getElementById('total-protein').textContent = totals.protein.toFixed(1);
    document.getElementById('total-fat').textContent = totals.fat.toFixed(1);
    document.getElementById('total-carbs').textContent = totals.carbs.toFixed(1);
}

// Save meal to daily log
function saveMeal() {
    if (state.currentMeal.length === 0) {
        alert('No items in meal');
        return;
    }

    const totals = state.currentMeal.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carbs: acc.carbs + item.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    const mealLog = {
        time: new Date().toLocaleTimeString(),
        meal: `Meal ${state.dailyLog.length + 1}`,
        calories: totals.calories,
        protein: totals.protein,
        fat: totals.fat,
        carbs: totals.carbs
    };

    state.dailyLog.push(mealLog);
    state.currentMeal = [];
    saveState();
    displayDailyLog();
    alert('Meal saved to daily log!');
}

// Display daily log
function displayDailyLog() {
    const tbody = document.getElementById('log-tbody');
    tbody.innerHTML = '';

    state.dailyLog.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.time}</td>
            <td>${log.meal}</td>
            <td>${log.calories}</td>
            <td>${log.protein.toFixed(1)}</td>
            <td>${log.fat.toFixed(1)}</td>
            <td>${log.carbs.toFixed(1)}</td>
        `;
        tbody.appendChild(row);
    });

    // Update daily totals
    const totals = state.dailyLog.reduce((acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        fat: acc.fat + log.fat,
        carbs: acc.carbs + log.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    document.getElementById('daily-calories').textContent = totals.calories;
    document.getElementById('daily-protein').textContent = totals.protein.toFixed(1);
    document.getElementById('daily-fat').textContent = totals.fat.toFixed(1);
    document.getElementById('daily-carbs').textContent = totals.carbs.toFixed(1);
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update navigation buttons
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${sectionId}-btn`).classList.add('active');
}

// Initialize app
function init() {
    // Event listeners
    document.getElementById('scan-btn').addEventListener('click', () => showSection('scan-section'));
    document.getElementById('meal-planner-btn').addEventListener('click', () => {
        showSection('meal-planner-section');
        updateProductSelect();
    });
    document.getElementById('track-btn').addEventListener('click', () => {
        showSection('track-section');
        displayDailyLog();
    });

    document.getElementById('image-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('preview-image').src = event.target.result;
                parseNutritionTable(file);
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('capture-btn').addEventListener('click', () => {
        // In a real app, this would trigger camera capture
        alert('Camera capture would be triggered here');
    });

    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
    document.getElementById('add-item-btn').addEventListener('click', addToMeal);
    document.getElementById('save-meal-btn').addEventListener('click', saveMeal);

    // Initialize with scan section active
    showSection('scan-section');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);