import argparse
import time
import requests
import json
import cv2
import numpy as np
from picamera2 import MappedArray, Picamera2
from picamera2.devices.imx500 import IMX500
from pyzbar.pyzbar import decode, ZBarSymbol
from PIL import Image
import paho.mqtt.client as mqtt

# Configuration
SERVER_URL = "https://127.0.0.1:8000/api/store_qr/"  # Ensure this matches Django backend
LABEL = "qr-code"
CONFIDENCE_THRESHOLD = 0.3
SCAN_DELAY = 5  # Delay (in seconds) between consecutive scans
ANOMALY_THRESHOLD = 10  # Time in seconds to detect anomaly if no QR detected

# MQTT Configuration
MQTT_BROKER = "mqtt.eclipseprojects.io"
MQTT_PORT = 1883
MQTT_TOPIC = "manufacturing/anomalies"  # Updated to match React app

# Initialize MQTT client
mqtt_client = mqtt.Client()

# Update the MQTT callbacks to publish connection status
def on_connect(client, userdata, flags, rc):
    global mqtt_connected
    if rc == 0:
        mqtt_connected = True
        print(f"[✅] Connected to MQTT broker: {MQTT_BROKER}")
        mqtt_client.publish(MQTT_TOPIC, json.dumps({"status": "connected"}))  # Publish connection status
    else:
        mqtt_connected = False
        print(f"[❌] Failed to connect to MQTT broker, return code: {rc}")

def on_disconnect(client, userdata, rc):
    global mqtt_connected
    mqtt_connected = False
    print(f"[⚠] Disconnected from MQTT broker, return code: {rc}")
    mqtt_client.publish(MQTT_TOPIC, json.dumps({"status": "disconnected"}))  # Publish disconnection status


mqtt_client.on_connect = on_connect
mqtt_client.on_disconnect = on_disconnect

mqtt_connected = False
try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
except Exception as e:
    print(f"[❌] MQTT Connection Failed: {e}")

last_detections = []
last_scan_time = 0  # Track the last scan time
last_qr_detected_time = time.time()  # Track the last time a QR was detected
last_anomaly_published = 0  # Track the last time an anomaly was published

class Detection:
    def __init__(self, coords, category, conf, metadata):
        self.category = category
        self.conf = conf
        self.box = imx500.convert_inference_coords(coords, metadata, picam2)

def parse_and_draw_detections(request):
    detections = parse_detections(request.get_metadata())
    draw_detections(request, detections)
    send_qr_data(request, detections)

def parse_detections(metadata):
    global last_detections
    np_outputs = imx500.get_outputs(metadata, add_batch=True)
    if np_outputs is None:
        return last_detections

    boxes, scores, classes = np_outputs[0][0], np_outputs[2][0], np_outputs[1][0]
    filtered_detections = [
        Detection(box, category, score, metadata)
        for box, score, category in zip(boxes, scores, classes)
        if score >= CONFIDENCE_THRESHOLD
    ]

    last_detections = filtered_detections
    return filtered_detections

def draw_detections(request, detections, stream="main"):
    with MappedArray(request, stream) as m:
        for detection in detections:
            x, y, w, h = detection.box
            label = f"{LABEL} ({detection.conf:.2f})"
            cv2.putText(m.array, label, (x + 5, y + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            cv2.rectangle(m.array, (x, y), (x + w, y + h), (0, 255, 0), 2)

def decode_qr_code(frame, x, y, w, h):
    roi = frame[y:y+h, x:x+w]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    qr_data = decode(Image.fromarray(gray), symbols=[ZBarSymbol.QRCODE])

    if qr_data:
        qr_text = qr_data[0].data.decode('utf-8').strip()
        print(f"[✅] QR Code Detected: {qr_text}")
        return qr_text  
    else:
        print("[⚠] No QR code detected in ROI")
        return None

def send_qr_data(request, detections):
    global last_scan_time, last_qr_detected_time
    current_time = time.time()

    # Check if enough time has passed since the last scan
    if current_time - last_scan_time < SCAN_DELAY:
        return

    with MappedArray(request, "main") as m:
        for detection in detections:
            x, y, w, h = detection.box
            qr_text = decode_qr_code(m.array, x, y, w, h)

            if qr_text:
                print(f"[🚀] Sending Raw QR Data: {qr_text}")

                headers = {'Content-Type': 'application/json'}

                # Send the raw QR text directly via MQTT
                if mqtt_connected:
                    try:
                        print("[📡] Publishing Raw QR Data via MQTT:", qr_text)
                        mqtt_client.publish(MQTT_TOPIC, qr_text)  # Send raw QR text
                    except Exception as e:
                        print(f"[⚠] MQTT Error: {e}")

                # Update the last scan time and QR detected time
                last_scan_time = current_time
                last_qr_detected_time = current_time  # QR detected, reset anomaly timer

def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, required=True, help="Path to the model file")
    return parser.parse_args()

if __name__ == "__main__":
    args = get_args()

    imx500 = IMX500(args.model)
    picam2 = Picamera2()
    imx500.show_network_fw_progress_bar()

    config = picam2.create_preview_configuration(buffer_count=28)
    picam2.start(config, show_preview=True)
    picam2.pre_callback = parse_and_draw_detections

    print("[🚀] Camera and model initialized. Scanning for QR codes...")

    # Update the anomaly detection section to publish anomalies
    while True:
        time.sleep(2.0)

    # Anomaly Detection: Check if no QR code detected for more than ANOMALY_THRESHOLD seconds
        current_time = time.time()
        if current_time - last_qr_detected_time > ANOMALY_THRESHOLD:
           anomaly_message = "anomaly detected: no qr code detected for over 10 seconds!"
           print(f"[⚠] {anomaly_message}")
        
        # Publish anomaly message to MQTT if not published recently
           if current_time - last_anomaly_published > ANOMALY_THRESHOLD:  # Avoid flooding
              if mqtt_connected:
                try:
                    print(f"[📡] Publishing Anomaly via MQTT: {anomaly_message}")
                    mqtt_client.publish(MQTT_TOPIC, json.dumps({"anomaly": anomaly_message}))
                    last_anomaly_published = current_time
                except Exception as e:
                    print(f"[⚠] MQTT Error: {e}")
           last_qr_detected_time = current_time  # Reset to avoid repeated messages  

