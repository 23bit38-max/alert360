import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Settings, Globe, Clock, Construction } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { SystemConfig } from '@/features/settings/system-settings/types/index';
import { useEffect } from 'react';

interface SystemSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: SystemConfig = {
    siteName: 'Alert360 Detection Cluster',
    timezone: 'UTC +05:30',
    language: 'en-US',
    maintenanceMode: false,
};

export const SystemSection = ({ onDirtyChange }: SystemSectionProps) => {
    const { currentData, isDirty, updateField } = useUnsavedChanges<SystemConfig>(initialSettings);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="System Configuration"
                description="Global environment variables and cluster-wide parameters."
                icon={<Settings size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="IDENTITY">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Node / Site Name</Label>
                                <Input
                                    value={currentData.siteName}
                                    onChange={(e) => updateField('siteName', e.target.value)}
                                    className="glass border-white/5 h-12"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Primary Language</Label>
                                    <Select
                                        value={currentData.language}
                                        onValueChange={(val) => updateField('language', val)}
                                    >
                                        <SelectTrigger className="glass border-white/5 h-10">
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-zinc-500" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="en-US">English (US)</SelectItem>
                                            <SelectItem value="es-ES">Spanish</SelectItem>
                                            <SelectItem value="de-DE">German</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Timezone</Label>
                                    <Select
                                        value={currentData.timezone}
                                        onValueChange={(val) => updateField('timezone', val)}
                                    >
                                        <SelectTrigger className="glass border-white/5 h-10">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-zinc-500" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="UTC +05:30">(UTC +05:30) Mumbai</SelectItem>
                                            <SelectItem value="UTC +00:00">(UTC +00:00) London</SelectItem>
                                            <SelectItem value="UTC -05:00">(UTC -05:00) New York</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="ENVIRONMENT CONTROL">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                        <Construction size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Maintenance Mode</h4>
                                        <p className="text-[11px] text-zinc-500">Disable all non-essential API endpoints for updates.</p>
                                    </div>
                                </div>
                                <Switch checked={currentData.maintenanceMode} onCheckedChange={(val) => updateField('maintenanceMode', val)} />
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="UI PREVIEW">
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Sidebar Layout</p>
                                    <p className="text-[11px] text-zinc-500">Auto-collapse on scroll</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
