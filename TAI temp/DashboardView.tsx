import React from 'react';
import { ShieldCheck, Zap, Activity, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RunData } from '../types';


export const DashboardView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Total Runs</span>
                        <Activity size={16} className="text-gray-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-display font-medium text-white">1,284</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                            <ArrowUpRight size={12} />
                            <span>+12.5%</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Active Protocols</span>
                        <Zap size={16} className="text-[var(--accent-glow)]" />
                    </div>
                    <div>
                        <div className="text-3xl font-display font-medium text-white">12</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                            <ArrowUpRight size={12} />
                            <span>Optimal</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Avg Confidence</span>
                        <ShieldCheck size={16} className="text-gray-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-display font-medium text-white">94.2%</div>
                        <div className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                            <ArrowDownRight size={12} />
                            <span>-0.8%</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">System Uptime</span>
                        <Clock size={16} className="text-gray-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-display font-medium text-white">99.9%</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <span>Last 30 days</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed (Intelligence Hub) */}
                <GlassCard className="lg:col-span-2 p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-display font-medium text-white">Intelligence Hub</h3>
                        <button className="text-xs text-gray-500 hover:text-[var(--accent-glow)] transition-colors">View Full Log</button>
                    </div>

                    <div className="space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-glass-stroke text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="col-span-3">Timestamp</div>
                            <div className="col-span-4">System ID</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-2 text-right">Conf.</div>
                        </div>

                        {/* Rows */}
                        {([
                            { time: '10:42 AM', id: 'TAI-A92', status: 'COMPLETED', conf: '94.2%' },
                            { time: '10:15 AM', id: 'TAI-B31', status: 'COMPLETED', conf: '88.7%' },
                            { time: '09:30 AM', id: 'TAI-C08', status: 'FAILED', conf: '---' },
                            { time: '09:12 AM', id: 'TAI-D14', status: 'COMPLETED', conf: '91.4%' },
                            { time: '08:45 AM', id: 'TAI-E22', status: 'COMPLETED', conf: '96.1%' },
                        ] as RunData[]).map((run, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-white/[0.02] rounded-lg transition-colors items-center group cursor-pointer border border-transparent hover:border-glass-stroke">
                                <div className="col-span-3 text-sm text-gray-400 font-mono">{run.time}</div>
                                <div className="col-span-4 text-sm font-medium text-white font-mono group-hover:text-[var(--accent-glow)] transition-colors">
                                    {run.id}
                                </div>
                                <div className="col-span-3">
                                    <StatusBadge
                                        status={run.status === 'COMPLETED' ? 'success' : 'error'}
                                        label={run.status}
                                        pulse={run.status === 'COMPLETED'}
                                    />
                                </div>
                                <div className="col-span-2 text-right text-sm font-bold text-gray-500 group-hover:text-white font-mono">
                                    {run.conf}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Right Column: Protocol Health */}
                <div className="flex flex-col gap-6">
                    <GlassCard className="p-6" gradient>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-medium text-white">System Nominal</h3>
                                <p className="text-xs text-gray-400">All guards active and passing.</p>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            {['Execution Guard', 'Risk Limiter', 'Data Integrity'].map(item => (
                                <div key={item} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">{item}</span>
                                    <StatusBadge status="success" label="Active" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 flex-1 bg-gradient-to-b from-[var(--bg-panel)] to-[var(--bg-charcoal)]">
                        <h3 className="text-base font-medium text-white mb-4">Active Strategy Distribution</h3>
                        <div className="flex items-center justify-center h-[140px] text-gray-600 text-xs italic border border-dashed border-glass-stroke rounded-lg">
                            Chart Placeholder
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
