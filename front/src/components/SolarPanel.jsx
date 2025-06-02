import React, { useEffect, useRef } from "react";
import "./SolarPanel.css";

const SolarPanel = ({ pvAngle = 0, temperature = 0, timeOfDay = 0.5 }) => {
    const panelRef = useRef(null);
    const sunRef = useRef(null);

    useEffect(() => {
        if (panelRef.current) {
            const angle = typeof pvAngle === 'number' ? pvAngle : 0;
            panelRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }
    }, [pvAngle]);

    useEffect(() => {
        if (sunRef.current) {
            const x = timeOfDay * 100;
            const y = 50 + (Math.sin(timeOfDay * Math.PI) * 50);
            
            sunRef.current.style.left = `${Math.min(90, Math.max(10, x))}%`;
            sunRef.current.style.top = `${Math.min(80, Math.max(20, y))}%`;
            
            if (timeOfDay < 0.25 || timeOfDay > 0.75) {
                sunRef.current.style.background = '#f39c12';
                sunRef.current.style.boxShadow = '0 0 30px #e74c3c';
            } else {
                sunRef.current.style.background = '#f1c40f';
                sunRef.current.style.boxShadow = '0 0 50px #f39c12';
            }
        }
    }, [timeOfDay]);

    return (
        <div className="solar-panel-container">
            <div className="sky-container">
                <div 
                    ref={sunRef} 
                    className="sun"
                    style={{
                        left: '50%',
                        top: '100%'
                    }}
                />
                <div className="horizon" />
            </div>
            
            <div className="panel-mount">
                <div className="mounting-pole">
                    <div className="pole-shadow"></div>
                </div>
                <div className="panel-connection"></div>
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
        </div>
    );
};

export default SolarPanel;