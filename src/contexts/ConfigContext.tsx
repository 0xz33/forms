import React, { createContext, useState, useCallback } from 'react';
import sphereConfigs from '../configs/sphereConfigs';

// Define the Config type if not already defined
type Config = {
    vertices: number;
    speed: number;
    color: string;
    noiseFrequency: number;
    noiseAmplitude: number;
    rotationSpeed: number;
};

// Use the default config from sphereConfigs as the initial configuration
const initialConfig: Config = sphereConfigs.default;

// Define the ConfigContextType
type ConfigContextType = {
    config: Config;
    allConfigs: { [key: string]: Config };
    setConfig: (newConfig: Partial<Config>) => void;
    setConfigByName: (configName: string) => void;
};

export const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfigState] = useState<Config>(initialConfig);

    const setConfig = useCallback((newConfig: Partial<Config>) => {
        setConfigState(prevConfig => ({ ...prevConfig, ...newConfig }));
    }, []);

    const setConfigByName = useCallback((configName: string) => {
        if (configName in sphereConfigs) {
            setConfigState(sphereConfigs[configName]);
        }
    }, []);

    return (
        <ConfigContext.Provider value={{ config, allConfigs: sphereConfigs, setConfig, setConfigByName }}>
            {children}
        </ConfigContext.Provider>
    );
};