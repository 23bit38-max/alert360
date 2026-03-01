import { Switch } from '@/shared/components/ui/switch';
import { Palette, Sun, Moon, Monitor, LayoutTemplate, Type, Maximize2 } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { AppearanceSettings } from '@/features/settings/system-settings/types/index';
import { useEffect } from 'react';

interface AppearanceSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: AppearanceSettings = {
    theme: 'dark',
    primaryColor: '#10b981',
    sidebarCollapsed: false,
    highContrastMode: false,
};

export const AppearanceSection = ({ onDirtyChange }: AppearanceSectionProps) => {
    const { currentData, isDirty, updateField } = useUnsavedChanges<AppearanceSettings>(initialSettings);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Appearance & UX"
                description="Customize the dashboard interface to match your operational requirements and lighting conditions."
                icon={<Palette size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="THEME CONFIGURATION">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Standard Light' },
                                { id: 'dark', icon: Moon, label: 'Tactical Dark' },
                                { id: 'system', icon: Monitor, label: 'System Sync' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => updateField('theme', t.id)}
                                    className={`
                    flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all group
                    ${currentData.theme === t.id
                                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                            : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/10'}
                  `}
                                >
                                    <t.icon size={28} className={currentData.theme === t.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </SettingCard>

                    <SettingCard title="ACCESSIBILITY" description="Adjust visual parameters for better clarity in adverse environments.">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                                        <Maximize2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">High Contrast Mode</h4>
                                        <p className="text-[11px] text-zinc-500">Increased legibility for hardware monitors.</p>
                                    </div>
                                </div>
                                <Switch checked={currentData.highContrastMode} onCheckedChange={(val) => updateField('highContrastMode', val)} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                                        <Type size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Compact Typography</h4>
                                        <p className="text-[11px] text-zinc-500">Increase information density by 15%.</p>
                                    </div>
                                </div>
                                <Switch checked={true} />
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="LAYOUT PREFERENCES">
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <LayoutTemplate size={16} className="text-primary" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Navigation Style</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="h-10 rounded-lg border-2 border-primary bg-primary/10 text-[10px] font-bold uppercase text-primary">Sidebar</button>
                                    <button className="h-10 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase text-zinc-500">Top Nav</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs font-semibold text-zinc-400">Accent Color</span>
                                    <div className="flex gap-1.5">
                                        {['#10b981', '#6366f1', '#f59e0b', '#ef4444'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateField('primaryColor', c)}
                                                style={{ backgroundColor: c }}
                                                className={`w-6 h-6 rounded-full border-2 ${currentData.primaryColor === c ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
