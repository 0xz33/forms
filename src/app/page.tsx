import React from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'

export default function Home() {

  // color for SuperSphere: primary-400: #B2ACD2

  return (
    <div className={styles.container}>
      {/* full */}
      <SuperSphere width="100%" height="100vh" vertices={32} speed={.22} color="#B2ACD2" />

      {/* medium */}
      {/* <SuperSphere width="320px" height="320px" vertices={18} speed={.88} color="#B2ACD2" /> */}

      {/* small */}
      {/* <SuperSphere width="88px" height="88px" vertices={8} speed={.11} color="#B2ACD2" /> */}

      {/* x small */}
      {/* <SuperSphere width="56px" height="56px" vertices={6} speed={1.11} color="#B2ACD2" /> */}

      {/* 2x small */}
      {/* <SuperSphere width="24px" height="24px" vertices={4} speed={.88} color="#B2ACD2" /> */}
    </div>
  )
}