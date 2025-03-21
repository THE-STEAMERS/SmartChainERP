from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import requests

class Command(BaseCommand):
    help = "Starts the MQTT client to listen for QR code scans"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting MQTT client...")

        MQTT_BROKER = "mqtt.eclipseprojects.io"
        MQTT_TOPIC = "warehouse/qr"
        BACKEND_URL = "http://127.0.0.1:8000/api/store_qr/"  # Update if needed
        DEVICE_STATUS_URL = "http://127.0.0.1:8000/api/device_status/"  # Endpoint to update device status
        def on_connect(client, userdata, flags, rc):
            self.stdout.write(f"Connected to MQTT with result code {rc}")
            client.subscribe(MQTT_TOPIC)

        def on_message(client, userdata, msg):
            data = msg.payload.decode()
            self.stdout.write(f"Received QR data: {data}")

           

            # Send HTTP POST request to backend
            try:
                response = requests.post(BACKEND_URL, json={"qr_text": data})  # Ensure the key is 'qr_text'
                if response.status_code == 200:
                    self.stdout.write(f"[✅] QR Data sent to backend: {response.json()}")
                else:
                    self.stdout.write(f"[❌] Failed to send QR data. Status: {response.status_code}")
            except requests.RequestException as e:
                self.stdout.write(f"[⚠] Error sending QR data via HTTP: {e}")

        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect(MQTT_BROKER, 1883, 60)

        self.stdout.write("MQTT client started, waiting for messages...")
        client.loop_forever()  # Keeps the process running