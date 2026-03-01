import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle, AlertTriangle, Activity, Radio, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, colors }: { status: string, colors: any }) => {
    const s = (status || 'active').toLowerCase();
    const config: Record<string, { icon: any, color: string, bg: string }> = {
        resolved: { icon: CheckCircle, color: colors.status.safe.main, bg: colors.status.safe.soft },
        escalated: { icon: AlertTriangle, color: colors.status.critical.main, bg: colors.status.critical.soft },
        active: { icon: Activity, color: colors.status.critical.main, bg: colors.status.critical.soft },
        responding: { icon: Radio, color: colors.status.warning.main, bg: colors.status.warning.soft },
        dismissed: { icon: XCircle, color: colors.text.muted, bg: colors.background.app }
    };
    const item = config[s] || config.active;
    const Icon = item.icon;

    return (
        <Badge style={{
            backgroundColor: item.bg,
            color: item.color,
            border: 'none',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '20px'
        }}>
            <Icon size={12} /> {s.toUpperCase()}
        </Badge>
    );
};

export const TypeBadge = ({ type, colors, accent }: { type: string, colors: any, accent: any }) => {
    const t = (type || 'other').toLowerCase();
    const typeColors: Record<string, { bg: string, color: string }> = {
        collision: { bg: colors.status.warning.soft, color: colors.status.warning.main },
        rollover: { bg: accent.secondary + '20', color: accent.secondary },
        fire: { bg: colors.status.critical.soft, color: colors.status.critical.main },
        medical: { bg: colors.status.info.soft, color: colors.status.info.main },
        other: { bg: colors.background.elevated, color: colors.text.muted }
    };
    const item = typeColors[t] || typeColors.other;

    return (
        <Badge style={{ backgroundColor: item.bg, color: item.color, border: 'none' }}>
            {t.toUpperCase()}
        </Badge>
    );
};

export const SeverityBadge = ({ severity, colors }: { severity: string, colors: any }) => {
    const s = (severity || 'medium').toLowerCase();
    const config: Record<string, { bg: string, color: string }> = {
        critical: { bg: colors.status.critical.soft, color: colors.status.critical.main },
        high: { bg: colors.status.warning.soft, color: colors.status.warning.main },
        medium: { bg: colors.status.info.soft, color: colors.status.info.main },
        low: { bg: colors.status.safe.soft, color: colors.status.safe.main }
    };
    const item = config[s] || config.medium;

    return (
        <Badge style={{
            backgroundColor: item.bg,
            color: item.color,
            border: 'none'
        }}>
            {s.toUpperCase()}
        </Badge>
    );
};
