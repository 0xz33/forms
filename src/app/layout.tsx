'use client'
import "./globals.css";
import React from 'react';
import ControlPanel from '../components/ControlPanel';
import TextureControlPanel from '../components/TextureControlPanel';
import { ConfigProvider } from '../contexts/ConfigContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <div style={{ position: 'relative' }}>
            {children}
            <ControlPanel />
            <TextureControlPanel />
          </div>
        </ConfigProvider>
      </body>
    </html>
  )
}

