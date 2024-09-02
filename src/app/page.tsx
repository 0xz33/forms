import React from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <SuperSphere width="100%" height="100vh" vertices={24} speed={.22} /> */}
      <SuperSphere width="320px" height="320px" vertices={18} speed={.88} />
    </div>
  )
}