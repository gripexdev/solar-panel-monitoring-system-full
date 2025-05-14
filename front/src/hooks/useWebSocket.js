import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (url, topics, onMessage) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: url,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                console.log("STOMP: ", str);
            },
        });

        client.onConnect = () => {
            setConnected(true);
            setError(null);
            topics.forEach((topic) => {
                client.subscribe(topic, (message) => {
                    onMessage(message);
                });
            });
        };

        client.onStompError = (frame) => {
            setError(`Broker reported error: ${frame.headers.message}`);
            console.error("STOMP error:", frame);
        };

        client.onWebSocketError = (event) => {
            setError("WebSocket connection error");
            console.error("WebSocket error:", event);
        };

        client.onWebSocketClose = () => {
            setConnected(false);
            setError("WebSocket connection closed");
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client && connected) {
                client.deactivate();
            }
        };
    }, [url, JSON.stringify(topics)]);

    return { stompClient, connected, error };
};

export default useWebSocket;