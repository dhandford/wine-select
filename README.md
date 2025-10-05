# Wine Refrigeration Selector

This is a web application for selecting wine refrigeration condensing units and evaporators based on your requirements.  
You can enter your BTUH load, refrigerant, ambient temperature, voltage, and evaporator coil style to get matching results.  
Click on any condensing unit or evaporator in the results to see a summary and a list of required addons.

## Features

- Search for condensing units and evaporators by specification
- View unit and evaporator summaries
- See required addons for each selection
- Data is loaded from CSV files

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/wine-select.git
   cd wine-select
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app locally:**
   ```bash
   npm start
   ```

4. **Open your browser and go to:**  
   [http://localhost:3000](http://localhost:3000)

## CSV Files

- `condunitswine.csv` — contains condensing unit data
- `wineevaps.csv` — contains evaporator data

Both files are stored in this repository and loaded by the app.

## Development

Feel free to contribute!  
Fork the repo, make changes, and submit a pull request.

## License

MIT

---

**Questions or issues?**  
Open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).
