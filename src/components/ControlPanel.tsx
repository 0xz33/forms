import React, { useState, useContext } from 'react';
import { ConfigContext } from '../app/layout';

interface ControlPanelProps {
    vertices: number;
    setVertices: (value: number) => void;
    speed: number;
    setSpeed: (value: number) => void;
    color: string;
    setColor: (value: string) => void;
    noiseFrequency: number;
    setNoiseFrequency: (value: number) => void;
    noiseAmplitude: number;
    setNoiseAmplitude: (value: number) => void;
    rotationSpeed: number;
    setRotationSpeed: (value: number) => void;
    setConfig: (config: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const { allConfigs } = useContext(ConfigContext);

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
                                onClick={() => props.setConfig(configName)}
                            >
                                {configName}
                            </button>
                        ))}
                    </div>
                    <div>
                        Vertices: <input type="number" value={props.vertices} onChange={(e) => props.setVertices(Number(e.target.value))} />
                    </div>
                    <div>
                        Speed: <input type="number" step="0.1" value={props.speed} onChange={(e) => props.setSpeed(Number(e.target.value))} />
                    </div>
                    <div>
                        Color: <input type="color" value={props.color} onChange={(e) => props.setColor(e.target.value)} />
                    </div>
                    <div>
                        Noise Frequency: <input type="number" step="0.1" value={props.noiseFrequency} onChange={(e) => props.setNoiseFrequency(Number(e.target.value))} />
                    </div>
                    <div>
                        Noise Amplitude: <input type="number" step="0.01" value={props.noiseAmplitude} onChange={(e) => props.setNoiseAmplitude(Number(e.target.value))} />
                    </div>
                    <div>
                        Rotation Speed: <input type="number" step="0.1" value={props.rotationSpeed} onChange={(e) => props.setRotationSpeed(Number(e.target.value))} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;