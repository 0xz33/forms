import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';
import { Config } from '../types/Config';

const ControlPanel = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { config, allConfigs, setConfig, setConfigByName } = useContext(ConfigContext);
    const colorInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatNumber = (num: number | string) => {
        if (typeof num === 'number') {
            return num === 0 ? '' : num.toString();
        }
        return num === '0' ? '' : num;
    };

    const handleInputChange = useCallback((key: keyof Config, value: string) => {
        if (value === '') {
            setConfig({ [key]: 0 });
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setConfig({ [key]: numValue });
            }
        }
    }, [setConfig]);

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ color: e.target.value });
    }, [setConfig]);

    const buttonStyle = {
        background: isOpen ? 'white' : 'none',
        color: isOpen ? 'black' : 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 16px',
        fontSize: '12px',
        borderRadius: '5px',
        position: 'fixed' as const,
        zIndex: 1001,
        ...(isMobile
            ? { bottom: '10px', right: '10px', width: 'auto' }
            : { top: '10px', right: '10px', width: '200px' }),
    };

    const panelStyle = {
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        width: isMobile ? '100%' : '200px',
        position: 'fixed' as const,
        zIndex: 1000,
        ...(isMobile
            ? { bottom: isOpen ? '0' : '-100%', left: '0', transition: 'bottom 0.3s' }
            : { top: '50px', right: '10px' }),
    };

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
    };

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} style={buttonStyle}>
                {isOpen ? '▲ Hide Controls' : '▼ Show Controls'}
            </button>
            {isOpen && (
                <div style={panelStyle}>
                    <div style={{ marginTop: '8px' }}>
                        <ControlItem label="Vertices:">
                            <input
                                type="number"
                                value={formatNumber(config.vertices)}
                                onChange={(e) => handleInputChange('vertices', e.target.value)}
                                style={commonStyle}
                            />
                        </ControlItem>

                        <ControlItem label="Speed:">
                            <input
                                type="number"
                                value={formatNumber(config.speed)}
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
                                value={formatNumber(config.noiseFrequency)}
                                onChange={(e) => handleInputChange('noiseFrequency', e.target.value)}
                                style={commonStyle}
                                step="0.01"
                            />
                        </ControlItem>

                        <ControlItem label="Noise Amplitude:">
                            <input
                                type="number"
                                value={formatNumber(config.noiseAmplitude)}
                                onChange={(e) => handleInputChange('noiseAmplitude', e.target.value)}
                                style={commonStyle}
                                step="0.01"
                            />
                        </ControlItem>

                        <ControlItem label="Rotation Speed:">
                            <input
                                type="number"
                                value={formatNumber(config.rotationSpeed)}
                                onChange={(e) => handleInputChange('rotationSpeed', e.target.value)}
                                style={commonStyle}
                                step="0.01"
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

                        {isMobile && (
                            <button onClick={() => setIsOpen(false)} style={{ ...buttonStyle, position: 'static', marginTop: '16px' }}>
                                ▲ Hide Controls
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
});

interface ControlItemProps {
    label: string;
    children: React.ReactNode;
}

const ControlItem = React.memo(({ label, children }: ControlItemProps) => (
    <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
        {children}
    </div>
));

export default ControlPanel;