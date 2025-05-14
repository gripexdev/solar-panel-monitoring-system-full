// MonitoringDashboard.js
import React, { useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import SensorDataDisplay from "./components/SensorDataDisplay";
import LiveChart from "./components/LiveChart";
import ControlPanel from "./components/ControlPanel";
import "./components/SolarPanel.css";
import "./solarpanel.css";

function MonitoringDashboard() {
    const [sensorData, setSensorData] = useState(null);

    const { stompClient, connected, error } = useWebSocket(
        "http://localhost:8080/ws",
        ["/topic/sensor-data"],
        (message) => {
            const newData = JSON.parse(message.body);
            setSensorData(newData);
        }
    );

    return (
        <div className="App">
            <header className="App-header">
                <h1>Solar Panel Monitoring System</h1>
                <div
                    className={`connection-status ${connected ? "connected" : "disconnected"}`}
                >
                    Status: {connected ? "Connected" : "Disconnected"}
                    {error && <div className="error-message">{error}</div>}
                </div>
            </header>
            <main>
                <div className="dashboard">
                    <div className="data-section">
                        <SensorDataDisplay data={sensorData} />
                        <LiveChart data={sensorData} />
                    </div>
                    <div className="control-section">
                        <ControlPanel stompClient={stompClient} connected={connected} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MonitoringDashboard;
