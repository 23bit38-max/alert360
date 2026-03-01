import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Shield, Lock, Key, Smartphone, Globe } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { SecuritySettings } from '@/features/settings/system-settings/types/index';
import { useEffect, useState } from 'react';

interface SecuritySectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: SecuritySettings = {
    twoFactorEnabled: true,
    sessionTimeout: 30,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    lastPasswordChange: '2024-12-15',
};

export const SecuritySection = ({ onDirtyChange }: SecuritySectionProps) => {
    const { currentData, isDirty, updateField } = useUnsavedChanges<SecuritySettings>(initialSettings);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Security & Access Control"
                description="Monitor system access and configure authentication protocols for high-security environments."
                icon={<Shield size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="AUTHENTICATION">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Two-Factor Authentication (2FA)</h4>
                                        <p className="text-[11px] text-zinc-500">Secure your account with an additional verification layer.</p>
                                    </div>
                                </div>
                                <Switch checked={currentData.twoFactorEnabled} onCheckedChange={(val) => updateField('twoFactorEnabled', val)} />
                            </div>

                            {!showPasswordFields ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 glass border-white/10 text-white font-bold tracking-wider"
                                    onClick={() => setShowPasswordFields(true)}
                                >
                                    <Key size={14} className="mr-2 opacity-50" /> CHANGE MASTER PASSWORD
                                </Button>
                            ) : (
                                <div className="space-y-4 p-4 rounded-xl border border-white/5 bg-white/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Current Password</Label>
                                            <Input type="password" placeholder="••••••••" className="glass border-white/5" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">New Password</Label>
                                            <Input type="password" placeholder="••••••••" className="glass border-white/5" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="ghost" size="sm" onClick={() => setShowPasswordFields(false)}>Cancel</Button>
                                        <Button size="sm" className="bg-primary text-white">Save Password</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SettingCard>

                    <SettingCard title="ACCESS CONTROL" tooltip="Restrict access to specific IP ranges or geographical locations.">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">IP Whitelist</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {currentData.ipWhitelist.map((ip, i) => (
                                        <div key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono flex items-center gap-2">
                                            {ip}
                                            <button className="hover:text-white transition-colors" onClick={() => {
                                                const next = [...currentData.ipWhitelist];
                                                next.splice(i, 1);
                                                updateField('ipWhitelist', next);
                                            }}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter IP Address (e.g. 192.168.1.1)" className="glass border-white/5" />
                                    <Button variant="outline" className="glass border-white/5">Add</Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">Require VPN</p>
                                        <p className="text-[11px] text-zinc-500">Only allow access via corporate VPN networks</p>
                                    </div>
                                    <Switch checked={false} />
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="SECURITY LOGS">
                        <div className="space-y-4">
                            <div className="flex gap-3 pb-4 border-b border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-white font-bold">New Login: London, UK</p>
                                    <p className="text-[10px] text-zinc-500">MacBook Pro • Safari • 2h ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pb-4 border-b border-white/5 opacity-50">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-white font-bold">Password Changed</p>
                                    <p className="text-[10px] text-zinc-500">2024-12-15 • 14:22</p>
                                </div>
                            </div>
                            <Button variant="link" className="text-primary text-[10px] font-bold uppercase p-0 h-auto">View Full Audit Log</Button>
                        </div>
                    </SettingCard>

                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <div className="flex items-center gap-3 mb-3">
                            <Lock className="text-indigo-500" size={18} />
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Session Security</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Auto-Lock (Min)</Label>
                                    <span className="text-[10px] text-indigo-400 font-bold">{currentData.sessionTimeout}m</span>
                                </div>
                                <Input
                                    type="range"
                                    min="5" max="120" step="5"
                                    value={currentData.sessionTimeout}
                                    onChange={(e) => updateField('sessionTimeout', parseInt(e.target.value))}
                                    className="h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                            <Button variant="outline" className="w-full glass border-white/10 text-[10px] font-black uppercase tracking-widest h-9">
                                Sign Out All Devices
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
