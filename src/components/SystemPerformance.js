import React from "react";
import { bpCalc } from "../utils/bpCalc";
// If you have a bpCalc.js function, import it here
// import { bpCalc } from "../utils/bpCalc";

export default function SystemPerformance({ unit, evap }) {
    // Example: Extract the fields you need
    const unitBtuh40 = unit.btuh;
    const unitBtuh35 = unit.btuh_35;
    const evapBtuh15 = evap.btuh;
    const evapBtuh10 = evap.btuh_10td;

    // TODO: Call your bpCalc logic here
    // const result = bpCalc({ unitBtuh40, unitBtuh35, evapBtuh15, evapBtuh10 });

    // For now, just show the numbers to verify the data is flowing
    return (
        <div style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", background: "#f7f7f7" }}>
            <h3>System Performance (Demo)</h3>
            <p>Cond Unit BTUH @ 40°F: <b>{unitBtuh40}</b></p>
            <p>Cond Unit BTUH @ 35°F: <b>{unitBtuh35}</b></p>
            <p>Evap BTUH @ 15-17°F TD: <b>{evapBtuh15}</b></p>
            <p>Evap BTUH @ 10°F TD: <b>{evapBtuh10}</b></p>
            {/* You can display calculated results here later */}
            {/* <p>Coil Temp: {result.coilTemp}</p>
      <p>Coil TD: {result.coilTD}</p>
      <p>System BTUH: {result.btuh}</p> */}
        </div>
    );
}