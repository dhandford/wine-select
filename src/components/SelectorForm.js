import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography } from "@mui/material";

export default function SelectorForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    btuh: "",
    refrigerant: "",
    ambient: "",
    voltage: "",
    evap_style: "",
    // Add other fields as needed
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.refrigerant) {
      setError("Refrigerant is required.");
      return;
    }
    // Add other validation if needed

    setError("");
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <Typography variant="h6" gutterBottom>
        Select Your System
      </Typography>
      <TextField
        required
        label="BTUH"
        name="btuh"
        type="number"
        value={formData.btuh}
        onChange={handleChange}
        style={{ marginRight: "1rem", minWidth: 120 }}
      />
      <TextField
        required
        label="Refrigerant"
        name="refrigerant"
        value={formData.refrigerant}
        onChange={handleChange}
        select
        style={{ marginRight: "1rem", minWidth: 120 }}
      >
        <MenuItem value="">Select</MenuItem>
        <MenuItem value="R448">R448</MenuItem>
        <MenuItem value="R449">R449</MenuItem>
        <MenuItem value="R404A">R404A</MenuItem>
        {/* Add other refrigerants as needed */}
      </TextField>
      <TextField
        label="Ambient Temp"
        name="ambient"
        type="number"
        value={formData.ambient}
        onChange={handleChange}
        style={{ marginRight: "1rem", minWidth: 120 }}
      />
      <TextField
        label="Voltage"
        name="voltage"
        value={formData.voltage}
        onChange={handleChange}
        style={{ marginRight: "1rem", minWidth: 120 }}
      />
      <TextField
        label="Evaporator Style"
        name="evap_style"
        value={formData.evap_style}
        onChange={handleChange}
        style={{ marginRight: "1rem", minWidth: 120 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem" }}
      >
        Search
      </Button>
      {error && (
        <Typography color="error" style={{ marginTop: "1rem" }}>
          {error}
        </Typography>
      )}
    </form>
  );
}