'use client'
import React, { useContext } from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'
import { ConfigContext } from '../contexts/ConfigContext'

export default function Home() {
  const { config } = useContext(ConfigContext);

  return (
    <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SuperSphere
        width="100%"
        height="100%"
        {...config}
      />
    </div>
  )
}