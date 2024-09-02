'use client'
import "./globals.css";
import React from 'react';
import ControlPanel from '../components/ControlPanel';
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
          </div>
        </ConfigProvider>
      </body>
    </html>
  )
}

