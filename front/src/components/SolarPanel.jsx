import React, { useEffect, useRef } from "react";
import "./SolarPanel.css";

const SolarPanel = ({ efficiency, temperature, rotationAngle }) => {
    const panelRef = useRef(null);
    const efficiencyRef = useRef(null);

    useEffect(() => {
        if (panelRef.current) {
            panelRef.current.style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
        }
        if (efficiencyRef.current) {
            efficiencyRef.current.style.width = `${efficiency}%`;
        }
    }, [rotationAngle, efficiency]);

    return (
        <div className="solar-panel-container">
            <div className="panel-mount">
                {/* Mounting Pole */}
                <div className="mounting-pole">
                    <div className="pole-shadow"></div>
                </div>

                {/* Pole Top Bracket */}
                <div className="pole-top">
                    <div className="bracket"></div>
                </div>

                {/* Solar Panel */}
                <div ref={panelRef} className="solar-panel">
                    <div className="panel-cells">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="panel-cell" />
                        ))}
                    </div>
                    <div className="panel-frame">
                        <div className="frame-corner tl"></div>
                        <div className="frame-corner tr"></div>
                        <div className="frame-corner bl"></div>
                        <div className="frame-corner br"></div>
                    </div>
                </div>
            </div>

            <div className="panel-data">
                <div className="efficiency-meter">
                    <div className="efficiency-label">Efficiency</div>
                    <div className="efficiency-bar">
                        <div ref={efficiencyRef} className="efficiency-fill"></div>
                        <span className="efficiency-value">{efficiency.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="temperature-display">
                    <div className="temp-icon">🌡️</div>
                    <div className="temp-value">{temperature.toFixed(1)}°C</div>
                </div>
            </div>
        </div>
    );
};

export default SolarPanel;