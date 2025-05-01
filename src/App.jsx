import React, { useEffect, useRef, useState } from 'react' 
import * as THREE from 'three';
import { AsciiEffect } from 'three-stdlib'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import mqtt from 'mqtt'

// Componente 3D
function SmokeParticles({ count = 1000 }) {
  const ref = useRef()
  const particles = useRef([])

  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() - 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: Math.random() * 0.01 + 0.005,
      sway: Math.random() * 0.02 - 0.01,
    }))

    const positions = new Float32Array(count * 3)
    ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    
    const positions = ref.current.geometry.attributes.position.array
    
    particles.current.forEach((p, i) => {
      p.position.y += p.velocity
      p.position.x += p.sway
      
      if (p.position.y > 2) {
        p.position.y = -2
        p.position.x = (Math.random() - 0.5) * 2
      }
      
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 9] = p.position.z
    })
    
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        size={0.3}
        color="rgb(216, 102, 8)"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}


export default function App() {
  const clientRef = useRef(null)
  const [bgColor, setBgColor] = useState('linear-gradient(to top,rgba(0, 0, 0, 0.08),rgba(255, 0, 0, 0.27),rgba(255, 128, 0, 0.36),rgba(255, 255, 0, 0.37), transparent)')
  const [isLigado, setIsLigado] = useState(false)
  useEffect(() => {
    const client = mqtt.connect('wss://test.mosquitto.org:8081')

    client.on('connect', () => {
      console.log('Conectado ao broker MQTT')
    })

    client.on('error', (err) => {
      console.error('Erro na conexão:', err)
      client.end()
    })

    clientRef.current = client

    return () => {
      client.end()
    }
  }, [])

  const enviarMensagem = () => {
    if (clientRef.current?.connected && !isLigado) {
      // Se o cliente estiver conectado e não estiver ligado, publica a mensagem
      clientRef.current.publish('teste/topico', 'ligado')
      setBgColor('linear-gradient(to top,rgba(0, 0, 0, 1),rgba(17, 18, 17, 0.99),rgba(6, 6, 6, 1), transparent)') 
      setIsLigado(true)
    } else if (clientRef.current?.connected && isLigado) {
      // Se o cliente estiver conectado e já estiver ligado, publica a mensagem de desligado
      clientRef.current.publish('teste/topico', 'desligado')
      setBgColor('linear-gradient(to top,rgba(0, 0, 0, 0.08),rgba(255, 0, 0, 0.27),rgba(255, 128, 0, 0.36),rgba(255, 255, 0, 0.37), transparent)') 
      setIsLigado(false)
    } else {
      // Se o cliente não estiver conectado, exibe um alerta
      alert('Cliente MQTT não conectado.')
    }
  }

  return (
    <div style={{ 
      position: 'fixed',  // Usando fixed para cobrir toda a viewport
      top: 0,
      left: 0,
      width: '100vw',     // 100% da viewport width
      height: '100vh',    // 100% da viewport height
      overflow: 'hidden', // Previne scrollbars
      margin: 0,
      padding: 0
    }}>
      {/* Interface */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          color: 'white',
          pointerEvents: 'none',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', pointerEvents: 'auto' }}>
          MQTT com React
        </h1>
        <button
          style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'black',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'auto',
          }}
          onClick={enviarMensagem}
        >
          Enviar mensagem
        </button>
        
        <p style={{ fontSize: '1.2rem', position: 'absolute', top: '90%', pointerEvents: 'auto',  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img style={{filter: 'invert(90%) brightness(180%)'}} src="public\pet_azul.png" alt="Girl in a jacket"  height="50"/>
        </p>
      </div>
      {/* Fundo com cor dinâmica */}
      <div style={{
        backdropFilter: 'blur(25px)',
        background: bgColor,
        padding: '2rem',
        borderRadius: '1rem',
        color: 'white',
        fontSize: '1.5rem',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}></div>

      {/* Canvas - Agora cobrindo toda a tela */}
      <Canvas 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'black'
        }}
        camera={{ position: [0, 0, 5] }}
      >
        <SmokeParticles count={1000} />
      </Canvas>
    </div>
  )
}
