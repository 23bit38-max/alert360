import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Database, HardDrive, FileText, Trash2, History, RotateCw } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { DataManagementSettings } from '@/features/settings/system-settings/types/index';
import { useEffect } from 'react';

interface DataSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: DataManagementSettings = {
    autoArchiveDays: 30,
    dataRetentionPeriod: 90,
    compactDatabaseOnExit: true,
};

export const DataSection = ({ onDirtyChange }: DataSectionProps) => {
    const { currentData, isDirty, updateField } = useUnsavedChanges<DataManagementSettings>(initialSettings);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Data Management"
                description="Optimize database performance and configure long-term evidence retention policies."
                icon={<Database size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="RETENTION POLICIES">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <History size={14} className="text-zinc-500" />
                                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Auto-Archive After</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            value={currentData.autoArchiveDays}
                                            onChange={(e) => updateField('autoArchiveDays', parseInt(e.target.value))}
                                            className="glass border-white/5 h-10 w-24 font-bold"
                                        />
                                        <span className="text-sm text-zinc-500">Days</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic">Move clips to low-cost storage</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trash2 size={14} className="text-zinc-500" />
                                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Permanent Deletion After</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            value={currentData.dataRetentionPeriod}
                                            onChange={(e) => updateField('dataRetentionPeriod', parseInt(e.target.value))}
                                            className="glass border-white/5 h-10 w-24 font-bold"
                                        />
                                        <span className="text-sm text-zinc-500">Days</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic">Irreversible wipe of all metadata</p>
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="DATABASE OPTIMIZATION" description="Fine-tune local storage performance for high-traffic environments.">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                                        <RotateCw size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Auto-Compact Registry</h4>
                                        <p className="text-[11px] text-zinc-500">Optimize internal SQLite indexes on system shutdown.</p>
                                    </div>
                                </div>
                                <Switch checked={currentData.compactDatabaseOnExit} onCheckedChange={(val) => updateField('compactDatabaseOnExit', val)} />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                                <Button variant="outline" className="flex-1 glass border-white/5 h-12 text-[10px] font-black uppercase tracking-widest">
                                    Vacuum Database Now
                                </Button>
                                <Button variant="outline" className="flex-1 glass border-rose-500/20 text-rose-500 hover:bg-rose-500/5 h-12 text-[10px] font-black uppercase tracking-widest">
                                    Purge Temporary Buffers
                                </Button>
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="STORAGE OVERVIEW">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/5">
                                <HardDrive className="text-primary mt-1" size={24} />
                                <div className="space-y-2 flex-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Local High-Speed Cache (SSD)</p>
                                    <p className="text-xl font-black text-white">428.4 GB <span className="text-[10px] text-zinc-500 font-medium">Free</span></p>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[78%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-zinc-500" />
                                        <span className="text-zinc-400">Database Indexes</span>
                                    </div>
                                    <span className="text-white font-mono">1.2 GB</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-zinc-500" />
                                        <span className="text-zinc-400">Cached Thumbnails</span>
                                    </div>
                                    <span className="text-white font-mono">14.8 GB</span>
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
