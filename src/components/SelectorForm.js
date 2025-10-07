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
        <Grid item xs={12}>
          <TextField
            label="BTUH Load"
            name="btuh"
            type="number"
            required
            fullWidth
            value={form.btuh}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Refrigerant</InputLabel>
            <Select
              name="refrigerant"
              value={form.refrigerant}
              label="Refrigerant"
              onChange={handleChange}
            >
              <MenuItem value="">All</MenuItem>
              {refrigerantOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Ambient Temp of Condensing Unit</InputLabel>
            <Select
              name="ambient"
              value={form.ambient}
              label="Ambient Temp"
              onChange={handleChange}
            >
              {ambientOptions.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}°F
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Voltage (optional)</InputLabel>
            <Select
              name="voltage"
              value={form.voltage}
              label="Voltage"
              onChange={handleChange}
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
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Evap Coil Style (optional)</InputLabel>
            <Select
              name="style"
              value={form.style}
              label="Evap Coil Style"
              onChange={handleChange}
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
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SelectorForm;
