import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Share2, Link2, ExternalLink, Cloud, Terminal, Code2 } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { IntegrationSettings } from '@/features/settings/system-settings/types/index';
import { useEffect } from 'react';

interface IntegrationsSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: IntegrationSettings = {
    webhookUrl: 'https://hooks.emergency-response.io/v1/alerts',
    apiKey: 'sk_live_••••••••••••••••••••',
    cloudStorageEnabled: true,
    externalLogServer: 'syslog.cluster.internal:514',
};

export const IntegrationsSection = ({ onDirtyChange }: IntegrationsSectionProps) => {
    const { currentData, isDirty, updateField } = useUnsavedChanges<IntegrationSettings>(initialSettings);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="External Integrations"
                description="Connect your detection cluster to third-party services and emergency response networks."
                icon={<Share2 size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="WEBHOOKS & API">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Alert Destination (Webhook URL)</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Link2 size={14} className="absolute left-3 top-3 text-zinc-500" />
                                        <Input
                                            value={currentData.webhookUrl}
                                            onChange={(e) => updateField('webhookUrl', e.target.value)}
                                            className="glass border-white/5 pl-10"
                                        />
                                    </div>
                                    <Button variant="outline" className="glass border-white/5 font-bold text-[10px] uppercase">Test Ping</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Cluster API Key</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Code2 size={14} className="absolute left-3 top-3 text-zinc-500" />
                                        <Input
                                            type="password"
                                            value={currentData.apiKey}
                                            onChange={(e) => updateField('apiKey', e.target.value)}
                                            className="glass border-white/5 pl-10"
                                        />
                                    </div>
                                    <Button variant="outline" className="glass border-white/5 font-bold text-[10px] uppercase">Rotate</Button>
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="CLOUD SYNCHRONIZATION" description="Back up incident evidence to centralized storage.">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Cloud size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Secure Cloud Archive</h4>
                                        <p className="text-[11px] text-zinc-500">Auto-upload 4K evidence clips to encrypted storage.</p>
                                    </div>
                                </div>
                                <Switch checked={currentData.cloudStorageEnabled} onCheckedChange={(val) => updateField('cloudStorageEnabled', val)} />
                            </div>

                            <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/50">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Storage Health</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-white">AWS S3 (Region: us-east-1)</span>
                                    <span className="text-xs text-emerald-500 font-bold">CONNECTED</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[68%]" />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">842.1 GB / 1.2 TB</span>
                                    <ExternalLink size={10} className="text-zinc-500" />
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="LOGGING INFRASTRUCTURE">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Remote Syslog Server</Label>
                                <div className="relative">
                                    <Terminal size={14} className="absolute left-3 top-3 text-zinc-500" />
                                    <Input
                                        value={currentData.externalLogServer}
                                        onChange={(e) => updateField('externalLogServer', e.target.value)}
                                        className="glass border-white/5 pl-10 text-[11px] font-mono"
                                    />
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Active Plugins</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Slack', 'PagerDuty', 'LogDNA'].map(p => (
                                        <span key={p} className="px-2 py-1 rounded-md bg-white/5 text-[9px] text-white font-bold">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
