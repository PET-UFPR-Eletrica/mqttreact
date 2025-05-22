import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import mqtt from 'mqtt';

function SmokeParticles({ count = 1000 }) {
  const ref = useRef();
  const particles = useRef([]);

  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() - 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: Math.random() * 0.01 + 0.00,
      sway: Math.random() * 0.02 - 0.001,
    }));

    const positions = new Float32Array(count * 3);
    ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;

    const positions = ref.current.geometry.attributes.position.array;

    particles.current.forEach((p, i) => {
      p.position.y += p.velocity;
      p.position.x += p.sway;

      if (p.position.y > 2) {
        p.position.y = -2;
        p.position.x = (Math.random() - 0.5) * 2;
      }

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
    });

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        size={0.3}
        color="rgb(213, 165, 33)"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function App() {
  const clientRef = useRef(null);
  const [bgColor, setBgColor] = useState('linear-gradient(to top,rgba(0, 0, 0, 0.08),rgba(255, 0, 0, 0.2),rgba(255, 128, 0, 0.2),rgba(255, 255, 0, 0.20), transparent)');
  const [isLigado, setIsLigado] = useState(false);
  const [fazerSurgir, setIsfazerSurgir] = useState('none');
  const topico = 'peteletrica/topico';
  const broker = 'wss://test.mosquitto.org:8081';

  useEffect(() => {
    const client = mqtt.connect(broker);
    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
    });

    client.on('error', (err) => {
      console.error('Erro na conexão:', err);
      client.end();
    });

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  const enviarMensagem = () => {
    if (clientRef.current?.connected) {
      const message = isLigado ? '0' : '1';
      clientRef.current.publish(topico, message);
      setBgColor(isLigado 
        ? 'linear-gradient(to top,rgba(0, 0, 0, 0.08),rgba(255, 0, 0, 0.2),rgba(255, 128, 0, 0.2),rgba(255, 255, 0, 0.2), transparent)'
        : 'linear-gradient(to top,rgba(0, 0, 0, 1),rgba(33, 37, 33, 0.95),rgba(39, 21, 21, 0.72), transparent)');
      setIsLigado(!isLigado);
      setIsfazerSurgir('block');
    } else {
      alert('Cliente MQTT não conectado.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Vertical Instagram Link - Fixed to the left side */}
      <a
        href="https://www.instagram.com/pet_eletrica/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          left: 'max(5%, calc(50% - 180px))',
          top: 'calc(50% + 200px)',
          transform: 'translateY(-50%) rotate(-88deg)',
          transformOrigin: 'left center',
          color: 'white',
          fontSize: '1.2rem',
          textDecoration: 'none',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        
        <span>Acompanhe no Instagram</span>
        <span style={{ color: 'yellow',  textDecoration: 'underline'}}>@pet_eletrica</span>
      </a>

      {/* Main Interface */}
      <div style={{
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
      }}>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '1rem', pointerEvents: 'auto' }}>
          Uso do MQTT
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
            pointerEvents: 'auto',
          }}
          onClick={enviarMensagem}
        >
          {isLigado ? 'Desligar/Ligar' : 'Ligar/Desligar'}
        </button>

        <p style={{ fontSize: '0.6rem', pointerEvents: 'auto', marginTop: '1rem', display: fazerSurgir }}>
          Mensagens enviadas: {isLigado ? '1' : '0'}
          <br />
          Dentro do tópico do MQTT: {topico}
        </p>

        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          pointerEvents: 'auto',
        }}>
          <a href="https://www.instagram.com/pet_eletrica/" target="_blank" rel="noopener noreferrer">
            <img 
              style={{ filter: 'invert(90%) brightness(180%)'}} 
              src="https://pet-ufpr-eletrica.github.io/mqttreact/pet_azul.png" 
              alt="Pet elétrica" 
              height="50" 
            />
          </a>
        </div>
      </div>

      {/* Background */}
      <div style={{
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: bgColor,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}></div>

      {/* Three.js Canvas */}
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
  );
}