// Conversion data structure with all categories, units, and formulas
const conversionData = {
    length: {
        name: 'Length',
        units: {
            millimeter: { name: 'Millimeter (mm)', toBase: 0.001 },
            centimeter: { name: 'Centimeter (cm)', toBase: 0.01 },
            meter: { name: 'Meter (m)', toBase: 1 },
            kilometer: { name: 'Kilometer (km)', toBase: 1000 },
            inch: { name: 'Inch (in)', toBase: 0.0254 },
            foot: { name: 'Foot (ft)', toBase: 0.3048 },
            yard: { name: 'Yard (yd)', toBase: 0.9144 },
            mile: { name: 'Mile (mi)', toBase: 1609.34 }
        },
        baseUnit: 'meter'
    },
    mass: {
        name: 'Mass/Weight',
        units: {
            milligram: { name: 'Milligram (mg)', toBase: 0.000001 },
            gram: { name: 'Gram (g)', toBase: 0.001 },
            kilogram: { name: 'Kilogram (kg)', toBase: 1 },
            pound: { name: 'Pound (lb)', toBase: 0.453592 },
            ounce: { name: 'Ounce (oz)', toBase: 0.0283495 }
        },
        baseUnit: 'kilogram'
    },
    temperature: {
        name: 'Temperature',
        units: {
            celsius: { name: 'Celsius (°C)' },
            fahrenheit: { name: 'Fahrenheit (°F)' },
            kelvin: { name: 'Kelvin (K)' }
        },
        baseUnit: 'celsius'
    },
    digital: {
        name: 'Digital Storage',
        units: {
            bit: { name: 'Bit (b)', toBase: 1 },
            byte: { name: 'Byte (B)', toBase: 8 },
            kilobyte: { name: 'Kilobyte (KB)', toBase: 8000 },
            megabyte: { name: 'Megabyte (MB)', toBase: 8000000 },
            gigabyte: { name: 'Gigabyte (GB)', toBase: 8000000000 },
            terabyte: { name: 'Terabyte (TB)', toBase: 8000000000000 }
        },
        baseUnit: 'bit'
    }
};

// Application state
let currentCategory = 'length';
let isConverting = false;

// DOM elements
const categoryButtons = document.querySelectorAll('.category-btn');
const inputLeft = document.getElementById('input-left');
const inputRight = document.getElementById('input-right');
const unitLeft = document.getElementById('unit-left');
const unitRight = document.getElementById('unit-right');
const formulaDisplay = document.getElementById('formula-display');

// Initialize the application
function init() {
    // Set up category button event listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', handleCategoryChange);
    });

    // Set up input event listeners for real-time conversion
    inputLeft.addEventListener('input', () => handleInputChange('left'));
    inputRight.addEventListener('input', () => handleInputChange('right'));

    // Set up unit selection event listeners
    unitLeft.addEventListener('change', () => handleUnitChange('left'));
    unitRight.addEventListener('change', () => handleUnitChange('right'));

    // Initial setup
    populateUnits(currentCategory);
    updateFormulaDisplay();
}

// Handle category button click
function handleCategoryChange(event) {
    const button = event.currentTarget;
    const category = button.dataset.category;

    // Update active state
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Update current category and repopulate units
    currentCategory = category;
    populateUnits(category);

    // Clear inputs and update formula
    inputLeft.value = '';
    inputRight.value = '';
    updateFormulaDisplay();
}

// Populate unit dropdowns based on selected category
function populateUnits(category) {
    const units = conversionData[category].units;
    const unitKeys = Object.keys(units);

    // Clear existing options
    unitLeft.innerHTML = '';
    unitRight.innerHTML = '';

    // Add options to both dropdowns
    unitKeys.forEach(key => {
        const optionLeft = document.createElement('option');
        optionLeft.value = key;
        optionLeft.textContent = units[key].name;
        unitLeft.appendChild(optionLeft);

        const optionRight = document.createElement('option');
        optionRight.value = key;
        optionRight.textContent = units[key].name;
        unitRight.appendChild(optionRight);
    });

    // Set default selections (first and second unit)
    if (unitKeys.length > 1) {
        unitLeft.value = unitKeys[0];
        unitRight.value = unitKeys[1];
    }
}

// Handle input change for real-time conversion
function handleInputChange(side) {
    if (isConverting) return;

    const sourceInput = side === 'left' ? inputLeft : inputRight;
    const targetInput = side === 'left' ? inputRight : inputLeft;
    const sourceUnit = side === 'left' ? unitLeft.value : unitRight.value;
    const targetUnit = side === 'left' ? unitRight.value : unitLeft.value;

    const value = parseFloat(sourceInput.value);

    // Clear target if source is empty or invalid
    if (isNaN(value) || sourceInput.value === '') {
        targetInput.value = '';
        return;
    }

    // Perform conversion
    isConverting = true;
    const result = convert(value, sourceUnit, targetUnit, currentCategory);
    targetInput.value = formatResult(result);
    isConverting = false;

    updateFormulaDisplay();
}

// Handle unit selection change
function handleUnitChange(side) {
    // Trigger conversion from the opposite input if it has a value
    const sourceInput = side === 'left' ? inputRight : inputLeft;
    const sourceSide = side === 'left' ? 'right' : 'left';

    if (sourceInput.value !== '') {
        handleInputChange(sourceSide);
    } else {
        updateFormulaDisplay();
    }
}

// Convert value from one unit to another
function convert(value, fromUnit, toUnit, category) {
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    // For other categories, convert through base unit
    const units = conversionData[category].units;
    const baseValue = value * units[fromUnit].toBase;
    const result = baseValue / units[toUnit].toBase;

    return result;
}

// Special handling for temperature conversion
function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;

    switch (fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return (celsius * 9 / 5) + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// Format result to appropriate precision
function formatResult(value) {
    // Handle very large and very small numbers
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
        return value.toExponential(6);
    }

    // Round to appropriate decimal places
    const rounded = Math.round(value * 1e10) / 1e10;
    return rounded.toString();
}

// Update formula display based on current units
function updateFormulaDisplay() {
    const fromUnit = unitLeft.value;
    const toUnit = unitRight.value;
    const category = currentCategory;
    const units = conversionData[category].units;

    if (!fromUnit || !toUnit) {
        formulaDisplay.innerHTML = '<p>Select units to see conversion formula</p>';
        return;
    }

    // Get unit names without abbreviations
    const fromName = units[fromUnit].name.split('(')[0].trim();
    const toName = units[toUnit].name.split('(')[0].trim();

    let formulaText = '';

    if (category === 'temperature') {
        formulaText = getTemperatureFormula(fromUnit, toUnit);
    } else {
        const conversionFactor = convert(1, fromUnit, toUnit, category);
        const formattedFactor = formatResult(conversionFactor);
        formulaText = `<p><strong>1 ${fromName} = ${formattedFactor} ${toName}</strong></p>`;
    }

    formulaDisplay.innerHTML = formulaText;
}

// Get temperature conversion formula
function getTemperatureFormula(fromUnit, toUnit) {
    const formulas = {
        'celsius-fahrenheit': '<p><strong>°F = (°C × 9/5) + 32</strong></p><p>1 °C = 33.8 °F (at 1°C)</p>',
        'celsius-kelvin': '<p><strong>K = °C + 273.15</strong></p><p>1 °C = 274.15 K (at 1°C)</p>',
        'fahrenheit-celsius': '<p><strong>°C = (°F - 32) × 5/9</strong></p><p>1 °F = -17.22 °C (at 1°F)</p>',
        'fahrenheit-kelvin': '<p><strong>K = (°F - 32) × 5/9 + 273.15</strong></p><p>1 °F = 255.93 K (at 1°F)</p>',
        'kelvin-celsius': '<p><strong>°C = K - 273.15</strong></p><p>1 K = -272.15 °C (at 1K)</p>',
        'kelvin-fahrenheit': '<p><strong>°F = (K - 273.15) × 9/5 + 32</strong></p><p>1 K = -457.87 °F (at 1K)</p>'
    };

    const key = `${fromUnit}-${toUnit}`;
    return formulas[key] || '<p><strong>Same unit - no conversion needed</strong></p>';
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}