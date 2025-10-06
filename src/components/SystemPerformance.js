import React from "react";
import { bpCalc } from "../utils/bpCalc";

export default function SystemPerformance({ unit, evap }) {
    const unitBtuh40 = unit.btuh;
    const unitBtuh35 = unit.btuh_35;
    const evapBtuh15 = evap.btuh;
    const evapBtuh10 = evap.btuh_10td;
    const boxTemp = unit.boxTemp || evap.boxTemp || null;

    const result = bpCalc({
        unitBtuh40,
        unitBtuh35,
        evapBtuh15,
        evapBtuh10,
        boxTemp,
        targetTD: 15
    });

    return (
        <div style={{
            margin: "2rem 0",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f7f7f7"
        }}>
            <h3>System Performance</h3>
            <p>Cond Unit BTUH @ 40°F: <b>{unitBtuh40}</b></p>
            <p>Cond Unit BTUH @ 35°F: <b>{unitBtuh35}</b></p>
            <p>Evap BTUH @ 15-17°F TD: <b>{evapBtuh15}</b></p>
            <p>Evap BTUH @ 10°F TD: <b>{evapBtuh10}</b></p>
            <hr />
            <p>Coil Temp: <b>{result.coilTemp}</b> °F</p>
            <p>Coil TD: <b>{result.coilTD}</b> °F</p>
            <p>Evap BTUH @ 15°F TD (extrapolated): <b>{result.evapBtuhExtrapolated}</b></p>
        </div>
    );
}