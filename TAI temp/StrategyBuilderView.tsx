import React, { useState } from 'react';
import { Plus, Trash2, Save, Play, ChevronRight, Settings2, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { StrategyRule } from '../types';

export const StrategyBuilderView: React.FC = () => {
    const [rules] = useState<StrategyRule[]>([
        { id: 1, pillar: 'FLOW', logic: 'Premium > $1,000,000', sentiment: 'BULLISH' },
        { id: 2, pillar: 'TA', logic: 'RSI(14) < 30', sentiment: 'BULLISH' },
    ]);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-white mb-1">Strategy Builder</h2>
                    <p className="text-xs text-gray-400">Combine pillars into deterministic, versioned trading strategies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] rounded-sm text-[10px] font-mono text-gray-400 hover:text-white transition-colors uppercase">
                        <Save size={14} />
                        Save Version
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-cyan-500 transition-all shadow-lg active:scale-95">
                        <Play size={14} fill="currentColor" />
                        Run Backtest
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Rule Construction */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#121212] border border-[#262626] rounded-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between">
                            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Active Constraints</span>
                            <button className="text-[10px] font-mono text-cyan-500 flex items-center gap-2">
                                <Plus size={12} /> Add Rule
                            </button>
                        </div>
                        <div className="divide-y divide-[#1a1a1a]">
                            {rules.map((rule: StrategyRule, idx: number) => (
                                <div key={rule.id} className="p-6 flex items-center gap-6 group">
                                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-mono text-[10px] text-gray-500">{idx + 1}</div>
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-mono text-gray-600 uppercase">Pillar</label>
                                            <div className="px-3 py-2 bg-[#0d0d0d] border border-[#262626] text-xs font-mono text-cyan-400">{rule.pillar}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-mono text-gray-600 uppercase">Logic</label>
                                            <div className="px-3 py-2 bg-[#0d0d0d] border border-[#262626] text-xs font-mono text-white">{rule.logic}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-mono text-gray-600 uppercase">Sentiment</label>
                                            <div className={clsx(
                                                "px-3 py-2 bg-[#0d0d0d] border border-[#262626] text-xs font-mono",
                                                rule.sentiment === 'BULLISH' ? 'text-emerald-500' : 'text-ruby-500'
                                            )}>{rule.sentiment}</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-700 hover:text-ruby-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-[#0a0a0a] border border-[#262626] border-dashed rounded-md flex flex-col items-center justify-center py-12 text-center group cursor-pointer hover:border-cyan-500/50 transition-all">
                        <div className="p-4 rounded-full bg-[#121212] border border-[#262626] text-gray-600 mb-4 group-hover:text-cyan-500 transition-colors">
                            <Plus size={24} />
                        </div>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Append Rule via Natural Language Suggestion</p>
                    </div>
                </div>

                {/* Right: Risk Controls */}
                <div className="space-y-6">
                    <div className="card space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings2 size={16} className="text-cyan-500" />
                            <h3 className="text-sm font-bold text-white uppercase font-mono">Risk Controls</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Max Drawdown', val: '5.0%', hint: 'Hard halt on equity drop' },
                                { label: 'Position Size', val: '2.5%', hint: 'Max cap per deterministic trade' },
                                { label: 'Audit Level', val: 'MAX', hint: 'Log all provenance steps' },
                            ].map(risk => (
                                <div key={risk.label} className="space-y-1.5 p-3 rounded bg-[#0d0d0d] border border-[#262626]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-gray-400 uppercase">{risk.label}</span>
                                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{risk.val}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-600 italic">Target: {risk.hint}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[#262626] space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded">
                                <Info size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] text-gray-400 leading-normal">
                                    Strategies are locked to their version hash. Any modification creates a new fork.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-[#262626] p-4 rounded-sm">
                        <div className="text-[10px] font-mono text-gray-500 uppercase mb-4 tracking-widest">Strategy Provenance</div>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-gray-400">v0.1.2-ALPHA</span>
                            <ChevronRight size={10} className="text-gray-700" />
                            <span className="text-cyan-400 font-bold">CURRENT_LOCK</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
