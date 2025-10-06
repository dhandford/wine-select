import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function UnitSummary({ unit, type }) {
  const [copied, setCopied] = useState(false);

  if (!unit) return null;

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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <Box mt={4} mb={4} border={1} borderRadius={2} sx={{ p: 3, background: "#fff" }}>
      <Typography variant="h6" gutterBottom>
        {type === "evaporator" ? "Evaporator Summary" : "Unit Summary"}
      </Typography>
      <Divider />
      <Box display="flex" alignItems="center">
        <Typography><b>Model:</b> {unit.model}</Typography>
        <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} arrow>
          <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleCopy(unit.model)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {unit.compressor && <Typography><b>Compressor:</b> {unit.compressor}</Typography>}
      <Typography><b>BTUH:</b> {unit.btuh}</Typography>
      <Typography><b>Refrigerant:</b> {unit.refrigerant}</Typography>
      {unit.ambient && <Typography><b>Ambient Temp:</b> {unit.ambient}</Typography>}
      {unit.voltage && <Typography><b>Voltage:</b> {unit.voltage}</Typography>}
      {unit.style && <Typography><b>Style:</b> {unit.style}</Typography>}
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
      <Typography mt={2} variant="subtitle1"><b>Notes:</b></Typography>
      <List>
        <ListItem>
          <ListItemText primary={unit.notes || "None"} />
        </ListItem>
      </List>
    </Box>
  );
}