import React from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <SuperSphere width="100%" height="100vh" />
    </div>
  )
}