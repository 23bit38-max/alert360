import React from 'react';
import { Activity, ShieldAlert, Wifi, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UploadStats } from '../types';

interface StatsOverviewProps {
    stats: UploadStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
                {
                    label: 'Data Processed',
                    value: stats.totalUploads.toLocaleString().padStart(2, '0'),
                    icon: Activity,
                    color: 'primary',
                    glow: 'rgba(16,185,129,0.3)'
                },
                {
                    label: 'Anomalies Detected',
                    value: stats.accidentsDetected.toLocaleString().padStart(2, '0'),
                    icon: ShieldAlert,
                    color: 'red-500',
                    glow: 'rgba(239,68,68,0.3)'
                },
                {
                    label: 'Engine Precision',
                    value: '98.5%',
                    icon: Zap,
                    color: 'blue-400',
                    glow: 'rgba(96,165,250,0.3)'
                },
                {
                    label: 'Core Status',
                    value: 'ONLINE',
                    icon: Wifi,
                    color: 'amber-500',
                    glow: 'rgba(245,158,11,0.3)',
                    isOnline: true
                }
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass border-white/5 rounded-[24px] p-6 flex items-center gap-5 premium-shadow hover:scale-[1.03] transition-all duration-500 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    <div
                        className={`w-14 h-14 rounded-2xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}
                        style={{ boxShadow: `0 0 20px ${item.glow}` }}
                    >
                        <item.icon className={`w-7 h-7 text-${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-1">{item.label}</h4>
                        <div className="flex items-center gap-2">
                            {item.isOnline && <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                            <motion.p
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={`text-2xl font-black text-white tracking-tighter ${item.isOnline ? 'text-primary' : ''}`}
                            >
                                {item.value}
                            </motion.p>
                        </div>
                    </div>
                    {/* Subtle accent border on hover */}
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-${item.color} transition-all duration-500 group-hover:w-full`} />
                </motion.div>
            ))}
        </div>
    );
};
