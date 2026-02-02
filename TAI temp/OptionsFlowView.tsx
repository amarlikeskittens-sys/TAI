import React from 'react';
import { Filter, Download, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { MOCK_FLOW_DATA } from '../utils/mockData';
import { clsx } from 'clsx';
import { FlowItem } from '../types';

export const OptionsFlowView: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-white mb-1">Options Flow</h2>
                    <p className="text-xs text-gray-400">Real-time whale tracking with deterministic sentiment tagging.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] rounded-sm text-[10px] font-mono text-gray-400 hover:text-white transition-colors uppercase">
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-lg">
                        <Filter size={14} />
                        Build Rules
                    </button>
                </div>
            </div>

            <div className="bg-[#0d0d0d] border border-[#262626] p-2 rounded-sm flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                    <input
                        type="text"
                        placeholder="FILTER BY TICKER OR SIZE"
                        className="w-full bg-[#121212] border border-[#1a1a1a] rounded-sm py-2 pl-9 pr-4 text-[11px] font-mono text-white placeholder-gray-600 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                    <span>Min Premium:</span>
                    <select className="bg-[#121212] border border-[#1a1a1a] rounded-sm px-2 py-1 text-white text-[10px]">
                        <option>$100k</option>
                        <option>$500k</option>
                        <option>$1M</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0d0d0d] border-b border-[#262626]">
                        <tr>
                            <th className="px-6 py-4 font-mono text-[10px] text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-4 font-mono text-[10px] text-gray-500 uppercase">Ticker</th>
                            <th className="px-6 py-4 font-mono text-[10px] text-gray-500 uppercase">Details</th>
                            <th className="px-6 py-4 font-mono text-[10px] text-gray-500 uppercase">Premium</th>
                            <th className="px-6 py-4 font-mono text-[10px] text-gray-500 uppercase text-right">Sentiment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                        {(MOCK_FLOW_DATA as FlowItem[]).map((row) => (
                            <tr key={row.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{row.time}</td>
                                <td className="px-6 py-4 font-mono text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{row.ticker}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            "px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold",
                                            row.type === 'CALL' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {row.type}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            ${row.strike} EXP {row.expiry}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-[10px] text-gray-200">{row.premium}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className={clsx(
                                        "inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase",
                                        row.sentiment === 'BULLISH' ? "text-emerald-500" : "text-ruby-500"
                                    )}>
                                        {row.sentiment === 'BULLISH' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {row.sentiment}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-md flex items-start gap-4">
                <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Filter className="text-amber-500" size={16} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase mb-1">AI-Assisted Tagging Active</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-2xl">
                        Whale sentiment is tagged via LLM analysis of transaction block sizes vs bid/ask spread.
                        All tags are bounded by raw polygon data and can be reproduced from the Evidence Panel.
                    </p>
                </div>
            </div>
        </div>
    );
};
