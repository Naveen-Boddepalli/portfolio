import { useRef, Suspense, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Prism from './Prism'
import SpectralBeams, { DustParticles } from './SpectralBeams'
import { PRISM_PHASES } from '../data/portfolio'

// A small component to smoothly interpolate light color on scroll
// without re-rendering the whole scene.
function DynamicLight({ phaseRef }) {
  const lightRef = useRef()
  
  useFrame(() => {
    if (!lightRef.current) return
    const phase = PRISM_PHASES[phaseRef.current] || PRISM_PHASES[0]
    // Smoothly transition the light color
    lightRef.current.color.lerp(new THREE.Color(phase.color), 0.05)
  })
  
  return <directionalLight ref={lightRef} position={[-5, -3, 2]} intensity={0.3} color={PRISM_PHASES[0].color} />
}

// Rig that smoothly slides the Prism and Beams left/right depending on the text section
function AnimatedRig({ phaseRef, mouseYRef }) {
  const rigRef = useRef()
  
  useFrame(() => {
    if (!rigRef.current) return
    const phase = phaseRef.current
    // Default position is 1.2 (Right side)
    let targetX = 1.2
    
    // If phase is About(1) or OpenSource(3), text is on the right, so move Prism to the Left
    if (phase === 1 || phase === 3) targetX = -1.2
    
    // If Contact(5), center it
    if (phase === 5) targetX = 0

    // Smoothly animate to targetX
    rigRef.current.position.x += (targetX - rigRef.current.position.x) * 0.05
  })

  return (
    <group ref={rigRef}>
      <SpectralBeams />
      <Prism phaseRef={phaseRef} />
    </group>
  )
}

const Scene = memo(function Scene({ phaseRef, mouseYRef }) {
  // We NO LONGER read currentPhase from props to avoid React Canvas re-renders!
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
      style={{ background: '#000000' }}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.5} />
      </Suspense>

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 8, 4]}   intensity={0.7} color="#ffffff" />
      
      {/* Decoupled light color animation */}
      <DynamicLight phaseRef={phaseRef} />
      
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#64D2FF" distance={14} />

      {/* Star field */}
      <Stars radius={90} depth={50} count={1600} factor={2} saturation={0} fade speed={0.15} />

      {/* Dust particles stay static */}
      <DustParticles />

      {/* Animated Rig (slides left/right) */}
      <AnimatedRig phaseRef={phaseRef} mouseYRef={mouseYRef} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.5}
          mipmapBlur
          radius={0.6}
        />
      </EffectComposer>
    </Canvas>
  )
})

export default Scene
