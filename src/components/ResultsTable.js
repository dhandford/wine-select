import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function ResultsTable({ units = [], evaps = [], btuh, onUnitSelect, onEvapSelect }) {
  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Condensing Units</Typography>
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
                <TableCell colSpan={5} align="center">No condensing units found.</TableCell>
              </TableRow>
            )}
            {units.map((unit, idx) => (
              <TableRow
                key={idx}
                hover
                style={{ cursor: 'pointer' }}
                onClick={() => onUnitSelect && onUnitSelect(unit)}
              >
                <TableCell>{unit.model}</TableCell>
                <TableCell>{unit.btuh}</TableCell>
                <TableCell>{unit.refrigerant}</TableCell>
                <TableCell>{unit.ambient}</TableCell>
                <TableCell>{unit.cond_temp}</TableCell>
                <TableCell>{unit.voltage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>Evaporators</Typography>
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
                <TableCell colSpan={4} align="center">No evaporators found.</TableCell>
              </TableRow>
            )}
            {evaps.map((evap, idx) => (
              <TableRow
                key={idx}
                hover
                style={{ cursor: 'pointer' }}
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
