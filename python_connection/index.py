import json
import logging
import ssl
import time
import random
from datetime import datetime
from paho.mqtt import client as mqtt_client

# Configuration
BROKER = 'z8865828.ala.us-east-1.emqxsl.com'
PORT = 8883
TOPIC = "solar/sensor/data"
CLIENT_ID = f'solar-backend-{random.randint(0, 1000)}'
USERNAME = 'othmane'
PASSWORD = 'othmane'

# Reconnection settings
FIRST_RECONNECT_DELAY = 1
RECONNECT_RATE = 2
MAX_RECONNECT_COUNT = 12
MAX_RECONNECT_DELAY = 60

FLAG_EXIT = False

def on_connect(client, userdata, flags, rc):
    if rc == 0 and client.is_connected():
        print("Connected to MQTT Broker!")
        client.subscribe(TOPIC)
    else:
        print(f'Failed to connect, return code {rc}')

def on_disconnect(client, userdata, rc):
    logging.info("Disconnected with result code: %s", rc)
    reconnect_count, reconnect_delay = 0, FIRST_RECONNECT_DELAY

    while reconnect_count < MAX_RECONNECT_COUNT:
        logging.info("Reconnecting in %d seconds...", reconnect_delay)
        time.sleep(reconnect_delay)

        try:
            client.reconnect()
            logging.info("Reconnected successfully!")
            return
        except Exception as err:
            logging.error("%s. Reconnect failed. Retrying...", err)

        reconnect_delay *= RECONNECT_RATE
        reconnect_delay = min(reconnect_delay, MAX_RECONNECT_DELAY)
        reconnect_count += 1

    logging.info("Reconnect failed after %s attempts. Exiting...", reconnect_count)
    global FLAG_EXIT
    FLAG_EXIT = True

def on_message(client, userdata, msg):
    print(f'Received `{msg.payload.decode()}` from `{msg.topic}` topic')

def connect_mqtt():
    client = mqtt_client.Client(CLIENT_ID)
    client.username_pw_set(USERNAME, PASSWORD)

    client.tls_set(cert_reqs=ssl.CERT_NONE)  # Disable cert check (for testing)
    client.tls_insecure_set(True)  # Allow insecure TLS

    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    client.connect(BROKER, PORT, keepalive=3)
    return client

def generate_sensor_data():
    """Generate realistic solar panel sensor data with dependencies between values"""
    # First determine weather conditions (0 or 1)
    rain_detected = 1 if random.random() < 0.3 else 0  # 30% chance of rain
    snow = 1 if (not rain_detected and random.random() < 0.1) else 0  # 10% chance of snow if not raining

    # Set temperature based on weather
    if snow:
        temp = round(random.uniform(-5.0, 2.0), 1)
    elif rain_detected:
        temp = round(random.uniform(5.0, 15.0), 1)
    else:
        temp = round(random.uniform(10.0, 35.0), 1)

    # Set wind speed based on weather
    if snow or rain_detected:
        wind_speed = round(random.uniform(15.0, 40.0), 1)
    else:
        wind_speed = round(random.uniform(0.5, 15.0), 1)

    # Solar radiation depends on weather
    if snow or rain_detected:
        radiation = round(random.uniform(50.0, 300.0), 1)
    else:
        radiation = round(random.uniform(300.0, 1000.0), 1)

    # Panel angle (more likely to be adjusted on sunny days)

    pv_angle = random.randint(0, 180)  # Random angle

    # Humidity depends on weather
    if rain_detected:
        humidity = round(random.uniform(70.0, 100.0), 1)
    else:
        humidity = round(random.uniform(20.0, 70.0), 1)

    # Switch state (simulating different operation modes)
    if radiation > 700:
        switch_state = round(random.uniform(7.0, 10.0), 1)
    elif radiation > 300:
        switch_state = round(random.uniform(4.0, 7.0), 1)
    else:
        switch_state = round(random.uniform(0.0, 4.0), 1)

    return {
        "snow": snow,  # 0 or 1
        "wind_speed": wind_speed,
        "rain_detected": rain_detected,  # 0 or 1
        "switch_state": switch_state,
        "radiation": radiation,
        "pvAngle": pv_angle,
        "humidity": humidity,
        "temperature": temp,
        "timestamp": datetime.now().isoformat()
    }

def publish(client):
    while not FLAG_EXIT:
        msg_dict = generate_sensor_data()
        msg = json.dumps(msg_dict)

        if not client.is_connected():
            logging.error("publish: MQTT client is not connected!")
            time.sleep(1)
            continue

        result = client.publish(TOPIC, msg)
        status = result[0]

        if status == 0:
            print(f'Sent `{msg}` to topic `{TOPIC}`')
        else:
            print(f'Failed to send message to topic {TOPIC}')

        time.sleep(60)  # Send data every 60 seconds

def run():
    logging.basicConfig(
        format='%(asctime)s - %(levelname)s: %(message)s',
        level=logging.DEBUG
    )
    client = connect_mqtt()
    client.loop_start()
    time.sleep(1)

    if client.is_connected():
        publish(client)
    else:
        client.loop_stop()

if __name__ == '__main__':
    run()