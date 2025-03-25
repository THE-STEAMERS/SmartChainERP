from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import json
import socket
import time
import uuid
import requests

class Command(BaseCommand):
    help = "Starts the MQTT client to listen for QR code scans and publish presence"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting MQTT client...")

        # MQTT Broker Details
        MQTT_BROKER = "broker.emqx.io"
        MQTT_PORT = 1883  # Standard MQTT port
        PRESENCE_TOPIC = "device/raspberry-pi/presence"
        QR_TOPIC = "manufacturing/anomalies"
        BACKEND_URL = "http://127.0.0.1:8000/api/store_qr/"  # Update if needed
        AUTH_URL = "http://127.0.0.1:8000/api/token/"  # Authentication endpoint
        USERNAME = "joshuaa"
        PASSWORD = "Sanjos123*"

        def get_unique_client_id():
            """Generate a unique client ID for the device"""
            return f"mqtt-listener-{uuid.uuid4().hex[:8]}"

        def create_presence_payload(client_id, status):
            """Create a presence payload with device information"""
            return json.dumps({
                "client_id": client_id,
                "hostname": socket.gethostname(),
                "status": status,
                "timestamp": int(time.time())
            })

        def get_jwt_token():
            """Fetch JWT token from the authentication endpoint"""
            try:
                response = requests.post(AUTH_URL, data={"username": USERNAME, "password": PASSWORD})
                response.raise_for_status()
                return response.json().get("access")
            except requests.RequestException as e:
                self.stdout.write(f"[⚠] Error fetching JWT token: {e}")
                return None

        def on_connect(client, userdata, flags, rc):
            """Callback when the client connects to the broker"""
            self.stdout.write(f"Connected with result code {rc}")
            
            # Subscribe to the QR code topic
            client.subscribe(QR_TOPIC)
            
            # Publish online status when connected
            presence_payload = create_presence_payload(client._client_id.decode(), "online")
            client.publish(PRESENCE_TOPIC, presence_payload, qos=1, retain=True)
            self.stdout.write(f"[📡] Published online presence: {presence_payload}")

        def on_disconnect(client, userdata, rc):
            """Callback when the client disconnects"""
            self.stdout.write(f"Disconnected with result code {rc}")

        def on_message(client, userdata, msg):
            """Callback when a message is received"""
            if msg.topic == QR_TOPIC:
                # Handle QR code messages
                data = msg.payload.decode()
                self.stdout.write(f"Received QR data: {data}")

                jwt_token = get_jwt_token()
                if not jwt_token:
                    self.stdout.write("[❌] Failed to obtain JWT token")
                    return

                headers = {
                    "Authorization": f"Bearer {jwt_token}",
                    "Content-Type": "application/json"
                }

                # Send HTTP POST request to backend
                try:
                    response = requests.post(BACKEND_URL, json={"qr_text": data}, headers=headers)
                    if response.status_code in [200, 201]:
                        self.stdout.write(f"[✅] QR Data sent to backend: {response.json()}")
                    else:
                        self.stdout.write(f"[❌] Failed to send QR data. Status: {response.status_code}")
                except requests.RequestException as e:
                    self.stdout.write(f"[⚠] Error sending QR data via HTTP: {e}")

        # Generate a unique client ID
        client_id = get_unique_client_id()
        
        # Create MQTT client
        client = mqtt.Client(client_id=client_id, clean_session=True)
        
        # Set up connection callbacks
        client.on_connect = on_connect
        client.on_disconnect = on_disconnect
        client.on_message = on_message
        
        # Set up Last Will and Testament to publish "offline" status when disconnected
        will_payload = create_presence_payload(client_id, "offline")
        client.will_set(PRESENCE_TOPIC, payload=will_payload, qos=1, retain=True)
        
        try:
            # Connect to the broker
            client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.stdout.write("MQTT client started, waiting for messages...")
            
            # Start the MQTT loop
            client.loop_start()
            
            # Periodically send presence messages
            while True:
                presence_payload = create_presence_payload(client_id, "online")
                client.publish(PRESENCE_TOPIC, presence_payload, qos=1, retain=True)
                self.stdout.write(f"[📡] Published presence: {presence_payload}")
                time.sleep(30)  # Send presence message every 30 seconds
        
        except Exception as e:
            self.stdout.write(f"Error: {str(e)}")
        
        finally:
            # Publish offline status before disconnecting
            offline_payload = create_presence_payload(client_id, "offline")
            client.publish(PRESENCE_TOPIC, offline_payload, qos=1, retain=True)
            client.loop_stop()
            client.disconnect()
            self.stdout.write("MQTT client stopped.")