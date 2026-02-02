/**
 * Massive.com Market Data Client
 * 
 * WebSocket client for real-time streaming and REST client for historical data.
 * Uses Polygon.io data via Massive.com API.
 */

import { websocketClient, restClient } from '@polygon.io/client-js';

// Environment config
const API_KEY = import.meta.env.VITE_MASSIVE_API_KEY || '';
const USE_REALTIME = true; // Real-time data enabled

// Debug: Log API key status on load
console.log('[MassiveClient] API Key configured:', !!API_KEY && API_KEY.length > 10 ? 'YES' : 'NO');
console.log('[MassiveClient] API Key length:', API_KEY?.length || 0);
console.log('[MassiveClient] Real-time mode:', USE_REALTIME ? 'ENABLED' : 'DISABLED');

// WebSocket endpoints
const WS_REALTIME = 'wss://socket.massive.com';
const WS_DELAYED = 'wss://delayed.massive.com';

// REST endpoint
const REST_URL = 'https://api.massive.com';

/**
 * Aggregate Minute bar data from WebSocket
 */
export interface AggregateMinute {
    ev: 'AM';      // Event type
    sym: string;   // Symbol
    v: number;     // Volume
    o: number;     // Open
    h: number;     // High
    l: number;     // Low
    c: number;     // Close
    a: number;     // VWAP
    s: number;     // Start timestamp (Unix ms)
    e: number;     // End timestamp (Unix ms)
}

/**
 * Trade event from WebSocket
 */
export interface TradeEvent {
    ev: 'T';
    sym: string;
    p: number;     // Price
    s: number;     // Size
    t: number;     // Timestamp
}

/**
 * Status message from WebSocket
 */
export interface StatusMessage {
    ev: 'status';
    status: string;
    message: string;
}

export type WebSocketMessage = AggregateMinute | TradeEvent | StatusMessage;

/**
 * Historical bar data from REST API
 */
export interface HistoricalBar {
    o: number;     // Open
    h: number;     // High
    l: number;     // Low
    c: number;     // Close
    v: number;     // Volume
    vw?: number;   // VWAP (optional)
    t: number;     // Timestamp (Unix ms)
    n?: number;    // Number of trades (optional)
}

export interface AggregatesResponse {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: HistoricalBar[];
    status: string;
    request_id: string;
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
    return !!API_KEY && API_KEY.length > 10;
}

/**
 * Create REST client for historical data
 */
export function createRestClient() {
    if (!hasApiKey()) {
        throw new Error('No Massive API key configured');
    }
    return restClient(API_KEY, REST_URL);
}

/**
 * Fetch historical aggregate bars for a symbol
 */
export async function fetchHistoricalBars(
    symbol: string,
    timespan: 'minute' | 'hour' | 'day' | 'week' = 'day',
    multiplier: number = 1,
    days: number = 100
): Promise<HistoricalBar[]> {
    if (!hasApiKey()) {
        console.warn('No API key - returning empty data');
        return [];
    }

    const rest = createRestClient();
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

    // Adjust limit based on timespan to ensure we get enough data
    // and include the most recent bars
    let limit = 500;
    if (timespan === 'hour') {
        // For hourly data, we need more bars to cover the time range
        limit = Math.min(5000, Math.ceil((days * 24) / multiplier));
    } else if (timespan === 'minute') {
        limit = 5000; // Max for minute data
    }

    const fromDate = from.toISOString().split('T')[0];
    const toDate = to.toISOString().split('T')[0];
    console.log(`[MassiveClient] Fetching ${symbol}: ${multiplier} ${timespan} bars from ${fromDate} to ${toDate}, limit=${limit}`);

    try {
        // Use 'as any' to work around strict enum types in the client
        // The actual API accepts these string values
        const response = await rest.getStocksAggregates(
            symbol,
            multiplier,
            timespan as any,
            fromDate,
            toDate,
            true, // adjusted
            'asc' as any, // sort
            limit // limit
        );

        console.log(`[MassiveClient] Response status: ${response.status}, resultsCount: ${response.resultsCount || 0}`);

        if (!response.results || response.results.length === 0) {
            console.warn(`[MassiveClient] No results returned for ${symbol}`);
            // Return empty but don't throw - let the caller decide
            return [];
        }

        console.log(`[MassiveClient] Got ${response.results.length} bars for ${symbol}`);
        return response.results as HistoricalBar[];
    } catch (error) {
        console.error('[MassiveClient] Failed to fetch historical bars:', error);
        // Re-throw so caller can handle
        throw error;
    }
}

/**
 * Market data WebSocket manager
 */
export class MarketDataSocket {
    private ws: ReturnType<ReturnType<typeof websocketClient>['stocks']> | null = null;
    private isConnected = false;
    private isAuthenticated = false;
    private subscriptions: Set<string> = new Set();
    private messageHandlers: Map<string, (msg: WebSocketMessage) => void> = new Map();

    constructor() { }

    /**
     * Connect to WebSocket and authenticate
     */
    async connect(): Promise<boolean> {
        if (!hasApiKey()) {
            console.warn('No API key - WebSocket connection disabled');
            return false;
        }

        return new Promise((resolve) => {
            try {
                const wsUrl = USE_REALTIME ? WS_REALTIME : WS_DELAYED;
                this.ws = websocketClient(API_KEY, wsUrl).stocks();

                this.ws.onmessage = ({ data }: { data: string }) => {
                    try {
                        const messages = JSON.parse(data);
                        const msgArray = Array.isArray(messages) ? messages : [messages];

                        for (const msg of msgArray) {
                            if (msg.ev === 'status') {
                                if (msg.message === 'connected') {
                                    this.isConnected = true;
                                }
                                if (msg.message === 'auth_success') {
                                    this.isAuthenticated = true;
                                    resolve(true);
                                }
                            }

                            // Dispatch to symbol-specific handlers
                            if (msg.sym) {
                                const handler = this.messageHandlers.get(msg.sym);
                                if (handler) handler(msg);
                            }
                        }
                    } catch (e) {
                        console.error('WebSocket message parse error:', e);
                    }
                };

                this.ws.onerror = (err: Event) => {
                    console.error('WebSocket error:', err);
                    resolve(false);
                };

                this.ws.onclose = () => {
                    this.isConnected = false;
                    this.isAuthenticated = false;
                };

                // Auth happens automatically via the client
                setTimeout(() => {
                    if (!this.isAuthenticated) {
                        resolve(false);
                    }
                }, 5000);

            } catch (error) {
                console.error('WebSocket connection failed:', error);
                resolve(false);
            }
        });
    }

    /**
     * Subscribe to aggregate minute bars for a symbol
     */
    subscribe(symbol: string, onMessage: (msg: WebSocketMessage) => void): void {
        if (!this.ws || !this.isAuthenticated) {
            console.warn('WebSocket not connected');
            return;
        }

        const channel = `AM.${symbol}`;
        if (this.subscriptions.has(channel)) return;

        this.ws.send(JSON.stringify({
            action: 'subscribe',
            params: channel
        }));

        this.subscriptions.add(channel);
        this.messageHandlers.set(symbol, onMessage);
    }

    /**
     * Unsubscribe from a symbol
     */
    unsubscribe(symbol: string): void {
        if (!this.ws) return;

        const channel = `AM.${symbol}`;
        if (!this.subscriptions.has(channel)) return;

        this.ws.send(JSON.stringify({
            action: 'unsubscribe',
            params: channel
        }));

        this.subscriptions.delete(channel);
        this.messageHandlers.delete(symbol);
    }

    /**
     * Disconnect WebSocket
     */
    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.isAuthenticated = false;
        this.subscriptions.clear();
        this.messageHandlers.clear();
    }

    /**
     * Check connection status
     */
    get connected(): boolean {
        return this.isConnected && this.isAuthenticated;
    }
}

// Singleton instance
let socketInstance: MarketDataSocket | null = null;

export function getMarketDataSocket(): MarketDataSocket {
    if (!socketInstance) {
        socketInstance = new MarketDataSocket();
    }
    return socketInstance;
}
