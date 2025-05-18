import React, { useState, useEffect } from "react";
import useWebSocket from "./hooks/useWebSocket";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  WiStrongWind as WindIcon,
  WiSnow as IceIcon,
  WiRain as RainIcon,
  WiThermometer as TemperatureIcon,
  WiDaySunny as RadiationIcon,
  WiSunrise as SunIcon,
  WiBarometer as PressureIcon,
  WiHumidity as HumidityIcon
} from "react-icons/wi";
import {
  FaPowerOff as PowerIcon,
  FaExclamationTriangle as AlertIcon,
  FaShieldAlt as SafetyIcon,
  FaRobot as AutoIcon,
  FaHandPaper as ManualIcon,
  FaPlug as ConnectedIcon,
  FaStopCircle as EmergencyStopIcon
} from "react-icons/fa";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import SolarPanel from "./components/SolarPanel";
import "./SolarPanelDashboard2.css";

function MonitoringDashboardV2() {
  // State for all the data displayed in the UI
  const [dateTime, setDateTime] = useState("2024-04-24 10:30");
  const [connected, setConnected] = useState(true);
  const [systemStatus, setSystemStatus] = useState("ON");

  // Environmental sensors data
  const [environmentalData, setEnvironmentalData] = useState({
    windSpeed: "5.2 m/s",
    iceDetected: "Yes",
    rainDetected: "No",
    temperature: "11.8°C",
    radiation: "576 W/m²",
    humidity: "45%",
    pressure: "1012 hPa"
  });

  // Tracker control state
  const [controlMode, setControlMode] = useState("MANUAL");
  const [targetAngle, setTargetAngle] = useState("25°");
  const [limitSwitchState, setLimitSwitchState] = useState("Triggered");

  // Plant requirements
  const [plantRequirements, setPlantRequirements] = useState({
    sunRays: "Morning",
    shading: 0,
    nightFrostProtection: "USED"
  });

  // Alert logs
  const [alertLogs, setAlertLogs] = useState([
    "Safety mode activated",
    "Wind speed high",
    "Fault detected"
  ]);

  // Chart data
  const [angleData, setAngleData] = useState([
    { time: '00:00', angle: 30, radiation: 100 },
    { time: '04:00', angle: 35, radiation: 300 },
    { time: '08:00', angle: 45, radiation: 500 },
    { time: '12:00', angle: 40, radiation: 700 },
    { time: '16:00', angle: 30, radiation: 500 },
    { time: '20:00', angle: 35, radiation: 300 },
    { time: '24:00', angle: 30, radiation: 100 }
  ]);

  // Current values
  const [currentAngle, setCurrentAngle] = useState(35);
  const [currentRadiation, setCurrentRadiation] = useState(576);

  // Update current date and time
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 10) + ' ' +
        now.toTimeString().slice(0, 5);
      setDateTime(formattedDateTime);
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  // WebSocket connection
  const { stompClient, connected: wsConnected, error } = useWebSocket(
    "http://localhost:8080/ws",
    ["/topic/sensor-data"],
    (message) => {
      const newData = JSON.parse(message.body);
      // Update states based on received data
      if (newData.environmental) {
        setEnvironmentalData(newData.environmental);
      }
      if (newData.trackerControl) {
        setControlMode(newData.trackerControl.mode);
        setTargetAngle(newData.trackerControl.angle);
        setLimitSwitchState(newData.trackerControl.limitSwitch);
      }
      if (newData.chartData) {
        // Add new data points to the chart
        if (newData.chartData.angle) {
          const newAngleData = [...angleData];
          newAngleData.shift();
          newAngleData.push({
            time: new Date().toTimeString().slice(0, 5),
            angle: newData.chartData.angle,
            radiation: newData.chartData.radiation || currentRadiation
          });
          setAngleData(newAngleData);
          setCurrentAngle(newData.chartData.angle);
          if (newData.chartData.radiation) {
            setCurrentRadiation(newData.chartData.radiation);
          }
        }
      }
    }
  );

  // Update connection status when WebSocket state changes
  useEffect(() => {
    setConnected(wsConnected);
  }, [wsConnected]);

  // Function to handle control mode changes
  const changeControlMode = (mode) => {
    setControlMode(mode);
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/control", {}, JSON.stringify({ mode }));
    }
  };

  // Function to handle emergency stop
  const handleEmergencyStop = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/emergency", {}, JSON.stringify({ stop: true }));
    }
    // Update UI to reflect emergency state
    setSystemStatus("EMERGENCY");
  };

  // Function to handle sun rays selection
  const handleSunRaysChange = (e) => {
    setPlantRequirements({
      ...plantRequirements,
      sunRays: e.target.value
    });
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/plant-requirements", {}, JSON.stringify({ sunRays: e.target.value }));
    }
  };

  // Function to handle shading change
  const handleShadingChange = (e) => {
    const newShading = parseInt(e.target.value);
    setPlantRequirements({
      ...plantRequirements,
      shading: newShading
    });
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/plant-requirements", {}, JSON.stringify({ shading: newShading }));
    }
  };

  return (
    <div className="solar-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Solar Panel Monitoring System</h1>
        <div className="header-info">
          <div className="date-time">
            <span>{dateTime}</span>
          </div>
          <div className="connection-status">
            <ConnectedIcon className={connected ? "connected" : "disconnected"} />
            <span>{connected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* System Status Card */}
        <div className="dashboard-card system-status">
          <div className="card-header">
            <h2><PowerIcon /> SYSTEM STATUS</h2>
            <div className={`status-badge ${systemStatus.toLowerCase()}`}>
              {systemStatus}
            </div>
          </div>
          <div className="card-content">
            <div className="status-indicators">
              <div className="indicator">
                <span>Current Angle</span>
                <strong>{currentAngle}°</strong>
              </div>
              <div className="indicator">
                <span>Current Radiation</span>
                <strong>{currentRadiation} W/m²</strong>
              </div>
            </div>
            <div className="solar-panel-visualization">
              <SolarPanel
                efficiency={Math.min(100, Math.floor(currentRadiation / 10))}
                temperature={parseFloat(environmentalData.temperature)}
                rotationAngle={currentAngle}
              />
            </div>
          </div>
        </div>

        {/* Environmental Sensors Card */}
        <div className="dashboard-card environmental-sensors">
          <div className="card-header">
            <h2><SettingsIcon /> ENVIRONMENTAL SENSORS</h2>
          </div>
          <div className="card-content">
            <div className="sensor-grid">
              <div className="sensor-item">
                <div className="sensor-icon"><WindIcon /></div>
                <div className="sensor-info">
                  <span>Wind Speed</span>
                  <strong>{environmentalData.windSpeed}</strong>
                </div>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon"><IceIcon /></div>
                <div className="sensor-info">
                  <span>Ice Detected</span>
                  <strong className={environmentalData.iceDetected === "Yes" ? "warning" : ""}>
                    {environmentalData.iceDetected}
                  </strong>
                </div>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon"><RainIcon /></div>
                <div className="sensor-info">
                  <span>Rain Detected</span>
                  <strong>{environmentalData.rainDetected}</strong>
                </div>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon"><TemperatureIcon /></div>
                <div className="sensor-info">
                  <span>Temperature</span>
                  <strong>{environmentalData.temperature}</strong>
                </div>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon"><RadiationIcon /></div>
                <div className="sensor-info">
                  <span>Radiation</span>
                  <strong>{environmentalData.radiation}</strong>
                </div>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon"><HumidityIcon /></div>
                <div className="sensor-info">
                  <span>Humidity</span>
                  <strong>{environmentalData.humidity}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracker Control Card */}
        <div className="dashboard-card tracker-control">
          <div className="card-header">
            <h2><SettingsIcon /> TRACKER CONTROL</h2>
          </div>
          <div className="card-content">
            <div className="control-modes">
              <button
                className={`control-button ${controlMode === "MANUAL" ? "active" : ""}`}
                onClick={() => changeControlMode("MANUAL")}
              >
                <ManualIcon /> MANUAL MODE
              </button>
              <button
                className={`control-button ${controlMode === "SAFETY" ? "active" : ""}`}
                onClick={() => changeControlMode("SAFETY")}
              >
                <SafetyIcon /> SAFETY MODE
              </button>
              <button
                className={`control-button ${controlMode === "AUTOTRACK" ? "active" : ""}`}
                onClick={() => changeControlMode("AUTOTRACK")}
              >
                <AutoIcon /> AUTOTRACK
              </button>
            </div>
            <div className="angle-display">
              <div className="angle-value">
                <span>Target Angle</span>
                <strong>{targetAngle}</strong>
              </div>
              <div className="limit-switch">
                <span>Limit Switch</span>
                <strong className={limitSwitchState === "Triggered" ? "warning" : ""}>
                  {limitSwitchState}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts Card */}
        <div className="dashboard-card performance-charts">
          <div className="card-header">
            <h2><SettingsIcon /> PERFORMANCE METRICS</h2>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <h3>Panel Angle Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={angleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="angle"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3>Solar Radiation Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={angleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="radiation"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Plant Requirements Card */}
        <div className="dashboard-card plant-requirements">
          <div className="card-header">
            <h2><SunIcon /> PLANT REQUIREMENTS</h2>
          </div>
          <div className="card-content">
            <div className="requirement-item">
              <label>Sun Rays Period</label>
              <select
                value={plantRequirements.sunRays}
                onChange={handleSunRaysChange}
                className="time-select"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="requirement-item">
              <label>Shading: {plantRequirements.shading}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={plantRequirements.shading}
                onChange={handleShadingChange}
                className="shading-slider"
              />
            </div>
            <div className="requirement-item">
              <label>Night Frost Protection</label>
              <div className={`protection-status ${plantRequirements.nightFrostProtection === "USED" ? "active" : ""}`}>
                {plantRequirements.nightFrostProtection}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Logs Card */}
        <div className="dashboard-card alert-logs">
          <div className="card-header">
            <h2><AlertIcon /> ALERT LOGS</h2>
          </div>
          <div className="card-content">
            <ul className="alert-list">
              {alertLogs.map((alert, index) => (
                <li key={index} className="alert-item">
                  <span className="alert-icon"><AlertIcon /></span>
                  <span className="alert-message">{alert}</span>
                  <span className="alert-time">10:{30 - index} AM</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Stop Button */}
      <div className="emergency-stop">
        <button className="emergency-stop-button" onClick={handleEmergencyStop}>
          <EmergencyStopIcon /> EMERGENCY STOP
        </button>
      </div>
    </div>
  );
}

export default MonitoringDashboardV2;