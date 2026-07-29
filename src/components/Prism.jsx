import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Build geometry by phase ──────────────────────────────────
function buildGeo(phase) {
  switch (phase) {
    case 0: {
      const g = new THREE.CylinderGeometry(0.9, 0.9, 2.0, 3, 1)
      g.rotateY(Math.PI / 6)
      return g
    }
    case 1: return new THREE.OctahedronGeometry(1.1, 0)
    case 2: return new THREE.IcosahedronGeometry(1.0, 0)
    case 3: return new THREE.DodecahedronGeometry(0.95, 0)
    case 4: return new THREE.TetrahedronGeometry(1.2, 0)
    case 5: {
      const g = new THREE.BoxGeometry(1.2, 1.2, 1.2)
      // Rotate the cube so it stands on a corner, making it look dynamic
      g.rotateX(Math.PI / 4)
      g.rotateZ(Math.PI / 4)
      return g
    }
    default: {
      const g = new THREE.CylinderGeometry(0.9, 0.9, 2.0, 3, 1)
      g.rotateY(Math.PI / 6)
      return g
    }
  }
}

// ─── Spectrum rim glow — BackSide shell ───────────────────────
const rimVert = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.06, 1.0);
  }
`
const rimFrag = `
  uniform float uTime;
  varying vec3  vNormal;
  varying vec3  vViewDir;

  vec3 spectrum(float t) {
    t = fract(t);
    float r = smoothstep(0.0,0.33,t) - smoothstep(0.66,1.0,t);
    float g = smoothstep(0.0,0.33,t-0.33) - smoothstep(0.0,0.33,t-0.66);
    float b = smoothstep(0.33,0.66,t);
    return clamp(vec3(r,g,b), 0.0, 1.0);
  }

  void main() {
    float rim   = 1.0 - max(dot(vViewDir, vNormal), 0.0);
    rim         = pow(rim, 2.2);
    // User requested solid white borders instead of rainbow
    vec3  col   = vec3(1.0, 1.0, 1.0); 
    float alpha = rim * 0.80;
    gl_FragColor = vec4(col * 2.0, alpha);
  }
`

// ─── Main Prism Component ─────────────────────────────────────
export default function Prism({ phaseRef }) {
  const groupRef   = useRef()
  const scaleGroupRef = useRef() // Controls the scale during transition
  const rimMatRef  = useRef()

  // Transition state
  const transitionRef = useRef({
    state: 'IDLE', // IDLE -> SHRINK -> GROW -> IDLE
    progress: 1,
    nextPhase: 0,
  })

  // Current displayed geometry
  const [geo, setGeo] = useState(() => buildGeo(0))

  const rimUniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    // 1. Check if the user scrolled to a new section (polls the ref!)
    const targetPhase = phaseRef.current;
    const t = transitionRef.current
    if (targetPhase !== t.nextPhase && t.state === 'IDLE') {
      t.nextPhase = targetPhase
      t.state = 'SHRINK'
      t.progress = 1.0
    } else if (targetPhase !== t.nextPhase) {
      // If already transitioning, just update the target
      t.nextPhase = targetPhase
    }

    // 2. Rim animation
    if (rimMatRef.current) {
      rimMatRef.current.uniforms.uTime.value = time
    }

    // 3. Idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0035
      groupRef.current.rotation.x = Math.sin(time * 0.18) * 0.05
    }

    // 4. Handle Scale Transition (Shrink -> Swap -> Grow)
    if (t.state === 'SHRINK') {
      t.progress -= 0.06 // Speed of shrink
      if (t.progress <= 0) {
        t.progress = 0
        t.state = 'GROW'
        setGeo(buildGeo(t.nextPhase)) // Swap geometry at size 0
      }
    } else if (t.state === 'GROW') {
      t.progress += 0.05 // Speed of grow
      if (t.progress >= 1.0) {
        t.progress = 1.0
        t.state = 'IDLE'
      }
    }

    // 5. Apply scale with easing
    if (scaleGroupRef.current) {
      // easeOutBack-like elastic effect for growing, easeIn for shrinking
      let scale = t.progress
      if (t.state === 'GROW') {
        const p = t.progress - 1
        scale = 1 + p * p * p // easeOutCubic
      } else if (t.state === 'SHRINK') {
        scale = t.progress * t.progress * t.progress // easeInCubic
      }
      scaleGroupRef.current.scale.set(scale, scale, scale)
      
      // Add intense spinning during transition
      if (t.state !== 'IDLE') {
        groupRef.current.rotation.y += 0.05
        groupRef.current.rotation.x += 0.02
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={scaleGroupRef}>
        {/* White rim glow */}
        <mesh geometry={geo}>
          <shaderMaterial
            ref={rimMatRef}
            vertexShader={rimVert}
            fragmentShader={rimFrag}
            uniforms={rimUniforms}
            transparent
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Real glass prism - using MeshTransmissionMaterial for realistic refraction */}
        <mesh geometry={geo}>
          <MeshTransmissionMaterial
            backside={true}
            samples={4}
            thickness={2.0}
            chromaticAberration={0.06}
            anisotropy={0.3}
            roughness={0.05}
            ior={1.65}
            color="#c8dcff"
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}
