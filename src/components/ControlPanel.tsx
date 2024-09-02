import React, { useState, useContext, useRef, useCallback } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';
import { Config } from '../types/Config'; // Add this import

const ControlPanel = React.memo(() => {
    const [isOpen, setIsOpen] = useState(true);
    const { config, allConfigs, setConfig, setConfigByName } = useContext(ConfigContext);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const commonStyle = {
        background: 'none',
        border: '.5px solid white',
        color: 'white',
        borderColor: '#ffffff77',
        cursor: 'pointer',
        padding: '8px 16px',
        fontSize: '12px',
        width: '100%',
        marginBottom: '8px',
    } as const; // Add 'as const' to fix the type issues

    const handleInputChange = useCallback((key: keyof Config, value: string) => {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            setConfig({ [key]: numValue });
        }
    }, [setConfig]);

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ color: e.target.value });
    }, [setConfig]);

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
            width: '200px',
        }}>
            <button onClick={() => setIsOpen(!isOpen)} style={{
                ...commonStyle,
                border: 'none',
                textAlign: 'left',
                padding: '0',
            }}>
                {isOpen ? '▲ Hide Controls' : '▼ Show Controls'}
            </button>
            {isOpen && (
                <div style={{ marginTop: '8px' }}>
                    <ControlItem label="Vertices:">
                        <input
                            type="number"
                            value={config.vertices}
                            onChange={(e) => handleInputChange('vertices', e.target.value)}
                            style={commonStyle}
                        />
                    </ControlItem>

                    <ControlItem label="Speed:">
                        <input
                            type="number"
                            value={config.speed}
                            onChange={(e) => handleInputChange('speed', e.target.value)}
                            style={commonStyle}
                            step="0.01"
                        />
                    </ControlItem>

                    <ControlItem label="Color:">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                style={{ ...commonStyle, width: 'calc(100% - 30px)' }}
                                value={config.color}
                                onChange={handleColorChange}
                                placeholder="#RRGGBB"
                            />
                            <div
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    marginLeft: '6px',
                                    backgroundColor: config.color,
                                    border: '1px solid white',
                                    cursor: 'pointer',
                                }}
                                onClick={() => colorInputRef.current?.click()}
                            />
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={config.color}
                                onChange={handleColorChange}
                                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                            />
                        </div>
                    </ControlItem>

                    <ControlItem label="Noise Frequency:">
                        <input
                            type="number"
                            value={config.noiseFrequency}
                            onChange={(e) => handleInputChange('noiseFrequency', e.target.value)}
                            style={commonStyle}
                            step="0.11"
                        />
                    </ControlItem>

                    <ControlItem label="Noise Amplitude:">
                        <input
                            type="number"
                            value={config.noiseAmplitude}
                            onChange={(e) => handleInputChange('noiseAmplitude', e.target.value)}
                            style={commonStyle}
                            step="0.11"
                        />
                    </ControlItem>

                    <ControlItem label="Rotation Speed:">
                        <input
                            type="number"
                            value={config.rotationSpeed}
                            onChange={(e) => handleInputChange('rotationSpeed', e.target.value)}
                            style={commonStyle}
                            step="0.11"
                        />
                    </ControlItem>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                        <label style={{ marginBottom: '8px' }}>Preset Configurations:</label>
                        {Object.keys(allConfigs).map((configName) => (
                            <button
                                key={configName}
                                style={commonStyle}
                                onClick={() => setConfigByName(configName)}
                            >
                                {configName}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

interface ControlItemProps {
    label: string;
    children: React.ReactNode;
}

const ControlItem: React.FC<ControlItemProps> = React.memo(({ label, children }) => (
    <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
        {children}
    </div>
));

export default ControlPanel;