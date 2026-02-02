import { useState, useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { Search, Settings, Zap, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { GlassSelect } from '../components/ui/GlassSelect';
import { NOTABLE_FLOW_STOCKS, STEP_SIZE_OPTIONS, searchFlowStocks, FlowStock } from '../data/flowStocks';
import { fetchHistoricalBars, getMarketDataSocket, AggregateMinute, HistoricalBar, hasApiKey } from '../services/massiveClient';

type Timeframe = '1H' | '4H' | '1D' | '1W';
type DataStatus = 'loading' | 'live' | 'error';

export default function FlowTAView() {
    // State
    const [selectedSymbol, setSelectedSymbol] = useState<FlowStock | undefined>(NOTABLE_FLOW_STOCKS[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [dataStatus, setDataStatus] = useState<DataStatus>('loading');
    const [chartData, setChartData] = useState<CandlestickData<Time>[]>([]);

    // Config
    const [psychConfig, setPsychConfig] = useState({
        enabled: true,
        stepSize: '1.00',
        quarters: false
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Refs
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const socket = getMarketDataSocket();

    // Filter flow stocks
    const filteredStocks = useMemo(() => {
        return searchFlowStocks(searchQuery).slice(0, 10);
    }, [searchQuery]);

    // Update step size when symbol changes
    useEffect(() => {
        if (selectedSymbol) {
            setPsychConfig(prev => ({
                ...prev,
                stepSize: selectedSymbol.stepSize.toString()
            }));
        }
    }, [selectedSymbol]);

    // Helper: Map timeframe to API params
    const getTimespanConfig = (tf: Timeframe) => {
        switch (tf) {
            case '1H': return { timespan: 'hour', multiplier: 1, days: 30 };
            case '4H': return { timespan: 'hour', multiplier: 4, days: 60 };
            case '1D': return { timespan: 'day', multiplier: 1, days: 180 };
            case '1W': return { timespan: 'week', multiplier: 1, days: 730 };
            default: return { timespan: 'day', multiplier: 1, days: 180 };
        }
    };

    // Helper: Convert API bar to Chart candle
    const barToCandlestick = (bar: HistoricalBar, isIntraday: boolean): CandlestickData<Time> => {
        if (isIntraday) {
            // Unix timestamp for intraday
            return {
                time: Math.floor(bar.t / 1000) as Time,
                open: bar.o,
                high: bar.h,
                low: bar.l,
                close: bar.c
            };
        }
        // Date string for Daily/Weekly
        return {
            time: new Date(bar.t).toISOString().split('T')[0] as Time,
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c
        };
    };

    // Load Data
    useEffect(() => {
        if (!selectedSymbol) return;

        const loadData = async () => {
            setDataStatus('loading');

            if (!hasApiKey()) {
                console.error('[FlowTA] No API key configured');
                setChartData([]);
                setDataStatus('error');
                return;
            }

            try {
                const config = getTimespanConfig(activeTimeframe);
                // Cast strict string literal to string for API call if needed, but client handles it
                const bars = await fetchHistoricalBars(
                    selectedSymbol.symbol,
                    config.timespan as any,
                    config.multiplier,
                    config.days
                );

                if (bars.length === 0) {
                    setDataStatus('error');
                    setChartData([]);
                    return;
                }

                const isIntraday = activeTimeframe === '1H' || activeTimeframe === '4H';
                const candles = bars.map(b => barToCandlestick(b, isIntraday));
                setChartData(candles);
                setDataStatus('live');

            } catch (err) {
                console.error('Failed to load chart data', err);
                setDataStatus('error');
                setChartData([]);
            }
        };

        loadData();
    }, [selectedSymbol, activeTimeframe]);

    // WebSocket logic
    useEffect(() => {
        if (!selectedSymbol || !hasApiKey()) return;

        let mounted = true;
        let lastUpdateTime = 0;
        const THROTTLE_MS = 500;

        const connect = async () => {
            if (!socket.connected) {
                await socket.connect();
            }

            if (socket.connected) {
                socket.subscribe(selectedSymbol.symbol, (msg) => {
                    if (msg.ev === 'AM' && mounted) {
                        const now = Date.now();
                        if (now - lastUpdateTime < THROTTLE_MS) return;
                        lastUpdateTime = now;

                        const am = msg as AggregateMinute;

                        setChartData(prev => {
                            if (prev.length === 0) return prev;

                            // Update last bar logic for consistency
                            const lastBar = { ...prev[prev.length - 1] };
                            lastBar.close = am.c;
                            if (am.h > lastBar.high) lastBar.high = am.h;
                            if (am.l < lastBar.low) lastBar.low = am.l;

                            return [...prev.slice(0, -1), lastBar];
                        });
                    }
                });
            }
        };

        connect();

        return () => {
            mounted = false;
            // Optional: socket.unsubscribe if we want to cleanup per view
            // But singleton socket might be shared
            if (selectedSymbol) {
                socket.unsubscribe(selectedSymbol.symbol);
            }
        };
    }, [selectedSymbol]);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0f1115' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: '#1f2937' },
                horzLines: { color: '#1f2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const series = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update Chart Data
    useEffect(() => {
        if (seriesRef.current && chartData.length > 0) {
            seriesRef.current.setData(chartData);
            // Fit content only on initial load or symbol change
            // chartRef.current?.timeScale().fitContent(); 
        }
    }, [chartData]);


    const handleSymbolSelect = (stock: FlowStock) => {
        setSelectedSymbol(stock);
        setSearchQuery('');
        setIsSearching(false);
        setShowDropdown(false);
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#0f1115] text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#181b21]/50 backdrop-blur-sm relative z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg tracking-tight">FlowTA</span>
                    </div>

                    {/* Search */}
                    <div className="relative group overflow-visible z-[9999]" style={{ width: '240px' }}>
                        <div className="relative bg-[#202329] rounded-lg border border-white/10 flex items-center px-3 py-2 focus-within:border-blue-500/50 transition-colors">
                            <Search className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                                placeholder="Search symbol..."
                                value={isSearching ? searchQuery : (selectedSymbol?.symbol || '')}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    setIsSearching(true);
                                    setSearchQuery('');
                                    setShowDropdown(true);
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsSearching(false);
                                        setShowDropdown(false);
                                    }, 200);
                                }}
                            />
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div
                                className="absolute left-0 right-0 bg-[#202329] border border-white/10 rounded-lg shadow-xl mt-1 max-h-[300px] overflow-y-auto"
                                style={{ top: '100%', zIndex: 9999 }}
                            >
                                {filteredStocks.length > 0 ? (
                                    filteredStocks.map(stock => (
                                        <div
                                            key={stock.symbol}
                                            className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group"
                                            onClick={() => handleSymbolSelect(stock)}
                                            onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                        >
                                            <div>
                                                <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{stock.symbol}</div>
                                                <div className="text-xs text-gray-500">{stock.name}</div>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                                                {stock.sector}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        No matches found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timeframes */}
                    <div className="flex bg-[#202329] p-1 rounded-lg border border-white/5">
                        {(['1H', '4H', '1D', '1W'] as Timeframe[]).map(tf => (
                            <button
                                key={tf}
                                onClick={() => setActiveTimeframe(tf)}
                                className={clsx(
                                    'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                                    activeTimeframe === tf
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    {/* Step Size */}
                    <div className="w-32">
                        <GlassSelect
                            value={psychConfig.stepSize}
                            onChange={(e) => setPsychConfig(prev => ({ ...prev, stepSize: e.target.value }))}
                        >
                            {STEP_SIZE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </GlassSelect>
                    </div>

                    {/* Quarters Toggle */}
                    <button
                        onClick={() => setPsychConfig(prev => ({ ...prev, quarters: !prev.quarters }))}
                        className={clsx(
                            'p-2 rounded-lg border transition-all',
                            psychConfig.quarters
                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                                : 'bg-[#202329] border-white/5 text-gray-400 hover:text-white'
                        )}
                        title="Toggle Quarter Levels"
                    >
                        <Zap className="w-4 h-4" />
                    </button>

                    {/* Advanced Settings */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={clsx(
                            'p-2 rounded-lg border transition-all',
                            showAdvanced
                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                                : 'bg-[#202329] border-white/5 text-gray-400 hover:text-white'
                        )}
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Chart */}
            <div className="flex-1 relative" ref={chartContainerRef}>
                {dataStatus === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0f1115]/80 z-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {dataStatus === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f1115]/90 z-20">
                        <div className="text-red-500 font-bold mb-2">Data Error</div>
                        <div className="text-sm text-gray-400">Failed to load market data. Check API key.</div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="h-8 bg-[#181b21] border-t border-white/5 flex items-center justify-between px-4 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={clsx(
                            "w-2 h-2 rounded-full",
                            dataStatus === 'live' ? "bg-green-500 animate-pulse" :
                                dataStatus === 'error' ? "bg-red-500" : "bg-yellow-500"
                        )} />
                        <span className={clsx(
                            "font-medium",
                            dataStatus === 'live' ? "text-green-500" :
                                dataStatus === 'error' ? "text-red-500" : "text-yellow-500"
                        )}>
                            {dataStatus === 'live' ? 'Live Market Data' :
                                dataStatus === 'error' ? 'Data Error' : 'Connecting...'}
                        </span>
                    </div>
                </div>
                <div className="text-gray-500 flex gap-4">
                    <span>Massive.com Connection</span>
                    <span>Polygon.io Provider</span>
                </div>
            </div>
        </div>
    );
}
