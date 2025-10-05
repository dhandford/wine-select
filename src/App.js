import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import SelectorForm from "./components/SelectorForm";
import ResultsTable from "./components/ResultsTable";
import UnitSummary from "./components/UnitSummary";
import { fetchCSV } from "./utils/csvLoader";

const condunitsUrl = "https://raw.githubusercontent.com/dhandford/wine-select/main/condunitswine.csv";
const wineevapsUrl = "https://raw.githubusercontent.com/dhandford/wine-select/main/wineevaps.csv";

function filterCondUnits(data, { btuh, refrigerant, ambient, voltage }) {
  return data.filter((row) => {
    const rowBTUH = Number(row.btuh);
    const rowAmbient = Number(row.ambient);
    const formAmbient = Number(ambient);
    const matchesBTU = rowBTUH && rowBTUH >= btuh * 0.9 && rowBTUH <= btuh * 1.25;
    const matchesRefrig = refrigerant === "any" || row.refrigerant === refrigerant;
    const matchesAmbient = rowAmbient === formAmbient;
    const matchesVoltage = !voltage || String(row.voltage) === String(voltage);
    return matchesBTU && matchesRefrig && matchesAmbient && matchesVoltage;
  });
}

function filterEvaps(data, { btuh, refrigerant, style }) {
  return data.filter((row) => {
    // Sanitize BTUH for proper number comparison
    const rowBTUH = Number(String(row.btuh).replace(/[^\d.]/g, ''));
    // Normalize refrigerant for robust matching
    const matchesRefrig = row.refrigerant.trim().toLowerCase() === "any" ||
      row.refrigerant.trim().toLowerCase() === refrigerant.trim().toLowerCase();
    const matchesStyle = !style || row.style === style || style === "any";
    const matchesBTU = rowBTUH && rowBTUH >= btuh * 0.9 && rowBTUH <= btuh * 1.25;
    return matchesBTU && matchesRefrig && matchesStyle;
  });
}

export default function App() {
  const [condunits, setCondunits] = useState([]);
  const [evaps, setEvaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState({ condunits: [], evaps: [] });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedEvap, setSelectedEvap] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cu, ev] = await Promise.all([
        fetchCSV(condunitsUrl),
        fetchCSV(wineevapsUrl),
      ]);
      setCondunits(cu);
      setEvaps(ev);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = (formData) => {
    setQuery(formData);
    setResults({
      condunits: filterCondUnits(condunits, formData),
      evaps: filterEvaps(evaps, formData),
    });
    setSelectedUnit(null); // Clear selection on new search
    setSelectedEvap(null);
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
  };

  const handleEvapSelect = (evap) => {
    setSelectedEvap(evap);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Wine Refrigeration Selector</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <SelectorForm onSubmit={handleSubmit} />
          {query && (
            <>
              <ResultsTable
                units={results.condunits}
                evaps={results.evaps}
                btuh={query.btuh}
                onUnitSelect={handleUnitSelect}
                onEvapSelect={handleEvapSelect}
              />
              {selectedUnit && (
                <UnitSummary unit={selectedUnit} />
              )}

              {selectedEvap && (
                <UnitSummary unit={selectedEvap} type="evaporator" />
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
