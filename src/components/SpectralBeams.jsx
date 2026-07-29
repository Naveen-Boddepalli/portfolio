import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPECTRUM_COLORS } from '../data/portfolio'

// ─── Shared shader sources ────────────────────────────────────
const laserVert = `
  attribute float aAlong;
  varying   float vAlong;
  void main() {
    vAlong      = aAlong;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const laserFrag = `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlong;
  void main() {
    // Fade in over first 12%, fade out at exactly 0.5 (center of the prism)
    float fade  = smoothstep(0.0, 0.12, vAlong) * smoothstep(0.5, 0.49, vAlong);
    float pulse = 0.82 + 0.18 * sin(uTime * 7.0 + vAlong * 18.0);
    gl_FragColor = vec4(uColor * pulse, fade * uOpacity);
  }
`

const beamFrag = `
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying float vAlong;
  void main() {
    float fade  = (1.0 - vAlong) * smoothstep(0.0, 0.06, vAlong);
    float pulse = 0.72 + 0.28 * sin(uTime * 3.5 - vAlong * 6.0);
    gl_FragColor = vec4(uColor, fade * pulse * uOpacity);
  }
`

// ─── Build a static line geometry along X axis ────────────────
// The GROUP is translated on Y — no geometry mutation needed.
function makeLineGeo(x0, x1, N = 40) {
  const pos  = new Float32Array(N * 3)
  const along = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const t      = i / (N - 1)
    pos[i * 3]   = x0 + (x1 - x0) * t
    pos[i * 3 + 1] = 0   // always 0 — we move the GROUP on Y
    pos[i * 3 + 2] = 0
    along[i]     = t
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aAlong',   new THREE.BufferAttribute(along, 1))
  return g
}

// ─── Build a static angled-line geometry ─────────────────────
function makeAngledGeo(startX, angle, length, N = 50) {
  const pos   = new Float32Array(N * 3)
  const along = new Float32Array(N)
  const dx    = Math.cos(angle)
  const dy    = Math.sin(angle)
  for (let i = 0; i < N; i++) {
    const t        = i / (N - 1)
    pos[i * 3]     = startX + t * length * dx
    pos[i * 3 + 1] = t * length * dy   // relative to group origin
    pos[i * 3 + 2] = 0
    along[i]       = t
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aAlong',   new THREE.BufferAttribute(along, 1))
  return g
}

// ─── White laser beam ─────────────────────────────────────────
function LaserBeam() {
  const geo      = useMemo(() => makeLineGeo(-6.4, 6.4), [])
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Color('#ffffff') },
    uOpacity: { value: 1.0 },
  }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <line geometry={geo}>
      <shaderMaterial
        vertexShader={laserVert}
        fragmentShader={laserFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

// ─── One refracted spectral beam ─────────────────────────────
function SpecBeam({ color, angle, prismX }) {
  const groupRef = useRef()
  const geo      = useMemo(() => makeAngledGeo(prismX, angle, 5.5), [angle, prismX])
  const uniforms = useMemo(() => ({
    uColor:   { value: new THREE.Color(color) },
    uTime:    { value: 0 },
    uOpacity: { value: 0.90 },
  }), [color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t
    if (groupRef.current) {
      // Wavy motion so the rainbow feels alive
      groupRef.current.position.y = Math.sin(t * 2.0 + angle * 10.0) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <line geometry={geo}>
        <shaderMaterial
          vertexShader={laserVert}
          fragmentShader={beamFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  )
}

// ─── Tiny ambient dust particles ─────────────────────────────
const dustVert = `
  attribute float aSize;
  attribute float aPhase;
  uniform   float uTime;
  varying   float vPhase;
  void main() {
    vPhase        = aPhase;
    float wX      = sin(uTime * 0.5 + aPhase        ) * 0.10;
    float wY      = cos(uTime * 0.4 + aPhase * 1.3  ) * 0.08;
    vec4  mvPos   = modelViewMatrix * vec4(position + vec3(wX, wY, 0.0), 1.0);
    // Prevent division by zero which crashes Mac WebGL drivers
    gl_PointSize  = aSize * (260.0 / max(-mvPos.z, 0.01));
    gl_Position   = projectionMatrix * mvPos;
  }
`
const dustFrag = `
  uniform float uTime;
  varying float vPhase;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    float a  = 1.0 - smoothstep(0.15, 0.5, d);
    float p  = 0.25 + 0.2 * sin(uTime * 1.2 + vPhase);
    gl_FragColor = vec4(1.0, 1.0, 1.0, a * p * 0.35);
  }
`

// ─── Main export ──────────────────────────────────────────────
export function DustParticles() {
  const ref    = useRef()
  const matRef = useRef()

  const geo = useMemo(() => {
    const N   = 80
    const pos = new Float32Array(N * 3)
    const sz  = new Float32Array(N)
    const ph  = new Float32Array(N)
    const col = new Float32Array(N * 3)
    const pal = SPECTRUM_COLORS.map(c => new THREE.Color(c))

    for (let i = 0; i < N; i++) {
      pos[i*3]     = (Math.random() - 0.5) * 18
      pos[i*3 + 1] = (Math.random() - 0.5) * 10
      pos[i*3 + 2] = (Math.random() - 0.5) * 4 - 3
      sz[i]  = Math.random() * 0.9 + 0.2   // tiny: 0.2 – 1.1
      ph[i]  = Math.random() * Math.PI * 2
      const c = pal[i % pal.length]
      col[i*3]   = c.r
      col[i*3+1] = c.g
      col[i*3+2] = c.b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSize',    new THREE.BufferAttribute(sz,  1))
    g.setAttribute('aPhase',   new THREE.BufferAttribute(ph,  1))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <points ref={ref} geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={dustVert}
        fragmentShader={dustFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}

// Main export for Beams
export default function SpectralBeams() {
  const beams = useMemo(() => {
    const spread = 0.60
    return SPECTRUM_COLORS.map((color, i) => {
      const t     = i / (SPECTRUM_COLORS.length - 1)
      const angle = (t - 0.5) * spread
      return { color, angle }
    })
  }, [])

  return (
    <group>
      <LaserBeam />
      {beams.map((b, i) => (
        <SpecBeam
          key={i}
          color={b.color}
          angle={b.angle}
          prismX={0.5} // Start beams slightly inside the prism's right edge
        />
      ))}
    </group>
  )
}
