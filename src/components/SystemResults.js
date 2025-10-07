import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);

function calculatePerformance({
    boxTemp,
    evapCapacity10td,
    suctionTemp1,
    capacity1,
    suctionTemp2,
    capacity2,
}) {
    // Input validation
    const keys = { boxTemp, evapCapacity10td, suctionTemp1, capacity1, suctionTemp2, capacity2 };
    for (const key in keys) {
        if (isNaN(keys[key])) {
            return { error: `Error: Please enter a valid number for all fields. Failed on: ${key}` };
        }
    }
    if (suctionTemp1 === suctionTemp2) {
        return { error: 'Error: Suction temperatures for the condensing unit cannot be the same.' };
    }

    // Linear equations
    const cu_m = (capacity2 - capacity1) / (suctionTemp2 - suctionTemp1);
    const cu_c = capacity1 - cu_m * suctionTemp1;
    const evap_slope_factor = evapCapacity10td / 10;
    const evap_m = -evap_slope_factor;
    const evap_c = evap_slope_factor * boxTemp;

    // Intersection point
    const balancedSST = (evap_c - cu_c) / (cu_m - evap_m);
    const balancedCapacity = cu_m * balancedSST + cu_c;
    const balancedTD = boxTemp - balancedSST;

    // Humidity estimate
    let humidityEstimate = 'N/A';
    if (balancedTD < 7) humidityEstimate = '>90%';
    else if (balancedTD <= 9) humidityEstimate = '90%';
    else if (balancedTD <= 12) humidityEstimate = '80-85%';
    else if (balancedTD <= 16) humidityEstimate = '65-80%';
    else if (balancedTD <= 22) humidityEstimate = '50-65%';
    else humidityEstimate = '<50%';

    // Chart data
    const chartRange = {
        min: Math.min(suctionTemp1, suctionTemp2, balancedSST) - 10,
        max: Math.max(suctionTemp1, suctionTemp2, balancedSST) + 10
    };
    const labels = [];
    const evapData = [];
    const cuData = [];
    for (let temp = Math.floor(chartRange.min); temp <= Math.ceil(chartRange.max); temp++) {
        labels.push(temp);
        evapData.push(evap_m * temp + evap_c);
        cuData.push(cu_m * temp + cu_c);
    }

    return {
        balancedSST: balancedSST.toFixed(1),
        balancedCapacity: balancedCapacity.toFixed(0),
        balancedTD: balancedTD.toFixed(1),
        humidityEstimate,
        chart: {
            labels,
            evapData,
            cuData,
            balancePoint: { x: Number(balancedSST.toFixed(1)), y: Number(balancedCapacity.toFixed(0)) }
        }
    };
}

function SystemResults({ inputs }) {
    // inputs: { boxTemp, evapCapacity10td, suctionTemp1, capacity1, suctionTemp2, capacity2 }
    const results = calculatePerformance(inputs);

    if (results.error) {
        return <div style={{ color: "red" }}>{results.error}</div>;
    }

    const data = {
        labels: results.chart.labels,
        datasets: [
            {
                label: "Evaporator Capacity",
                data: results.chart.evapData,
                borderColor: "rgb(255,99,132)",
                backgroundColor: "rgba(255,99,132,0.5)",
                tension: 0.1,
                fill: false,
            },
            {
                label: "Condensing Unit Capacity",
                data: results.chart.cuData,
                borderColor: "rgb(54,162,235)",
                backgroundColor: "rgba(54,162,235,0.5)",
                tension: 0.1,
                fill: false,
            },
            {
                label: "Balance Point",
                data: Array(results.chart.labels.length).fill(null).map((_, idx) => {
                    const temp = results.chart.labels[idx];
                    return temp === Math.round(results.chart.balancePoint.x)
                        ? results.chart.balancePoint.y
                        : null;
                }),
                borderColor: "rgb(75,192,192)",
                backgroundColor: "rgb(75,192,192)",
                pointStyle: "crossRot",
                pointRadius: 10,
                pointBorderWidth: 3,
                type: "scatter",
                showLine: false,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: "#333" }
            },
            title: {
                display: true,
                text: "System Performance Curves",
                color: "#333",
                font: { size: 16 }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Saturated Suction Temperature (°F)",
                    color: "#333"
                },
                ticks: { color: "#333" },
                grid: { color: "rgba(0,0,0,0.05)" }
            },
            y: {
                title: {
                    display: true,
                    text: "Capacity (BTU/hr)",
                    color: "#333"
                },
                ticks: { color: "#333" },
                grid: { color: "rgba(0,0,0,0.05)" }
            }
        }
    };

    return (
        <div>
            <h3>System Performance Results</h3>
            <ul>
                <li><strong>Balanced SST:</strong> {results.balancedSST} °F</li>
                <li><strong>Balanced Capacity:</strong> {results.balancedCapacity} BTU/hr</li>
                <li><strong>Balanced TD:</strong> {results.balancedTD} °F</li>
                <li><strong>Humidity Estimate:</strong> {results.humidityEstimate}</li>
            </ul>
            <Line data={data} options={options} />
        </div>
    );
}

export default SystemResults;