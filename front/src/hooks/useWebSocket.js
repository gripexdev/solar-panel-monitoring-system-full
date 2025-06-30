import { useEffect, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (url, topics, onMessage) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the topics string to prevent unnecessary re-renders
    const topicsString = JSON.stringify(topics);

    // Memoize the onMessage callback to prevent infinite re-renders
    const memoizedOnMessage = useCallback(onMessage, [onMessage]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(url), // Use SockJS instead of native WebSocket
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                console.log("STOMP: ", str);
            },
        });

        client.onConnect = () => {
            console.log("STOMP: Connected to WebSocket");
            setConnected(true);
            setError(null);
            topics.forEach((topic) => {
                client.subscribe(topic, (message) => {
                    memoizedOnMessage(message);
                });
            });
        };

        client.onStompError = (frame) => {
            const errorMsg = `Broker reported error: ${frame.headers.message}`;
            console.error("STOMP error:", frame);
            setError(errorMsg);
        };

        client.onWebSocketError = (event) => {
            const errorMsg = "WebSocket connection error";
            console.error("WebSocket error:", event);
            setError(errorMsg);
        };

        client.onWebSocketClose = () => {
            console.log("STOMP: WebSocket connection closed");
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
    }, [url, topicsString, memoizedOnMessage, connected, topics]);

    return { stompClient, connected, error };
};

export default useWebSocket;