import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface ConnectionState {
  api: ConnectionStatus;
  database: ConnectionStatus;
  lastPing: Date | null;
  latencyMs: number | null;
}

const PING_INTERVAL_MS = 15000;

export function useConnectionStatus() {
  const [state, setState] = useState<ConnectionState>({
    api: 'connecting',
    database: 'connecting',
    lastPing: null,
    latencyMs: null,
  });

  const pingApi = useCallback(async () => {
    const start = performance.now();
    try {
      await api.getShops();
      const latency = Math.round(performance.now() - start);
      setState({
        api: 'connected',
        database: 'connected',
        lastPing: new Date(),
        latencyMs: latency,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        api: 'disconnected',
        database: 'disconnected',
        lastPing: new Date(),
        latencyMs: null,
      }));
    }
  }, []);

  useEffect(() => {
    pingApi();
    const interval = setInterval(pingApi, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [pingApi]);

  return state;
}
