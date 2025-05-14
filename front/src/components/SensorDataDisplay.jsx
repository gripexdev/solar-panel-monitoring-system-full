import React, { useState, useEffect } from "react";
import SolarPanel from "./SolarPanel";

const SensorDataDisplay = ({ data }) => {
    const [displayData, setDisplayData] = useState(data);
    const [isUpdating, setIsUpdating] = useState(false);
    const [pulseKey, setPulseKey] = useState(0);

    useEffect(() => {
        if (data) {
            setIsUpdating(true);
            setPulseKey((prev) => prev + 1); // Force re-render for animation

            const timer = setTimeout(() => {
                setDisplayData(data);
                setIsUpdating(false);
            }, 500); // Animation duration

            return () => clearTimeout(timer);
        }
    }, [data]);

    if (!displayData) return <div className="no-data">No data received yet</div>;

    return (
        <div className="sensor-data">
            <h3>Panel: {displayData.panelId}</h3>

            {/* Solar Panel Visualization */}
            <div className="panel-container">
                <SolarPanel
                    efficiency={data.efficiency}
                    temperature={data.temperature}
                    rotationAngle={data.rotationAngle || 0} // Add this to your DTO
                />
            </div>

            <div className="data-grid" key={pulseKey}>
                <div className={`data-item ${isUpdating ? "updating" : ""}`}>
                    <span className="label">Voltage:</span>
                    <span className="value">{displayData.voltage.toFixed(2)} V</span>
                </div>
                <div className={`data-item ${isUpdating ? "updating" : ""}`}>
                    <span className="label">Current:</span>
                    <span className="value">{displayData.current.toFixed(2)} A</span>
                </div>
                <div className={`data-item ${isUpdating ? "updating" : ""}`}>
                    <span className="label">Power:</span>
                    <span className="value">{displayData.power.toFixed(2)} W</span>
                </div>
                <div className={`data-item ${isUpdating ? "updating" : ""}`}>
                    <span className="label">Temperature:</span>
                    <span className="value">{displayData.temperature.toFixed(2)} °C</span>
                </div>
                <div className={`data-item ${isUpdating ? "updating" : ""}`}>
                    <span className="label">Efficiency:</span>
                    <span className="value">{displayData.efficiency.toFixed(2)}%</span>
                </div>
            </div>
        </div>
    );
};

export default SensorDataDisplay;