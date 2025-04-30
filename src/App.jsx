import React, { useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export default function App() {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect('wss://test.mosquitto.org:1883');

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
      clientRef.current.publish('teste/topico', 'xx');    
    } else {
      alert('Cliente MQTT não conectado.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MQTT com React</h1>
      <button onClick={enviarMensagem}>Enviar mensagem</button>
    </div>
  );
}
