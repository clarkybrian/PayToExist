'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface Payment {
  id: string
  city: string
  country: string
  latitude: number
  longitude: number
  created_at: string
}

interface EarthProps {
  payments: Payment[]
  onLocationClick: (lat: number, lng: number) => void
}

function Earth({ payments, onLocationClick }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Charger la vraie texture satellite de la Terre
  const earthTexture = useLoader(THREE.TextureLoader, '/earth-texture.jpg')

  // Rotation automatique lente
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  // Convertir lat/lng en coordonnées 3D sur la sphère
  const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }

  const handleClick = (event: any) => {
    event.stopPropagation()
    
    // Simuler un clic aléatoire sur la sphère pour la démo
    const randomLat = (Math.random() - 0.5) * 180
    const randomLng = (Math.random() - 0.5) * 360
    onLocationClick(randomLat, randomLng)
  }

  return (
    <group>
      {/* Sphère principale (Terre) */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Points rouges pour les paiements */}
      {payments.map((payment, index) => {
        if (!payment.latitude || !payment.longitude) return null
        
        const position = latLngToVector3(payment.latitude, payment.longitude, 2.05)
        
        return (
          <mesh key={payment.id || index} position={position}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
        )
      })}
    </group>
  )
}

interface WorldSphereProps {
  payments: Payment[]
  onLocationClick: (lat: number, lng: number) => void
}

function LoadingEarth() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#1e40af" />
    </mesh>
  )
}

export default function WorldSphere({ payments, onLocationClick }: WorldSphereProps) {
  return (
    <div className="w-full h-96 bg-white">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'white' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={<LoadingEarth />}>
          <Earth payments={payments} onLocationClick={onLocationClick} />
        </Suspense>
      </Canvas>
    </div>
  )
}
