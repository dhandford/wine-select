import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography, Box } from "@mui/material";
import SelectorForm from "./components/SelectorForm";
import ResultsTable from "./components/ResultsTable";
import UnitSummary from "./components/UnitSummary";
import SystemPerformance from "./components/SystemPerformance";
import { fetchCSV } from "./utils/csvLoader";
import Footer from './components/Footer';
import SystemResults from './components/SystemResults';

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
        (!selectedRefrigerant || rowRefrigerant === selectedRefrigerant) &&
        (!selectedAmbient || rowAmbient === selectedAmbient) &&
        (!selectedVoltage || rowVoltage === selectedVoltage)
      );
    });

    // Filter evaporators by BTUH, refrigerant, style
    const filteredEvaps = evaps.filter((row) => {
      const rowBTUH = Number(String(row.btuh || "").replace(/[^\d.]/g, ''));
      const rowRefrigerant = String(row.refrigerant || "").trim().toLowerCase();
      const rowStyle = String(row.style || "").trim().toLowerCase();

      const isUniversalEvap =
        !rowRefrigerant || rowRefrigerant === "all" || rowRefrigerant === "any";
      const isUniversalStyle =
        !rowStyle || rowStyle === "all" || rowStyle === "any";

      const selectedRefrigerantLC = String(selectedRefrigerant || "").trim().toLowerCase();
      const selectedEvapStyleLC = String(selectedEvapStyle || "").trim().toLowerCase();

      // Define debug variables using your original logic
      const passesBTUH =
        rowBTUH &&
        rowBTUH >= formData.btuh * 0.9 &&
        rowBTUH <= formData.btuh * 1.25;

      const passesRefrigerant =
        !selectedRefrigerantLC || isUniversalEvap || rowRefrigerant === selectedRefrigerantLC;

      const passesStyle =
        !selectedEvapStyleLC || rowStyle === selectedEvapStyleLC;

      if (!passesBTUH || !passesRefrigerant || !passesStyle) {
        console.log("Filtered Out:", {
          model: row.model,
          rowBTUH,
          rowRefrigerant,
          rowStyle,
          selectedRefrigerantLC,
          selectedEvapStyleLC,
          passesBTUH,
          passesRefrigerant,
          passesStyle
        });
      }

      // FINAL: Use debug flags to filter
      return passesBTUH && passesRefrigerant && passesStyle;
    });

    console.log("Filtered Evaporators:", filteredEvaps);

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
                <>

                  <SystemResults
                    inputs={{
                      boxTemp: selectedUnit.boxTemp || selectedEvap.boxTemp || query?.boxTemp || 55,
                      evapCapacity10td: selectedEvap.btuh_10td,
                      suctionTemp1: 35, // Replace with real value if you have one
                      capacity1: selectedUnit.btuh_35,
                      suctionTemp2: 40, // Replace with real value if you have one
                      capacity2: selectedUnit.btuh,
                    }}
                  />

                  {(() => {
                    const addonFields = [
                      "required_addon1",
                      "required_addon2",
                      "required_addon3",
                      "required_addon4",
                      "required_addon5",
                    ];
                    const unitAddons = addonFields
                      .map(field => selectedUnit?.[field])
                      .filter(addon => addon && addon.toLowerCase() !== "none");
                    const evapAddons = addonFields
                      .map(field => selectedEvap?.[field])
                      .filter(addon => addon && addon.toLowerCase() !== "none");
                    const summaryItems = [
                      selectedUnit?.model,
                      selectedEvap?.model,
                      ...unitAddons,
                      ...evapAddons
                    ].filter(Boolean);

                    return (
                      <Box
                        sx={{
                          mt: 2,
                          mb: 2,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          background: "#fff",
                          p: 2,
                          minHeight: 60,
                        }}
                      >
                        <ul style={{ margin: 0, paddingLeft: "1.25em" }}>
                          {summaryItems.map((item, idx) => (
                            <li key={idx}>
                              <Typography>{item}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    );
                  })()}

                </>
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