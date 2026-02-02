import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, FileSearch } from 'lucide-react';


export const HeatseekerView: React.FC = () => {
    const [state, setState] = useState<'idle' | 'extracting' | 'review'>('idle');

    const handleUpload = () => {
        setState('extracting');
        setTimeout(() => setState('review'), 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h2 className="text-2xl font-extrabold text-white mb-1">Heatseeker</h2>
                <p className="text-xs text-gray-400">Visual signal extraction. Convert screenshots into deterministic node tables.</p>
            </div>

            {state === 'idle' && (
                <div
                    onClick={handleUpload}
                    className="aspect-video max-w-3xl mx-auto border-2 border-dashed border-[#262626] rounded-lg flex flex-col items-center justify-center p-12 hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-[#121212] border border-[#262626] rounded-full flex items-center justify-center text-gray-600 mb-6 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                        <Upload size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Drop Screenshot Here</h3>
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest text-center max-w-sm">
                        Supports Bloomberg, TradingView, or proprietary dashboard exports.
                        Max size: 10MB / PNG, JPG.
                    </p>
                </div>
            )}

            {state === 'extracting' && (
                <div className="aspect-video max-w-3xl mx-auto border border-[#262626] bg-[#0d0d0d] rounded-lg flex flex-col items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" />
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Extracting Patterns</h3>
                        <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.2em] space-y-1">
                            <div className="animate-pulse">Analyzing Canvas Geometry...</div>
                            <div className="opacity-60">Mapping Candlestick Intervals...</div>
                        </div>
                    </div>
                </div>
            )}

            {state === 'review' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Source Image Preview</h4>
                            <button className="text-[10px] font-mono text-cyan-500 uppercase" onClick={() => setState('idle')}>Re-upload</button>
                        </div>
                        <div className="aspect-video bg-[#121212] border border-[#262626] rounded overflow-hidden relative group">
                            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                <ImageIcon size={48} className="text-gray-700" />
                            </div>
                            <div className="absolute inset-0 border-2 border-cyan-500/30 mix-blend-overlay" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-sm flex gap-3">
                                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                                <div className="text-[10px] text-gray-400">OCR Confidence: 99.4%</div>
                            </div>
                            <div className="flex-1 bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-sm flex gap-3">
                                <FileSearch size={14} className="text-cyan-500 mt-0.5" />
                                <div className="text-[10px] text-gray-400">Nodes Extracted: 14</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Extracted Strategy Nodes</h4>
                        <div className="bg-[#121212] border border-[#262626] rounded overflow-hidden">
                            <table className="w-full text-[10px] font-mono text-left">
                                <thead className="bg-[#0d0d0d] border-b border-[#262626]">
                                    <tr>
                                        <th className="p-3 text-gray-500 uppercase">Input Node</th>
                                        <th className="p-3 text-gray-500 uppercase">Extracted Value</th>
                                        <th className="p-3 text-gray-500 uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1a1a1a]">
                                    {[
                                        { label: 'Timeframe', val: '1H / 60m', status: 'verified' },
                                        { label: 'MA(50)', val: '184.22', status: 'verified' },
                                        { label: 'Volume Spike', val: '+210% (T-1)', status: 'flag' },
                                        { label: 'RSI Trigger', val: '64.5', status: 'verified' },
                                    ].map((n, i) => (
                                        <tr key={i} className="hover:bg-white/[0.01]">
                                            <td className="p-3 text-gray-400 uppercase">{n.label}</td>
                                            <td className="p-3 text-white font-bold">{n.val}</td>
                                            <td className="p-3 text-right">
                                                {n.status === 'verified' ? (
                                                    <span className="text-emerald-500">OK</span>
                                                ) : (
                                                    <AlertCircle size={10} className="text-amber-500 inline" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="w-full py-3 bg-cyan-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 shadow-xl transition-all">Confirm & Lock Schema</button>
                    </div>
                </div>
            )}
        </div>
    );
};
