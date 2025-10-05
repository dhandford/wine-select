import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function UnitSummary({ unit, type }) {
  if (!unit) return null;

  // Gather all required addon fields for both types
  const addonFields = [
    "required_addon1",
    "required_addon2",
    "required_addon3",
    "required_addon4",
    "required_addon5",
  ];
  const addons = addonFields
    .map(field => unit[field])
    .filter(addon => addon && addon.toLowerCase() !== "none");

  return (
    <Box mt={4} p={2} border={1} borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        {type === "evaporator" ? "Evaporator Summary" : "Unit Summary"}
      </Typography>
      <Divider />
      <Typography><b>Model:</b> {unit.model}</Typography>
      <Typography><b>BTUH:</b> {unit.btuh}</Typography>
      <Typography><b>Refrigerant:</b> {unit.refrigerant}</Typography>
      {unit.ambient && <Typography><b>Ambient Temp:</b> {unit.ambient}</Typography>}
      {unit.voltage && <Typography><b>Voltage:</b> {unit.voltage}</Typography>}
      {unit.style && <Typography><b>Style:</b> {unit.style}</Typography>}
      {unit.notes && <Typography><b>Notes:</b> {unit.notes}</Typography>}
      <Typography mt={2} variant="subtitle1"><b>Required Addons:</b></Typography>
      <List>
        {addons.length === 0 ? (
          <ListItem>
            <ListItemText primary="None" />
          </ListItem>
        ) : (
          addons.map((addon, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={addon} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
