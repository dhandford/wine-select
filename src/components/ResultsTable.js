import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function ResultsTable({
  units = [],
  evaps = [],
  btuh,
  onUnitSelect,
  onEvapSelect,
  selectedUnit,
}) {
  const sortedUnits = [...units].sort(
    (a, b) =>
      Number(String(b.btuh).replace(/,/g, "")) -
      Number(String(a.btuh).replace(/,/g, ""))
  );
  const sortedEvaps =
    evaps && evaps.length > 0
      ? [...evaps].sort(
        (a, b) =>
          Number(String(b.btuh).replace(/,/g, "")) -
          Number(String(a.btuh).replace(/,/g, "")
          )
      )
      : [];

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Condensing Units
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>BTUH</TableCell>
              <TableCell>Refrigerant</TableCell>
              <TableCell>Ambient Temp</TableCell>
              <TableCell>Condensing Temp</TableCell>
              <TableCell>Voltage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No condensing units found.
                </TableCell>
              </TableRow>
            )}
            {sortedUnits.map((unit, idx) => (
              <TableRow
                key={idx}
                hover
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedUnit && selectedUnit.model === unit.model
                      ? "#807575ff"
                      : "inherit",
                  color:
                    selectedUnit && selectedUnit.model === unit.model
                      ? "#fff"
                      : "inherit",
                  fontWeight:
                    selectedUnit && selectedUnit.model === unit.model
                      ? 700
                      : 400,
                }}
                onClick={() => onUnitSelect && onUnitSelect(unit)}
              >
                <TableCell>{unit.model}</TableCell>
                <TableCell>
                  {Number(String(unit.btuh).replace(/,/g, "")) >= btuh ? (
                    <CircleIcon
                      fontSize="small"
                      sx={{
                        color: "green",
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                  ) : (
                    <CircleIcon
                      fontSize="small"
                      sx={{
                        color: "gold",
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                  )}
                  {unit.btuh}
                </TableCell>
                <TableCell>{unit.refrigerant}</TableCell>
                <TableCell>{unit.ambient}</TableCell>
                <TableCell>{unit.cond_temp}</TableCell>
                <TableCell>{unit.voltage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>
        Evaporators
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>BTUH</TableCell>
              <TableCell>Refrigerant</TableCell>
              <TableCell>Style</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaps.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No evaporators found.
                </TableCell>
              </TableRow>
            )}
            {sortedEvaps.map((evap, idx) => (
              <TableRow
                key={idx}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => onEvapSelect && onEvapSelect(evap)}
              >
                <TableCell>{evap.model}</TableCell>
                <TableCell>{evap.btuh}</TableCell>
                <TableCell>{evap.refrigerant}</TableCell>
                <TableCell>{evap.style}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}