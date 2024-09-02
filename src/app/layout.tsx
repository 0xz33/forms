'use client'
import "./globals.css";
import React, { useState, createContext } from 'react';
import ControlPanel from '../components/ControlPanel';
import sphereConfigs from '../configs/sphereConfigs';

export const ConfigContext = createContext<any>(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useState(sphereConfigs.default);
  const [allConfigs] = useState(sphereConfigs);

  const setConfigByName = (configName: string) => {
    setConfig(sphereConfigs[configName as keyof typeof sphereConfigs]);
  };

  return (
    <html lang="en">
      <body>
        <ConfigContext.Provider value={{ config, allConfigs, setConfig }}>
          <div style={{ position: 'relative' }}>
            {children}
            <ControlPanel
              {...config}
              setVertices={(value) => setConfig({ ...config, vertices: value })}
              setSpeed={(value) => setConfig({ ...config, speed: value })}
              setColor={(value) => setConfig({ ...config, color: value })}
              setNoiseFrequency={(value) => setConfig({ ...config, noiseFrequency: value })}
              setNoiseAmplitude={(value) => setConfig({ ...config, noiseAmplitude: value })}
              setRotationSpeed={(value) => setConfig({ ...config, rotationSpeed: value })}
              setConfig={setConfigByName}
            />
          </div>
        </ConfigContext.Provider>
      </body>
    </html>
  )
}

