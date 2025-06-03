import React, { useEffect, useRef, useState } from "react";
import "./SolarPanel.css";

const SolarPanel = ({ pvAngle = 0, temperature = 0, timeOfDay = 0.5, efficiency = 0 }) => {
    const panelRef = useRef(null);
    const sunRef = useRef(null);
    const [isOptimalAngle, setIsOptimalAngle] = useState(false);

    // Calculate optimal sun tracking
    const calculateOptimalAngle = (timeOfDay) => {
        // Simulate optimal tracking angle based on sun position
        const sunAngle = (timeOfDay - 0.5) * 90; // -45 to +45 degrees
        return Math.max(-45, Math.min(45, sunAngle));
    };

    useEffect(() => {
        if (panelRef.current) {
            const angle = typeof pvAngle === 'number' ? pvAngle : 0;
            const optimalAngle = calculateOptimalAngle(timeOfDay);
            const angleDifference = Math.abs(angle - optimalAngle);

            if (angleDifference < 15) {
                panelRef.current.classList.add('sun-aligned');
                setIsOptimalAngle(true);
            } else {
                panelRef.current.classList.remove('sun-aligned');
                setIsOptimalAngle(false);
            }

            panelRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }
    }, [pvAngle, timeOfDay]);

    useEffect(() => {
        if (sunRef.current) {
            // Enhanced sun movement with more realistic arc
            const normalizedTime = Math.max(0, Math.min(1, timeOfDay));
            const sunArc = Math.sin(normalizedTime * Math.PI);

            // Horizontal position (10% to 90% of container width)
            const x = 10 + (normalizedTime * 80);

            // Vertical position with realistic sun arc (higher at midday)
            const y = 80 - (sunArc * 60); // From 80% to 20% at peak

            sunRef.current.style.left = `${x}%`;
            sunRef.current.style.top = `${y}%`;

            // Dynamic sun appearance based on time of day
            if (normalizedTime < 0.2 || normalizedTime > 0.8) {
                // Sunrise/sunset colors
                sunRef.current.style.background = 'radial-gradient(circle at 30% 30%, #fff9c4, #f7dc6f, #e74c3c)';
                sunRef.current.style.boxShadow = `
                    0 0 40px rgba(231, 76, 60, 0.8),
                    0 0 80px rgba(231, 76, 60, 0.6),
                    0 0 120px rgba(231, 76, 60, 0.4)
                `;
            } else if (normalizedTime < 0.4 || normalizedTime > 0.6) {
                // Morning/evening colors
                sunRef.current.style.background = 'radial-gradient(circle at 30% 30%, #fff9c4, #f7dc6f, #f39c12)';
                sunRef.current.style.boxShadow = `
                    0 0 50px rgba(247, 220, 111, 0.9),
                    0 0 90px rgba(243, 156, 18, 0.7),
                    0 0 130px rgba(243, 156, 18, 0.5)
                `;
            } else {
                // Midday sun
                sunRef.current.style.background = 'radial-gradient(circle at 30% 30%, #ffffff, #fff9c4, #f1c40f)';
                sunRef.current.style.boxShadow = `
                    0 0 60px rgba(255, 255, 255, 1),
                    0 0 100px rgba(241, 196, 15, 0.8),
                    0 0 140px rgba(241, 196, 15, 0.6)
                `;
            }

            // Adjust sky background based on time of day
            const skyContainer = sunRef.current.parentElement;
            if (skyContainer) {
                let skyGradient;
                if (normalizedTime < 0.2 || normalizedTime > 0.8) {
                    // Dawn/dusk
                    skyGradient = `linear-gradient(
                        to bottom,
                        #2c1810 0%,
                        #8b4513 30%,
                        #ff7f50 60%,
                        #ffd700 85%,
                        #ff6347 100%
                    )`;
                } else if (normalizedTime < 0.4 || normalizedTime > 0.6) {
                    // Morning/evening
                    skyGradient = `linear-gradient(
                        to bottom,
                        #4682b4 0%,
                        #87ceeb 30%,
                        #add8e6 60%,
                        #ffd89b 85%,
                        #87ceeb 100%
                    )`;
                } else {
                    // Midday
                    skyGradient = `linear-gradient(
                        to bottom,
                        #1e3c72 0%,
                        #2a5298 30%,
                        #87ceeb 60%,
                        #e0f6ff 85%,
                        #87ceeb 100%
                    )`;
                }
                skyContainer.style.background = skyGradient;
            }
        }
    }, [timeOfDay]);

    // Generate panel cells with animation delay
    const generatePanelCells = () => {
        return Array.from({ length: 48 }).map((_, i) => (
            <div
                key={i}
                className="panel-cell"
                style={{
                    animationDelay: `${i * 0.05}s`,
                    opacity: isOptimalAngle ? 1 : 0.8
                }}
            />
        ));
    };

    return (
        <div className="solar-panel-container">
            <div className="sky-container">
                <div
                    ref={sunRef}
                    className="sun"
                    style={{
                        left: '50%',
                        top: '80%'
                    }}
                />
                <div className="horizon" />
            </div>

            <div className="panel-mount">
                <div className="mounting-pole"></div>
                <div className="pole-top">
                    <div className="bracket"></div>
                </div>
                <div ref={panelRef} className="solar-panel">
                    <div className="panel-cells">
                        {generatePanelCells()}
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