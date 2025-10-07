import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  InputLabel,
  Select,
  FormControl,
  OutlinedInput,
} from "@mui/material";

const ambientOptions = ["90", "100", "110"];
const refrigerantOptions = ["R134", "R404", "R448"];
const voltageOptions = ["115", "230"];
const styleOptions = [
  "DUCTED HORIZ",
  "RACK MOUNT",
  "DUCTED RACK MOUNT",
  "DUCTED VERTICAL",
  "WALL MOUNT",
  "RACK MOUNT VERT",
  "CEILING MOUNT",
  "CEILING MOUNT EXTERNAL",
];

function SelectorForm({ onSubmit }) {
  const [form, setForm] = useState({
    btuh: "",
    refrigerant: "",
    ambient: "",
    voltage: "",
    style: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, btuh: parseInt(form.btuh, 10) });
  };

  return (
    <Box mb={4} component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2} direction="column">
        {/* BTUH Load */}
        <Grid item xs={12}>
          <TextField
            label="BTUH Load *"
            name="btuh"
            type="number"
            required
            fullWidth
            variant="outlined"
            value={form.btuh}
            onChange={handleChange}
          />
        </Grid>

        {/* Refrigerant (Optional) */}
        <Grid item xs={12}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="refrigerant-label">Refrigerant*</InputLabel>
            <Select
              labelId="refrigerant-label"
              id="refrigerant-select"
              name="refrigerant"
              value={form.refrigerant}
              onChange={handleChange}
              displayEmpty
              input={<OutlinedInput label="Refrigerant" />}
              renderValue={(selected) => selected ? selected : "All"}
            >

              {refrigerantOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ambient (Required) */}
        <Grid item xs={12}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="ambient-label">Ambient Temp of Condensing Unit *</InputLabel>
            <Select
              labelId="ambient-label"
              id="ambient-select"
              name="ambient"
              value={form.ambient}
              onChange={handleChange}
              input={<OutlinedInput label="Ambient Temp of Condensing Unit *" />}
            >
              {ambientOptions.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}°F
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Voltage (Optional) */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="voltage-label">Voltage (optional)</InputLabel>
            <Select
              labelId="voltage-label"
              id="voltage-select"
              name="voltage"
              value={form.voltage}
              onChange={handleChange}
              displayEmpty
              input={<OutlinedInput label="Voltage (optional)" />}
              renderValue={(selected) => selected ? `${selected}V` : "All"}
            >
              <MenuItem value="">All</MenuItem>
              {voltageOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}V
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Evap Coil Style (Optional) */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="style-label">Evap Coil Style (optional)</InputLabel>
            <Select
              labelId="style-label"
              id="style-select"
              name="style"
              value={form.style}
              onChange={handleChange}
              displayEmpty
              input={<OutlinedInput label="Evap Coil Style (optional)" />}
              renderValue={(selected) => selected ? selected : "All"}
            >
              <MenuItem value="">All</MenuItem>
              {styleOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Search Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            SEARCH
          </Button>
        </Grid>
      </Grid>
      {/* Remove duplicate footer here if needed */}
    </Box>
  );
}

export default SelectorForm;