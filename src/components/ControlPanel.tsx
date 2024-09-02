import React, { useState, useContext } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';

const ControlPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { config, allConfigs, setConfig, setConfigByName } = useContext(ConfigContext);

    const buttonStyle = {
        background: 'none',
        border: '1px solid white',
        color: 'white',
        cursor: 'pointer',
        padding: '5px 10px',
        margin: '5px',
        fontSize: '12px',
    };

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
        }}>
            <button onClick={() => setIsOpen(!isOpen)} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                fontSize: '12px',
            }}>
                {isOpen ? '▲ Hide Controls' : '▼ Show Controls'}
            </button>
            {isOpen && (
                <div style={{ marginTop: '8px' }}>
                    <div>
                        {Object.keys(allConfigs).map((configName) => (
                            <button
                                key={configName}
                                style={buttonStyle}
                                onClick={() => setConfigByName(configName)}
                            >
                                {configName}
                            </button>
                        ))}
                    </div>
                    <div>
                        Vertices: <input type="number" value={config.vertices} onChange={(e) => setConfig({ ...config, vertices: Number(e.target.value) })} />
                    </div>
                    <div>
                        Speed: <input type="number" step="0.1" value={config.speed} onChange={(e) => setConfig({ ...config, speed: Number(e.target.value) })} />
                    </div>
                    <div>
                        Color: <input type="color" value={config.color} onChange={(e) => setConfig({ ...config, color: e.target.value })} />
                    </div>
                    <div>
                        Noise Frequency: <input type="number" step="0.1" value={config.noiseFrequency} onChange={(e) => setConfig({ ...config, noiseFrequency: Number(e.target.value) })} />
                    </div>
                    <div>
                        Noise Amplitude: <input type="number" step="0.01" value={config.noiseAmplitude} onChange={(e) => setConfig({ ...config, noiseAmplitude: Number(e.target.value) })} />
                    </div>
                    <div>
                        Rotation Speed: <input type="number" step="0.1" value={config.rotationSpeed} onChange={(e) => setConfig({ ...config, rotationSpeed: Number(e.target.value) })} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;