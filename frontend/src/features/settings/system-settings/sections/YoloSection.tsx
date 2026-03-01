import { useEffect } from 'react';
import { useTheme, GlobalStyles } from '@/core/theme';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Separator } from '@/shared/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Cpu, Zap, Activity, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/features/settings/system-settings/components/SectionHeader';
import { SettingCard } from '@/features/settings/system-settings/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { YoloSettings } from '@/features/settings/system-settings/types/index';

interface YoloSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

const initialSettings: YoloSettings = {
    confidence: 0.75,
    detectionInterval: 2,
    batchSize: 4,
    gpuAcceleration: true,
    modelVersion: 'v8n'
};

export const YoloSection = ({ onDirtyChange }: YoloSectionProps) => {
    const { colors, typography } = useTheme();
    const { currentData, isDirty, updateField } = useUnsavedChanges<YoloSettings>(initialSettings);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-6">
            <SectionHeader
                title="AI Detection Configuration"
                description="Fine-tune the YOLOv8 neural engine for optimal detection accuracy and performance."
                icon={<Cpu size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard
                        title="NEURAL ENGINE PARAMETERS"
                        tooltip="These parameters control how the AI interprets visual data. Higher confidence reduces false positives but may miss subtle incidents."
                    >
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label style={typography.caption}>CONFIDENCE THRESHOLD (DETECTION)</Label>
                                    <span style={{ color: colors.accent.primary, fontWeight: 'bold' }}>{(currentData.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <Slider
                                    value={[currentData.confidence]}
                                    max={1} min={0.1} step={0.05}
                                    onValueChange={([val]) => updateField('confidence', val)}
                                    className="py-4"
                                />
                                <div className="flex justify-between" style={{ ...typography.caption, fontSize: '10px', opacity: 0.5 }}>
                                    <span className="uppercase">High Sensitivity</span>
                                    <span className="uppercase">Balanced</span>
                                    <span className="uppercase">Strict Verification</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label style={typography.caption}>PROCESSING INTERVAL (SEC)</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            value={currentData.detectionInterval}
                                            onChange={(e) => updateField('detectionInterval', parseInt(e.target.value))}
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}
                                            className="h-10 rounded-lg text-white font-mono"
                                        />
                                        <span style={typography.caption} className="text-zinc-500">sec</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 italic">Frequency of full frame inference</p>
                                </div>

                                <div className="space-y-3">
                                    <Label style={typography.caption}>ENGINE ARCHITECTURE</Label>
                                    <Select
                                        value={currentData.modelVersion}
                                        onValueChange={(val) => updateField('modelVersion', val)}
                                    >
                                        <SelectTrigger style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }} className="h-10 rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="v8n">YOLOv8 Nano (Speed Optimized)</SelectItem>
                                            <SelectItem value="v8s">YOLOv8 Small (Balanced)</SelectItem>
                                            <SelectItem value="v8m">YOLOv8 Medium (Precision)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-zinc-500 italic">Heavier models require more VRAM</p>
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard title="BATCH PROCESSING" tooltip="Larger batches improve throughput but increase latency.">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span style={typography.body} className="text-sm font-semibold">Multiple Stream Batching</span>
                                    <Switch checked={currentData.batchSize > 1} />
                                </div>
                                <div className="space-y-2">
                                    <Label style={typography.caption}>MAX BATCH SIZE</Label>
                                    <Select
                                        value={currentData.batchSize.toString()}
                                        onValueChange={(val) => updateField('batchSize', parseInt(val))}
                                    >
                                        <SelectTrigger className="glass border-white/5 h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="1">1 (Single Stream)</SelectItem>
                                            <SelectItem value="4">4 (Standard)</SelectItem>
                                            <SelectItem value="8">8 (High Density)</SelectItem>
                                            <SelectItem value="16">16 (Cluster Mode)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </SettingCard>

                        <SettingCard title="EDGE COMPUTING" description="Optimization for local hardware.">
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-white">TensorRT Optimization</p>
                                        <p className="text-[11px] text-zinc-500">Enable NVIDIA acceleration</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-white">Quantization (INT8)</p>
                                        <p className="text-[11px] text-zinc-500">Reduce model size by 4x</p>
                                    </div>
                                    <Switch checked={false} />
                                </div>
                            </div>
                        </SettingCard>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card style={GlobalStyles.card} className="overflow-hidden border-white/5 bg-gradient-to-br from-white/10 to-transparent">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engine Stats</h3>
                                    <p className="text-[10px] text-emerald-500 font-black">SYSTEM OPTIMIZED</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GPU Load</span>
                                        <span className="text-[10px] font-bold text-white">42%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[42%]" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">VRAM Usage</span>
                                        <span className="text-[10px] font-bold text-white">2.4 / 8.0 GB</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[30%]" />
                                    </div>
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Inference</p>
                                        <p className="text-lg font-black text-white">12ms</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">FPS</p>
                                        <p className="text-lg font-black text-white">84</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <SettingCard title="HARDWARE ACCELERATION">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">CUDA Cores</p>
                                    <p className="text-[10px] text-zinc-500">NVIDIA Acceleration</p>
                                </div>
                            </div>
                            <Switch checked={currentData.gpuAcceleration} onCheckedChange={(val) => updateField('gpuAcceleration', val)} />
                        </div>
                    </SettingCard>

                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                            <div>
                                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">Hardware Warning</p>
                                <p className="text-[10px] text-amber-500/70 leading-relaxed">
                                    Switching to CPU inference will significantly decrease detection speed and increase system latency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
