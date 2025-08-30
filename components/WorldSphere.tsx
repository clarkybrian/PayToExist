'use client'

import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
  
  // Charger la vraie texture satellite de la Terre avec luminosité augmentée
  const earthTexture = useLoader(THREE.TextureLoader, '/earth-texture.jpg')
  
  // Appliquer des effets de luminosité améliorée et éclaircir la texture
  useEffect(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace
      earthTexture.anisotropy = 16
      
      // Créer un canvas pour éclaircir significativement la texture
      const image = earthTexture.image;
      if (image) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Dessiner l'image sur le canvas
          ctx.drawImage(image, 0, 0);
          
          // Récupérer les données de l'image
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Traitement de l'image pour un aspect plus réaliste comme la référence
          for (let i = 0; i < data.length; i += 4) {
            // Équilibrer les canaux pour réduire la dominante bleue
            data[i] = Math.min(255, data[i] * 1.5);      // Rouge (augmenté)
            data[i + 1] = Math.min(255, data[i + 1] * 1.6);  // Vert (augmenté davantage)
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);  // Bleu (réduit)
            
            // Améliorer le contraste pour faire ressortir les continents
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Zones sombres (océans)
            if (avg < 85) {
              // Assombrir davantage les océans pour augmenter le contraste
              const oceanBlue = 0.85; // Facteur de conservation du bleu
              data[i] *= 0.45;        // Réduire encore plus le rouge
              data[i + 1] *= 0.6;     // Réduire le vert davantage
              data[i + 2] *= oceanBlue; // Conserver plus de bleu
              
              // Équilibrer pour un bleu d'océan réaliste
              if (data[i + 2] < 100) {
                data[i + 2] = Math.min(255, data[i + 2] + 40);
              }
            }
            
            // Zones claires (continents)
            if (avg > 120) {
              // Traiter les continents pour les rendre plus naturels
              // Ajouter des tons bruns/verts en augmentant le rouge et le vert
              data[i] = Math.min(255, data[i] * 1.3);      // Rouge pour les tons bruns
              data[i + 1] = Math.min(255, data[i + 1] * 1.4); // Vert pour la végétation
              data[i + 2] = Math.min(255, data[i + 2] * 0.85); // Réduire le bleu
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Remplacer la texture
          const newTexture = new THREE.Texture(canvas);
          newTexture.needsUpdate = true;
          newTexture.colorSpace = THREE.SRGBColorSpace;
          newTexture.anisotropy = 16;
          
          // Copier les propriétés de l'ancienne texture
          Object.assign(earthTexture, newTexture);
        }
      }
    }
  }, [earthTexture])

  // Rotation automatique lente (désactivée quand les contrôles d'orbite sont actifs)
  const autoRotate = useRef(true);
  
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })
  
  // Désactiver la rotation automatique lorsque l'utilisateur interagit avec la sphère
  useEffect(() => {
    const handlePointerDown = () => {
      autoRotate.current = false;
    };
    
    const handlePointerUp = () => {
      // Réactiver la rotation automatique après 5 secondes d'inactivité
      setTimeout(() => {
        autoRotate.current = true;
      }, 5000);
    };
    
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [])

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
          roughness={0.5}
          metalness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.1}
          color="#f0f0f0"
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
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function WorldSphere({ payments, onLocationClick }: WorldSphereProps) {
  return (
    <div className="w-full h-full bg-white">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'white' }}
      >
        {/* Lumière ambiante neutre pour un éclairage général */}
        <ambientLight intensity={1.2} color="#ffffff" />
        
        {/* Lumière directionnelle frontale pour simuler le soleil */}
        <directionalLight position={[0, 0, 5]} intensity={2.0} color="#fffaf0" />
        
        {/* Lumière hémisphérique naturelle pour simuler l'atmosphère */}
        <hemisphereLight color="#87ceeb" groundColor="#f5f5dc" intensity={0.7} />
        <Suspense fallback={<LoadingEarth />}>
          <Earth payments={payments} onLocationClick={onLocationClick} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            enableRotate={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={3.5}
            maxDistance={8}
            dampingFactor={0.1}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
