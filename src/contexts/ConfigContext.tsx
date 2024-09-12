import React, { createContext, useState, useCallback } from 'react';
import sphereConfigs from '../configs/sphereConfigs';
import { Config } from '../types/Config';

// Define the Config type if not already defined
type ConfigContextType = {
    config: Config;
    allConfigs: { [key: string]: Config };
    setConfig: (newConfig: Partial<Config>) => void;
    setConfigByName: (configName: string) => void;
};

export const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfigState] = useState<Config>({
        ...sphereConfigs.default,
        texture: 'default'
    });

    const setConfig = useCallback((newConfig: Partial<Config>) => {
        setConfigState(prevConfig => ({ ...prevConfig, ...newConfig }));
    }, []);

    const setConfigByName = useCallback((configName: string) => {
        if (configName in sphereConfigs) {
            setConfigState(prevConfig => ({
                ...sphereConfigs[configName as keyof typeof sphereConfigs],
                texture: prevConfig.texture // Preserve the current texture
            }));
        }
    }, []);

    return (
        <ConfigContext.Provider value={{ config, allConfigs: sphereConfigs, setConfig, setConfigByName }}>
            {children}
        </ConfigContext.Provider>
    );
};