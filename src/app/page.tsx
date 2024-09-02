'use client'
import React, { useContext } from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'
import { ConfigContext } from './layout'

export default function Home() {
  const { config } = useContext(ConfigContext);

  return (
    <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SuperSphere
        width="320px"
        height="320px"
        {...config}
      />
    </div>
  )
}