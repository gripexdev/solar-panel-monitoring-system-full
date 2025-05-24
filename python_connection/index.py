import json
import logging
import ssl
import time
import random
from paho.mqtt import client as mqtt_client

BROKER = 'z8865828.ala.us-east-1.emqxsl.com'
PORT = 8883
TOPIC = "solar/sensor/data"
CLIENT_ID = f'solar-backend-{random.randint(0, 1000)}'
USERNAME = 'othmane'
PASSWORD = 'othmane'

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


def publish(client):
    while not FLAG_EXIT:
        msg_dict = {
            "snow": random.choice([True, False]),
            "wind_speed": round(random.uniform(0.0, 25.0), 2),       # in m/s
            "switch_state": round(random.uniform(0.0, 3.0), 1),      # e.g. 0 to 3 states
            "voltage": round(random.uniform(200.0, 800.0), 1),       # in volts
            "pvAngle": random.randint(0, 180),                       # in degrees
            "humidity": round(random.uniform(10.0, 100.0), 1),       # in %
            "temperature": round(random.uniform(-10.0, 60.0), 1)     # in °C
        }
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

        time.sleep(1)


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