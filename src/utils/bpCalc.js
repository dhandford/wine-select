/**
 * Modular BP Calculator for React
 * Accepts:
 *   - Condensing unit BTUH @ 40°F suction (unitBtuh40)
 *   - Condensing unit BTUH @ 35°F suction (unitBtuh35)
 *   - Evaporator BTUH @ 15-17°F TD (evapBtuh15)
 *   - Evaporator BTUH @ 10°F TD (evapBtuh10)
 *   - Optional: boxTemp for coil TD calculation
 * Returns:
 *   { coilTemp, coilTD, btuh }
 */

const LOSS_F = 1.8;   // Suction line loss correction (°F)
const DERATE = 0.97;  // Capacity derate factor

export function bpCalc({
    unitBtuh40,
    unitBtuh35,
    evapBtuh15,
    evapBtuh10,
    boxTemp = null // Optional, for TD calculation
}) {
    // Defensive conversion
    unitBtuh40 = typeof unitBtuh40 === "string" ? Number(unitBtuh40.replace(/,/g, "")) : unitBtuh40;
    unitBtuh35 = typeof unitBtuh35 === "string" ? Number(unitBtuh35.replace(/,/g, "")) : unitBtuh35;
    evapBtuh15 = typeof evapBtuh15 === "string" ? Number(evapBtuh15.replace(/,/g, "")) : evapBtuh15;
    evapBtuh10 = typeof evapBtuh10 === "string" ? Number(evapBtuh10.replace(/,/g, "")) : evapBtuh10;

    // Interpolate condensing unit BTUH between 40°F and 35°F suction.
    // If you want to estimate at 37°F suction:
    const targetSuctionTemp = 37;
    let unitBtuhInterpolated;
    if (
        typeof unitBtuh40 === "number" &&
        typeof unitBtuh35 === "number" &&
        !isNaN(unitBtuh40) && !isNaN(unitBtuh35)
    ) {
        const slope = (unitBtuh40 - unitBtuh35) / (40 - 35);
        unitBtuhInterpolated = unitBtuh35 + slope * (targetSuctionTemp - 35);
    } else {
        unitBtuhInterpolated = unitBtuh40 || unitBtuh35 || 0;
    }

    // Use evaporator BTUH at 10°TD as reference performance
    const actualEvapBtuh = typeof evapBtuh10 === "number" && !isNaN(evapBtuh10)
        ? evapBtuh10
        : evapBtuh15 || 0;

    // Suction line loss adjustment (coil temp)
    const coilTemp = targetSuctionTemp - LOSS_F;

    // Coil TD = boxTemp - coilTemp, or default to 10 if boxTemp is not provided
    const coilTD = boxTemp != null && !isNaN(boxTemp)
        ? boxTemp - coilTemp
        : 10;

    // System BTUH is the limiting factor: lower of interpolated cond unit or evap
    let systemBtuh = Math.min(unitBtuhInterpolated, actualEvapBtuh);
    // Apply derate factor
    systemBtuh = Math.round(systemBtuh * DERATE);

    return {
        coilTemp: Number(coilTemp.toFixed(1)),
        coilTD: Number(coilTD.toFixed(1)),
        btuh: systemBtuh
    };
}