import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import mqtt from 'mqtt';

type QRData = {
  value: string;
  timestamp: string;
};

type QRScannerContextType = {
  currentQR: string;
  connectionStatus: string;
  scanHistory: QRData[];
};

const QRScannerContext = createContext<QRScannerContextType>({
  currentQR: '',
  connectionStatus: 'Disconnected',
  scanHistory: [],
});

export const useQRScanner = () => useContext(QRScannerContext);

type QRScannerProviderProps = {
  children: ReactNode;
};

export const QRScannerProvider = ({ children }: QRScannerProviderProps) => {
  const [currentQR, setCurrentQR] = useState<string>('Waiting for QR code data...');
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [scanHistory, setScanHistory] = useState<QRData[]>([]);

  useEffect(() => {
    const brokerUrl = 'wss://mqtt.eclipseprojects.io:443/mqtt';
    const topic = 'warehouse/qr';

    console.log('Connecting to MQTT broker...');
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Connected to MQTT Broker');
      mqttClient.subscribe(topic);
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      setConnectionStatus('Error: ' + err.message);
    });

    mqttClient.on('reconnect', () => {
      setConnectionStatus('Reconnecting...');
    });

    mqttClient.on('message', (topic, message) => {
      let data = message.toString().trim(); // Remove leading/trailing spaces
      data = data.replace(/\n/g, '').replace(/\r/g, ''); // ✅ Remove newlines

      console.log('Received QR Data:', data);

      setCurrentQR(data);
      setScanHistory((prev) => [
        { value: data, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9), // Keep only last 10 items
      ]);
    });

    // ✅ Cleanup function to properly disconnect MQTT client
    return () => {
      console.log('Disconnecting MQTT client...');
      mqttClient.end();
    };
  }, []);

  return (
    <QRScannerContext.Provider value={{ currentQR, connectionStatus, scanHistory }}>
      {children}
    </QRScannerContext.Provider>
  );
};
