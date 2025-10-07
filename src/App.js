import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import SelectorForm from "./components/SelectorForm";
import ResultsTable from "./components/ResultsTable";
import UnitSummary from "./components/UnitSummary";
import SystemPerformance from "./components/SystemPerformance";
import { fetchCSV } from "./utils/csvLoader";
import Footer from './components/Footer';

const condunitsUrl = "https://raw.githubusercontent.com/dhandford/wine-select/main/condunitswine.csv";
const wineevapsUrl = "https://raw.githubusercontent.com/dhandford/wine-select/main/wineevaps.csv";

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

    // Normalize for matching
    const selectedRefrigerant = String(formData.refrigerant || "").trim().toLowerCase();
    const selectedAmbient = String(formData.ambient || "").trim().toLowerCase();
    const selectedVoltage = String(formData.voltage || "").trim().toLowerCase();
    const selectedEvapStyle = String(formData.evap_style || "").trim().toLowerCase();

    // Filter condunits by BTUH, refrigerant, ambient, and voltage
    const filteredCondunits = condunits.filter((row) => {
      const rowBTUH = Number(row.btuh);
      const rowRefrigerant = String(row.refrigerant || "").trim().toLowerCase();
      const rowAmbient = String(row.ambient || "").trim().toLowerCase();
      const rowVoltage = String(row.voltage || "").trim().toLowerCase();

      return (
        rowBTUH &&
        rowBTUH >= formData.btuh * 0.9 &&
        rowBTUH <= formData.btuh * 1.25 &&
        (!selectedRefrigerant || rowRefrigerant === selectedRefrigerant)
          (!selectedAmbient || rowAmbient === selectedAmbient) &&
        (!selectedVoltage || rowVoltage === selectedVoltage)
      );
    });

    // Filter evaporators by BTUH, refrigerant, style
    const filteredEvaps = evaps.filter((row) => {
      const rowBTUH = Number(String(row.btuh || "").replace(/[^\d.]/g, ''));
      const rowRefrigerant = String(row.refrigerant || "").trim().toLowerCase();
      const rowStyle = String(row.style || "").trim().toLowerCase();

      return (
        rowBTUH &&
        rowBTUH >= formData.btuh * 0.9 &&
        rowBTUH <= formData.btuh * 1.25 &&
        rowRefrigerant === selectedRefrigerant &&
        (!selectedEvapStyle || rowStyle === selectedEvapStyle)
      );
    });

    // Sort by BTUH
    const sortedCondunits = [...filteredCondunits].sort(
      (a, b) => Number(String(b.btuh).replace(/,/g, "")) - Number(String(a.btuh).replace(/,/g, ""))
    );
    const sortedEvaps = [...filteredEvaps].sort(
      (a, b) => Number(String(b.btuh).replace(/,/g, "")) - Number(String(a.btuh).replace(/,/g, ""))
    );

    setResults({
      condunits: sortedCondunits,
      evaps: sortedEvaps,
    });

    setSelectedUnit(null);
    setSelectedEvap(null);
  };

  const handleUnitSelect = (unit) => setSelectedUnit(unit);
  const handleEvapSelect = (evap) => setSelectedEvap(evap);

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
                selectedUnit={selectedUnit}
                selectedEvap={selectedEvap}
              />

              {/* ---- System Performance box appears when both are selected ---- */}
              {selectedUnit && selectedEvap && (
                <SystemPerformance unit={selectedUnit} evap={selectedEvap} />
              )}

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
      <Footer />
    </Container>
  );
}