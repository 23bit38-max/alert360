import { Circle, Wifi, Lock, Radio, Clock } from 'lucide-react';

export const SystemStatus = ({ colors }: { colors: any }) => (
    <div className="flex items-center gap-4 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.background.elevated }}>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Circle size={6} color={colors.status.safe.main} fill={colors.status.safe.main} />
                <span style={{ fontSize: '10px', color: colors.text.muted }}>LIVE</span>
            </div>
            <div className="flex items-center gap-1">
                <Wifi size={12} color={colors.status.info.main} />
                <span style={{ fontSize: '10px', color: colors.text.muted }}>NETWORK</span>
            </div>
            <div className="flex items-center gap-1">
                <Lock size={12} color={colors.status.safe.main} />
                <span style={{ fontSize: '10px', color: colors.text.muted }}>SECURE</span>
            </div>
            <div className="flex items-center gap-1">
                <Radio size={12} color={colors.status.warning.main} />
                <span style={{ fontSize: '10px', color: colors.text.muted }}>STATUS</span>
            </div>
        </div>
        <div className="h-4 w-px" style={{ backgroundColor: colors.background.border }} />
        <div className="flex items-center gap-1">
            <Clock size={12} color={colors.accent.primary} />
            <span style={{ fontSize: '10px', fontWeight: 600 }}>07:36 PM</span>
            <span style={{ fontSize: '8px', color: colors.text.muted }}>LOCAL TIME</span>
        </div>
    </div>
);
