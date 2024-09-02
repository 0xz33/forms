import React from 'react'
import SuperSphere from '../components/SuperSphere'
import styles from './page.module.css'

export default function Home() {

  // color for SuperSphere: primary-400: #B2ACD2

  return (
    <div className={styles.container}>
      {/* full */}
      <SuperSphere
        width="100%"
        height="100vh"
        vertices={64}
        speed={1}
        color="#B2ACD2"
        noiseFrequency={.88}
        noiseAmplitude={.8}
        rotationSpeed={1} // Added rotation speed
      />

      {/* medium */}
      {/* <SuperSphere 
        width="320px" 
        height="320px" 
        vertices={18} 
        speed={0.88} 
        color="#B2ACD2" 
        noiseFrequency={2} 
        noiseAmplitude={0.3}
        rotationSpeed={1} 
      /> */}

      {/* small */}
      {/* <SuperSphere 
        width="88px" 
        height="88px" 
        vertices={8} 
        speed={0.55} 
        color="#B2ACD2" 
        noiseFrequency={3} 
        noiseAmplitude={0.2}
        rotationSpeed={1.5}
      /> */}
    </div>
  )
}