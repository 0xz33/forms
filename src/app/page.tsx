import React from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* full */}
      {/* <SuperSphere width="100%" height="100vh" vertices={24} speed={.22} /> */}

      {/* medium */}
      {/* <SuperSphere width="320px" height="320px" vertices={18} speed={.88} /> */}

      {/* small */}
      {/* <SuperSphere width="88px" height="88px" vertices={8} speed={.11} /> */}

      {/* x small */}
      <SuperSphere width="56px" height="56px" vertices={6} speed={1.11} />

      {/* 2x small */}
      {/* <SuperSphere width="24px" height="24px" vertices={4} speed={.88} /> */}
    </div>
  )
}