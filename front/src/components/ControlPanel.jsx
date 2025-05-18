import React, { useState } from "react";

const ControlPanel = ({ stompClient, connected }) => {
    const [command, setCommand] = useState("");
    const [panelId, setPanelId] = useState("panel-1");
    const [message, setMessage] = useState("");

    const sendCommand = () => {
        if (!connected || !stompClient) {
            setMessage("Not connected to WebSocket");
            return;
        }

        const payload = {
            panelId,
            command,
            timestamp: new Date().toISOString(),
        };

        stompClient.publish({
            destination: "/app/sensor-data",
            body: JSON.stringify(payload),
            headers: { "content-type": "application/json" },
        });

        setMessage(`Command "${command}" sent to ${panelId}`);
        setCommand("");
    };

    return (
        <div className="control-panel">
            <h3>Control Panel</h3>
            <div className="form-group">
                <label htmlFor="panelId">Panel ID:</label>
                <select
                    id="panelId"
                    value={panelId}
                    onChange={(e) => setPanelId(e.target.value)}
                >
                    <option value="panel-1" selected>Panel 1</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="command">Command:</label>
                <input
                    type="text"
                    id="command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="e.g., turn_off, reset, etc."
                />
            </div>
            <button onClick={sendCommand} disabled={!connected}>
                Send Command
            </button>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ControlPanel;