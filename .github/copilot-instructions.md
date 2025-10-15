# Wine Refrigeration Selector - AI Coding Instructions

## Overview
This is a React-based wine refrigeration system selector that helps users find compatible condensing units and evaporators based on BTUH load, refrigerant type, ambient temperature, voltage, and evaporator style. The app performs equipment matching and system performance analysis.

## Architecture & Key Components

### Data Layer (`src/utils/`)
- **`csvLoader.js`**: Uses Papa Parse to load CSV data from static files in `/public/wineselect/`
- **`bpCalc.js`**: Core business logic for refrigeration calculations (balance point analysis, capacity extrapolation)

### Component Structure (`src/components/`)
- **`SelectorForm.js`**: Form with predefined dropdown options (ambient: 90/100/110°F, refrigerant: R134/R404/R448, voltage: 115/230V)
- **`ResultsTable.js`**: Displays filtered equipment with color-coded capacity indicators (green ≥ target BTUH, gold < target)
- **`SystemResults.js`**: Chart.js integration for performance curve visualization and system balance point calculation
- **`UnitSummary.js`**: Shows selected equipment details and required add-ons

### Data Files
- **`condunitswine.csv`**: Condensing units with capacity ratings at 35°F/40°F suction temps
- **`wineevaps.csv`**: Evaporators with capacity at standard and 10°F TD conditions
- Files contain required add-ons (required_addon1-5 columns) that auto-populate in system summary

## Critical Business Logic

### Equipment Filtering (App.js handleSubmit)
- **BTUH Range**: ±25% tolerance (0.5x to 1.25x input BTUH)
- **Evaporator Matching**: Supports "universal" evaporators (refrigerant: "all"/"any" or empty)
- **String Matching**: Uses normalized lowercase comparison with whitespace cleanup

### Performance Calculations (bpCalc.js)
- **Constants**: LOSS_F = 1.8°F, DERATE = 0.97
- **Interpolation**: Linear interpolation between 35°F and 40°F suction temperatures to get 37°F performance
- **TD Extrapolation**: Evaporator capacity extrapolated from 10°F TD to target TD (default 15°F)

### System Analysis (SystemResults.js)
- Creates performance curves by solving linear equations for condensing unit vs evaporator capacity
- Finds balance point intersection and estimates humidity levels based on TD ranges

## Development Patterns

### State Management
- Single App.js manages all state (equipment data, search results, selections)
- Selection state uses unique keys combining multiple fields (model + refrigerant + ambient + voltage)

### Material-UI Integration
- Consistent use of MUI Grid system for responsive layouts
- FormControl + Select pattern for all dropdowns with proper labeling
- TableContainer + hover effects for equipment selection

### CSV Data Handling
- Files loaded once on app startup via Promise.all
- Dynamic typing enabled in Papa Parse for numeric fields
- Public folder serves CSV files with `/wineselect/` prefix for GitHub Pages deployment

## Key Files to Modify When:
- **Adding equipment types**: Update `SelectorForm.js` dropdown options and `App.js` filtering logic
- **Changing calculations**: Modify constants/formulas in `bpCalc.js`
- **UI changes**: Focus on `App.js` (main layout) and individual components
- **Data structure changes**: Update CSV parsing in `csvLoader.js` and related filtering logic

## Development Commands
- `npm start`: Development server (localhost:3000)
- `npm run build`: Production build for deployment
- `npm test`: Run test suite
- Homepage set to `/wineselect` for GitHub Pages deployment

## Common Debugging Areas
- Check browser console for CSV loading errors or filtering debug logs
- BTUH field parsing (string → number conversion with comma removal)
- Equipment matching logic when results seem incorrect
- Chart.js performance curve calculations in SystemResults component