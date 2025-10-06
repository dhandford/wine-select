const LOSS_F = 1.8;
const DERATE = 0.97;

/**
 * Extrapolate evaporator BTUH to target TD (default: 15°F)
 * @param {number} evapBtuh10 - Evap BTUH at 10°F TD
 * @param {number} evapBtuh15 - Evap BTUH at 15-17°F TD (assume 15°F if not specified)
 * @param {number} targetTD - Target TD (default 15)
 * @returns {number}
 */
function extrapolateEvapBtuh(evapBtuh10, evapBtuh15, targetTD = 15) {
    evapBtuh10 = Number(evapBtuh10);
    evapBtuh15 = Number(evapBtuh15);

    if (evapBtuh10 == null || isNaN(evapBtuh10)) return evapBtuh15;
    if (evapBtuh15 == null || isNaN(evapBtuh15)) return evapBtuh10;
    // Linear extrapolation
    return evapBtuh10 + ((evapBtuh15 - evapBtuh10) / (15 - 10)) * (targetTD - 10);
}

export function bpCalc({
    unitBtuh40,
    unitBtuh35,
    evapBtuh15,
    evapBtuh10,
    boxTemp = null,
    targetTD = 15 // <-- NEW: target TD to extrapolate to!
}) {
    unitBtuh40 = Number(unitBtuh40);
    unitBtuh35 = Number(unitBtuh35);
    evapBtuh15 = Number(evapBtuh15);
    evapBtuh10 = Number(evapBtuh10);

    // Interpolate condensing unit BTUH between 40°F and 35°F suction at 37°F
    const targetSuctionTemp = 37;
    let unitBtuhInterpolated;
    if (!isNaN(unitBtuh40) && !isNaN(unitBtuh35)) {
        const slope = (unitBtuh40 - unitBtuh35) / (40 - 35);
        unitBtuhInterpolated = unitBtuh35 + slope * (targetSuctionTemp - 35);
    } else {
        unitBtuhInterpolated = unitBtuh40 || unitBtuh35 || 0;
    }

    // Extrapolate evaporator BTUH to target TD (default 15)
    const actualEvapBtuh = extrapolateEvapBtuh(evapBtuh10, evapBtuh15, targetTD);

    // Coil temp and TD
    const coilTemp = targetSuctionTemp - LOSS_F;
    const coilTD = boxTemp != null && !isNaN(boxTemp)
        ? boxTemp - coilTemp
        : targetTD;

    let systemBtuh = Math.min(unitBtuhInterpolated, actualEvapBtuh);
    systemBtuh = Math.round(systemBtuh * DERATE);

    return {
        coilTemp: Number(coilTemp.toFixed(1)),
        coilTD: Number(coilTD.toFixed(1)),
        btuh: systemBtuh,
        evapBtuhExtrapolated: Math.round(actualEvapBtuh)
    };
}