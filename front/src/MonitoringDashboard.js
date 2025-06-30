import React, { useState, useEffect } from "react";
import useWebSocket from "./hooks/useWebSocket";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	WiStrongWind as WindIcon,
	WiSnow as IceIcon,
	WiRain as RainIcon,
	WiThermometer as TemperatureIcon,
	WiDaySunny as RadiationIcon,
	WiSunrise as SunIcon,
	WiHumidity as HumidityIcon,
} from "react-icons/wi";
import {
	FaPowerOff as PowerIcon,
	FaExclamationTriangle as AlertIcon,
	FaShieldAlt as SafetyIcon,
	FaRobot as AutoIcon,
	FaHandPaper as ManualIcon,
	FaPlug as ConnectedIcon,
	FaStopCircle as EmergencyStopIcon,
} from "react-icons/fa";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import SolarPanel from "./components/SolarPanel";
import "./SolarPanelDashboard2.css";

function MonitoringDashboard({ userRole = "ADMIN" }) {
	// Check if the user is an admin
	const isAdmin = userRole === "ADMIN";

	// State for all the data displayed in the UI
	const [dateTime, setDateTime] = useState(
		new Date().toISOString().slice(0, 16).replace("T", " ")
	);
	const [connected, setConnected] = useState(false);
	const [systemStatus, setSystemStatus] = useState("ON");

	// Sensor data state (initialized with default values matching the Python data)
	const [sensorData, setSensorData] = useState({
		snow: 0,
		wind_speed: 0,
		rain_detected: 0,
		switch_state: 0,
		radiation: 0,
		pvAngle: 0,
		humidity: 0,
		temperature: 0,
		timestamp: "",
	});

	// Tracker control state
	const [controlMode, setControlMode] = useState("MANUAL");
	const [targetAngle, setTargetAngle] = useState("25°");
	const [manualAngle, setManualAngle] = useState(25); // Default angle
	const [limitSwitchState] = useState("Triggered");

	// Plant requirements
	const [plantRequirements, setPlantRequirements] = useState({
		sunRays: "Morning",
		shading: 0,
		nightFrostProtection: true, // Now boolean
	});

	// Alert logs
	const [alertLogs, setAlertLogs] = useState([]);

	// Chart data
	const [angleData, setAngleData] = useState([]);
	const MAX_DATA_POINTS = 20;

	// Update current date and time
	useEffect(() => {
		const intervalId = setInterval(() => {
			setDateTime(new Date().toISOString().slice(0, 16).replace("T", " "));
		}, 60000);
		return () => clearInterval(intervalId);
	}, []);

	// Function to get the current time of day as a fraction of the day (0 to 1)
	const getCurrentTimeOfDay = () => {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		return (hours * 60 + minutes) / 1440; // 1440 minutes in a day
	};

	// WebSocket connection
	const {
		stompClient,
		connected: wsConnected,
	} = useWebSocket(
		"http://localhost:8080/ws",
		["/topic/sensor-data"],
		(message) => {
			try {
				const newData = JSON.parse(message.body);
				setSensorData((prev) => ({
					...prev,
					...newData,
				}));

				// Update chart data
				const now = new Date().toTimeString().slice(0, 5);
				setAngleData((prev) => {
					const newDataPoints = [
						...prev,
						{
							time: now,
							angle: newData.pvAngle || 0,
							radiation: newData.radiation || 0,
						},
					];
					return newDataPoints.length > MAX_DATA_POINTS
						? newDataPoints.slice(newDataPoints.length - MAX_DATA_POINTS)
						: newDataPoints;
				});

				// Generate alerts based on conditions
				const newAlerts = [];
				if (newData.wind_speed > 30) newAlerts.push("High wind speed detected");
				if (newData.temperature > 40)
					newAlerts.push("High temperature warning");
				if (newData.snow) newAlerts.push("Snow detected");
				if (newData.rain_detected) newAlerts.push("Rain detected");

				if (newAlerts.length > 0) {
					setAlertLogs((prev) => [...newAlerts, ...prev.slice(0, 2)]);
				}
			} catch (e) {
				console.error("Error processing sensor data:", e);
			}
		}
	);

	// Request initial data when WebSocket connects
	useEffect(() => {
		if (wsConnected && stompClient) {
			// Request initial data
			stompClient.publish({
				destination: "/app/request-initial-data",
				body: JSON.stringify({ type: "INITIAL_DATA_REQUEST" })
			});
		}
	}, [wsConnected, stompClient]);

	// Update connection status
	useEffect(() => {
		setConnected(wsConnected);
	}, [wsConnected]);

	// send plant requirements to the mqtt broker
	const sendPlantRequirements = () => {
		if (stompClient && stompClient.connected) {
			stompClient.publish({
				destination: "/app/plant-requirements",
				body: JSON.stringify(plantRequirements),
			});
			setAlertLogs((prev) => [
				"Plant requirements sent to sensor",
				...prev.slice(0, 2),
			]);
		}
	};

	// change controle mode command
	const changeControlMode = (mode) => {
		setControlMode(mode);
		if (stompClient && stompClient.connected) {
			stompClient.publish({
				destination: "/app/control",
				body: JSON.stringify({
					mode,
					targetAngle: null,
					emergencyStop: false,
				}),
			});
		}
	};

	// Send manual angle command when in manual mode
	const sendManualAngle = (angle) => {
		if (stompClient && stompClient.connected) {
			stompClient.publish({
				destination: "/app/control",
				body: JSON.stringify({
					mode: "MANUAL",
					targetAngle: angle,
					emergencyStop: false,
				}),
			});
			setTargetAngle(`${angle}°`);
		}
	};

	// Handle emergency stop
	const handleEmergencyStop = () => {
		if (stompClient && stompClient.connected) {
			stompClient.publish({
				destination: "/app/emergency",
				body: JSON.stringify({
					mode: "SAFETY",
					emergencyStop: true,
					targetAngle: null,
				}),
			});
		}
		setSystemStatus("EMERGENCY");
		setControlMode("SAFETY");

		// Disable all controls
		setSensorData((prev) => ({
			...prev,
			switch_state: 0, // Turn off the system
			pvAngle: 0, // Reset angle to safety position
			radiation: 0, // Reset radiation reading
		}));

		// Clear any active alerts
		setAlertLogs(["SYSTEM SHUTDOWN - Emergency stop activated"]);
	};

	// Helper functions
	const formatValue = (value, fixed = 1) => {
		if (value === undefined || value === null) return "0";
		return typeof value === "number" ? value.toFixed(fixed) : value;
	};

	const getStatusText = (value) => (value ? "Yes" : "No");
	const getStatusClass = (value) => (value ? "warning" : "");
	console.log("Rendering SolarPanel with:", {
		angle: sensorData.pvAngle,
		temp: sensorData.temperature,
	});
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
						<ConnectedIcon
							className={connected ? "connected" : "disconnected"}
						/>
						<span>{connected ? "Connected" : "Disconnected"}</span>
					</div>
				</div>
			</header>

			{/* Main Dashboard Grid */}
			<div className="dashboard-grid">
				{/* System Status Card */}
				<div className="dashboard-card system-status">
					<div className="card-header">
						<h2>
							<PowerIcon /> SYSTEM STATUS
						</h2>
						<div className={`status-badge ${systemStatus.toLowerCase()}`}>
							{systemStatus}
						</div>
					</div>
					<div className="card-content">
						<div className="status-indicators">
							<div className="indicator">
								<span>Current Angle</span>
								<strong>{formatValue(sensorData.pvAngle)}°</strong>
							</div>
							<div className="indicator">
								<span>Current Radiation</span>
								<strong>{formatValue(sensorData.radiation)} W/m²</strong>
							</div>
						</div>
						<div className="solar-panel-visualization">
							<SolarPanel
								temperature={sensorData.temperature}
								pvAngle={sensorData.pvAngle}
								timeOfDay={getCurrentTimeOfDay()}
								efficiency={sensorData.efficiency}
							/>
						</div>
					</div>
				</div>

				{/* Environmental Sensors Card */}
				<div className="dashboard-card environmental-sensors">
					<div className="card-header">
						<h2>
							<SettingsIcon /> ENVIRONMENTAL SENSORS
						</h2>
					</div>
					<div className="card-content">
						<div className="sensor-grid">
							<div className="sensor-item">
								<div className="sensor-icon">
									<WindIcon />
								</div>
								<div className="sensor-info">
									<span>Wind Speed</span>
									<strong>{formatValue(sensorData.wind_speed)} m/s</strong>
								</div>
							</div>
							<div className="sensor-item">
								<div className="sensor-icon">
									<IceIcon />
								</div>
								<div className="sensor-info">
									<span>Ice Detected</span>
									<strong className={getStatusClass(sensorData.snow)}>
										{getStatusText(sensorData.snow)}
									</strong>
								</div>
							</div>
							<div className="sensor-item">
								<div className="sensor-icon">
									<RainIcon />
								</div>
								<div className="sensor-info">
									<span>Rain Detected</span>
									<strong className={getStatusClass(sensorData.rain_detected)}>
										{getStatusText(sensorData.rain_detected)}
									</strong>
								</div>
							</div>
							<div className="sensor-item">
								<div className="sensor-icon">
									<TemperatureIcon />
								</div>
								<div className="sensor-info">
									<span>Temperature</span>
									<strong>{formatValue(sensorData.temperature)}°C</strong>
								</div>
							</div>
							<div className="sensor-item">
								<div className="sensor-icon">
									<RadiationIcon />
								</div>
								<div className="sensor-info">
									<span>Radiation</span>
									<strong>{formatValue(sensorData.radiation)} W/m²</strong>
								</div>
							</div>
							<div className="sensor-item">
								<div className="sensor-icon">
									<HumidityIcon />
								</div>
								<div className="sensor-info">
									<span>Humidity</span>
									<strong>{formatValue(sensorData.humidity)}%</strong>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tracker Control Card */}
				{isAdmin && (
					<div className="dashboard-card tracker-control">
						<div className="card-header">
							<h2>
								<SettingsIcon /> TRACKER CONTROL
							</h2>
						</div>
						<div className="card-content">
							<div className="control-modes">
								<button
									className={`control-button ${
										controlMode === "MANUAL" ? "active" : ""
									}`}
									onClick={() => changeControlMode("MANUAL")}
									disabled={systemStatus === "EMERGENCY"}
								>
									<ManualIcon /> MANUAL MODE
								</button>
								<button
									className={`control-button ${
										controlMode === "SAFETY" ? "active" : ""
									}`}
									onClick={() => changeControlMode("SAFETY")}
									disabled={systemStatus === "EMERGENCY"}
								>
									<SafetyIcon /> SAFETY MODE
								</button>
								<button
									className={`control-button ${
										controlMode === "AUTOTRACK" ? "active" : ""
									}`}
									onClick={() => changeControlMode("AUTOTRACK")}
									disabled={systemStatus === "EMERGENCY"}
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
									<strong
										className={
											limitSwitchState === "Triggered" ? "warning" : ""
										}
									>
										{limitSwitchState}
									</strong>
								</div>
							</div>
							{controlMode === "MANUAL" && (
								<div className="manual-control">
									<div className="angle-control">
										<label>Set Panel Angle (0-180°)</label>
										<div className="angle-input-group">
											<input
												type="range"
												min="0"
												max="180"
												value={manualAngle}
												onChange={(e) => setManualAngle(Number(e.target.value))}
												className="angle-slider"
											/>
											<div className="angle-input-value">
												<input
													type="number"
													min="0"
													max="180"
													value={manualAngle}
													onChange={(e) =>
														setManualAngle(
															Math.min(180, Math.max(0, Number(e.target.value)))
														)
													}
													className="angle-number-input"
												/>
												<span>°</span>
											</div>
											<button
												onClick={() => sendManualAngle(manualAngle)}
												className="angle-apply-button"
											>
												Apply
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Performance Charts Card */}
				<div className="dashboard-card performance-charts">
					<div className="card-header">
						<h2>
							<SettingsIcon /> PERFORMANCE METRICS
						</h2>
					</div>
					<div className="card-content">
						<div className="chart-container">
							<h3>Panel Angle Over Time</h3>
							<ResponsiveContainer width="100%" height={200}>
								<LineChart data={angleData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
									<XAxis dataKey="time" />
									<YAxis domain={[0, 180]} />
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
						<h2>
							<SunIcon /> PLANT REQUIREMENTS
						</h2>
					</div>
					<div className="card-content">
						<div className="requirement-item">
							<label>Sun Rays Period</label>
							{isAdmin ? (
								<select
									value={plantRequirements.sunRays}
									onChange={(e) =>
										setPlantRequirements({
											...plantRequirements,
											sunRays: e.target.value,
										})
									}
									className="time-select"
								>
									<option value="Morning">Morning</option>
									<option value="Afternoon">Afternoon</option>
									<option value="Evening">Evening</option>
								</select>
							) : (
								<div className="read-only-value">
									{plantRequirements.sunRays}
								</div>
							)}
						</div>
						<div className="requirement-item">
							<label>Shading: {plantRequirements.shading}%</label>
							{isAdmin ? (
								<input
									type="range"
									min="0"
									max="100"
									value={plantRequirements.shading}
									onChange={(e) =>
										setPlantRequirements({
											...plantRequirements,
											shading: parseInt(e.target.value),
										})
									}
									className="shading-slider"
								/>
							) : (
								<div className="read-only-slider">
									<div
										className="slider-track"
										style={{ width: `${plantRequirements.shading}%` }}
									></div>
								</div>
							)}
						</div>
						<div className="requirement-item">
							<label>Night Frost Protection</label>
							{isAdmin ? (
								<div className="protection-toggle">
									<button
										className={`toggle-button ${
											plantRequirements.nightFrostProtection ? "active" : ""
										}`}
										onClick={() =>
											setPlantRequirements({
												...plantRequirements,
												nightFrostProtection: true,
											})
										}
									>
										Yes
									</button>
									<button
										className={`toggle-button ${
											!plantRequirements.nightFrostProtection ? "active" : ""
										}`}
										onClick={() =>
											setPlantRequirements({
												...plantRequirements,
												nightFrostProtection: false,
											})
										}
									>
										No
									</button>
								</div>
							) : (
								<div className="read-only-value">
									{plantRequirements.nightFrostProtection ? "Yes" : "No"}
								</div>
							)}
						</div>
						{isAdmin && (
							<button
								className="send-button"
								onClick={sendPlantRequirements}
								disabled={!connected}
							>
								<SettingsIcon /> SEND TO SENSOR
							</button>
						)}
					</div>
				</div>

				{/* Alert Logs Card */}
				<div className="dashboard-card alert-logs">
					<div className="card-header">
						<h2>
							<AlertIcon /> ALERT LOGS
						</h2>
					</div>
					<div className="card-content">
						<ul className="alert-list">
							{alertLogs.length > 0 ? (
								alertLogs.map((alert, index) => (
									<li key={index} className="alert-item">
										<span className="alert-icon">
											<AlertIcon />
										</span>
										<span className="alert-message">{alert}</span>
										<span className="alert-time">
											{new Date().toTimeString().slice(0, 5)}
										</span>
									</li>
								))
							) : (
								<li className="alert-item">
									<span className="alert-message">No alerts</span>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>

			{/* Emergency Stop Button */}
			{isAdmin && (
				<div className="emergency-stop">
					<button
						className="emergency-stop-button"
						onClick={handleEmergencyStop}
					>
						<EmergencyStopIcon /> EMERGENCY STOP
					</button>
				</div>
			)}
		</div>
	);
}

export default MonitoringDashboard;
