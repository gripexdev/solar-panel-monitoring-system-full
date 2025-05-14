import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LiveChart = ({ data }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Voltage (V)",
                data: [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Current (A)",
                data: [],
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
            {
                label: "Power (W)",
                data: [],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    });

    useEffect(() => {
        if (data) {
            const timestamp = new Date(data.timestamp).toLocaleTimeString();
            setChartData((prev) => {
                const newLabels = [...prev.labels, timestamp].slice(-20);
                const newVoltage = [...prev.datasets[0].data, data.voltage].slice(-20);
                const newCurrent = [...prev.datasets[1].data, data.current].slice(-20);
                const newPower = [...prev.datasets[2].data, data.power].slice(-20);

                return {
                    labels: newLabels,
                    datasets: [
                        { ...prev.datasets[0], data: newVoltage },
                        { ...prev.datasets[1], data: newCurrent },
                        { ...prev.datasets[2], data: newPower },
                    ],
                };
            });
        }
    }, [data]);

    return (
        <div className="chart-container">
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Solar Panel Performance",
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                    },
                }}
            />
        </div>
    );
};

export default LiveChart;