import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Search, Settings2, Play, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const TechnicalAnalysisView: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [activeTimeframe, setActiveTimeframe] = useState('1D');

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        // Mock Data
        const data = [];
        let price = 150;
        const now = new Date();
        for (let i = 0; i < 100; i++) {
            const time = new Date(now.getTime() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const open = price + Math.random() * 10 - 5;
            const high = open + Math.random() * 5;
            const low = open - Math.random() * 5;
            const close = (open + high + low) / 3;
            price = close;
            data.push({ time, open, high, low, close });
        }
        candleSeries.setData(data);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Controls Bar */}
            <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--accent-glow)] transition-colors" />
                        <input
                            type="text"
                            defaultValue="AAPL"
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-charcoal)] border border-glass-stroke rounded-lg text-sm text-white focus:outline-none focus:border-[var(--accent-glow)] transition-all font-mono font-bold"
                        />
                    </div>

                    <div className="flex bg-[var(--bg-charcoal)] rounded-lg p-1 border border-glass-stroke">
                        {['1H', '4H', '1D', '1W'].map(tf => (
                            <button
                                key={tf}
                                onClick={() => setActiveTimeframe(tf)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all",
                                    activeTimeframe === tf
                                        ? "bg-[var(--bg-panel-hover)] text-white shadow-sm border border-glass-highlight"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-stroke hover:bg-white/5 text-gray-400 text-xs font-medium transition-colors">
                        <Settings2 size={14} />
                        <span>Indicators (2)</span>
                    </button>
                    <GlowButton size="sm">
                        <Play size={14} />
                        <span>Run Analysis</span>
                    </GlowButton>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Main Chart */}
                <GlassCard className="lg:col-span-3 p-4 flex flex-col min-h-[500px] relative">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <StatusBadge status="success" label="Market Open" pulse />
                        <div className="px-2 py-0.5 rounded border border-white/10 bg-black/40 text-[10px] text-gray-400 font-mono backdrop-blur-sm">
                            Last Updated: 10:42:01
                        </div>
                    </div>
                    <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
                </GlassCard>

                {/* Side Panel: Signals */}
                <div className="flex flex-col gap-6 overflow-y-auto">
                    <GlassCard className="p-5">
                        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                            <AlertCircle size={14} className="text-[var(--accent-glow)]" />
                            Active Signals
                        </h3>
                        <div className="space-y-3">
                            {[
                                { type: 'RSI Divergence', sentiment: 'Bearish', conf: 'High' },
                                { type: 'MACD Crossover', sentiment: 'Bullish', conf: 'Medium' },
                                { type: 'Vol. Breakout', sentiment: 'Neutral', conf: 'Low' },
                            ].map((sig, i) => (
                                <div key={i} className="p-3 rounded-lg bg-[var(--bg-charcoal)] border border-glass-stroke hover:border-glass-highlight transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium text-gray-200 group-hover:text-[var(--accent-glow)] transition-colors">{sig.type}</span>
                                        <span className={clsx(
                                            "text-[10px] px-1.5 py-0.5 rounded font-mono uppercase",
                                            sig.sentiment === 'Bullish' ? "text-emerald-400 bg-emerald-500/10" :
                                                sig.sentiment === 'Bearish' ? "text-rose-400 bg-rose-500/10" : "text-gray-400 bg-gray-500/10"
                                        )}>{sig.sentiment}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full", sig.conf === 'High' ? "bg-emerald-500 w-3/4" : sig.conf === 'Medium' ? "bg-amber-500 w-1/2" : "bg-gray-500 w-1/4")}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 flex-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)]/5 to-transparent pointer-events-none" />
                        <h3 className="text-sm font-medium text-white mb-2">AI Commentary</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-light">
                            Price action detected consolidation near the <span className="text-emerald-400">$152.40</span> resistance level. Volume profile indicates accumulation. Consider tighter stop-loss placement given recent volatility spikes.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
