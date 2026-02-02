import React from 'react';
import { Shield, Activity, Database, Globe, Zap, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const StatusView: React.FC = () => {
    const services = [
        { name: 'Supabase Database', status: 'OPERATIONAL', latency: '42ms', uptime: '99.99%', icon: <Database size={16} /> },
        { name: 'Render Backend', status: 'OPERATIONAL', latency: '128ms', uptime: '99.95%', icon: <Zap size={16} /> },
        { name: 'Polygon Market Data', status: 'OPERATIONAL', latency: '8ms', uptime: '100%', icon: <Activity size={16} /> },
        { name: 'Audit Log Engine', status: 'OPERATIONAL', latency: '15ms', uptime: '100%', icon: <Shield size={16} /> },
        { name: 'AI Summarization Support', status: 'DEGRADED', latency: '1.2s', uptime: '98.2%', icon: <Globe size={16} /> },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-extrabold text-white mb-1">System Status</h2>
                <p className="text-xs text-gray-400">Real-time monitoring of all deterministic and probabilistic service layers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121212] border border-[#262626] rounded-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#262626] bg-[#0d0d0d]">
                        <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Service Availability</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {services.map((service) => (
                            <div key={service.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "p-2 rounded-sm",
                                        service.status === 'OPERATIONAL' ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"
                                    )}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase">{service.name}</div>
                                        <div className="text-[9px] font-mono text-gray-500 tracking-tighter">Last Ping: 2m ago</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={clsx(
                                        "text-[10px] font-mono font-bold",
                                        service.status === 'OPERATIONAL' ? "text-emerald-500" : "text-amber-500"
                                    )}>{service.status}</div>
                                    <div className="text-[9px] font-mono text-gray-600">{service.latency} / {service.uptime}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#121212] border border-[#262626] p-6 rounded-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-500/10 rounded-sm text-cyan-400">
                                <Clock size={16} />
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase font-mono">Incident History</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { date: 'May 22', msg: 'AI Summarization latency increase due to upstream provider.' },
                                { date: 'May 18', msg: 'Scheduled maintenance on Render worker nodes. Zero downtime.' },
                                { date: 'May 12', msg: 'Polygon API key rotation completed successfully.' },
                            ].map((incident, i) => (
                                <div key={i} className="flex gap-4 border-l border-[#262626] pl-4 py-1">
                                    <span className="text-[9px] font-mono text-gray-600 uppercase shrink-0">{incident.date}</span>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">{incident.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded border border-cyan-500/20 bg-cyan-500/5 flex gap-4">
                        <Activity size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-[11px] font-bold text-cyan-400 uppercase mb-1">Automatic Failover Active</div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                System will automatically switch to backup Polygon endpoints if latency exceeds 500ms for more than 3 consecutive pings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
