import React, { useEffect, useRef } from "react";
import "./SolarPanel.css";

const SolarPanel = ({ pvAngle = 0, temperature = 0 }) => {
    //   console.log("SolarPanel rendered with:", { pvAngle, temperature });

    const panelRef = useRef(null);

    // Safe value formatting
    const formatValue = (value, fixed = 1) => {
        if (value === undefined || value === null) return "0";
        return typeof value === 'number' ? value.toFixed(fixed) : value;
    };

    useEffect(() => {
         if (panelRef.current) {
            const angle = typeof pvAngle === 'number' ? pvAngle : 0;
            panelRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }
    }, [pvAngle]);

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
                <div className="temperature-display">
                    <div className="temp-icon">🌡️</div>
                    <div className="temp-value">{formatValue(temperature)}°C</div>
                </div>
                <div className="panel-angle-display">
                    <div className="angle-icon">📐</div>
                    <div className="angle-value">{formatValue(pvAngle)}°</div>
                </div>
            </div>
        </div>
    );
};

export default SolarPanel;