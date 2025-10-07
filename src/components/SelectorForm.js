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
  Typography,
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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.refrigerant) {
      setError("Refrigerant is required.");
      return;
    }
    onSubmit({ ...form, btuh: parseInt(form.btuh, 10) });
  };

  return (
    <Box mb={4} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Select Your System
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={2.4}>
          <TextField
            label="BTUH *"
            name="btuh"
            type="number"
            required
            fullWidth
            variant="outlined"
            value={form.btuh}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="refrigerant-label">Refrigerant *</InputLabel>
            <Select
              labelId="refrigerant-label"
              id="refrigerant-select"
              name="refrigerant"
              value={form.refrigerant}
              onChange={handleChange}
              input={<OutlinedInput label="Refrigerant *" />}
              renderValue={(selected) => selected ? selected : "Select"}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {refrigerantOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="ambient-label">Ambient Temp *</InputLabel>
            <Select
              labelId="ambient-label"
              id="ambient-select"
              name="ambient"
              value={form.ambient}
              onChange={handleChange}
              input={<OutlinedInput label="Ambient Temp *" />}
              renderValue={(selected) => selected ? `${selected}°F` : "Select"}
            >
              {ambientOptions.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}°F
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="voltage-label">Voltage</InputLabel>
            <Select
              labelId="voltage-label"
              id="voltage-select"
              name="voltage"
              value={form.voltage}
              onChange={handleChange}
              input={<OutlinedInput label="Voltage" />}
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
        <Grid item xs={12} sm={2.4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="style-label">Evaporator Style</InputLabel>
            <Select
              labelId="style-label"
              id="style-select"
              name="style"
              value={form.style}
              onChange={handleChange}
              input={<OutlinedInput label="Evaporator Style" />}
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
        <Grid item xs={12} sm={2.4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            SEARCH
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default SelectorForm;