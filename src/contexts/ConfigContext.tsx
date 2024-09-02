import React, { createContext, useState } from 'react';
import sphereConfigs from '../configs/sphereConfigs';

export const ConfigContext = createContext<any>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState(sphereConfigs.default);
    const [allConfigs] = useState(sphereConfigs);

    const setConfigByName = (configName: string) => {
        setConfig(sphereConfigs[configName as keyof typeof sphereConfigs]);
    };

    return (
        <ConfigContext.Provider value={{ config, allConfigs, setConfig, setConfigByName }}>
            {children}
        </ConfigContext.Provider>
    );
};