import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

export const LayerToggle = ({ type, label, icon: Icon, count, color, layers, setLayers }: {
    type: string;
    label: string;
    icon: any;
    count: number;
    color: string;
    layers: any;
    setLayers: any;
}) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer group"
        onClick={() => setLayers((prev: any) => ({ ...prev, [type]: !prev[type] }))}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${color}10`, color }}>
                <Icon size={14} />
            </div>
            <div>
                <Label className="text-[11px] font-black text-white/90 cursor-pointer block tracking-tight">{label}</Label>
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    {count} Sensors
                </span>
            </div>
        </div>
        <Switch checked={layers[type]} className="scale-75 data-[state=checked]:bg-primary pointer-events-none" />
    </div>
);
