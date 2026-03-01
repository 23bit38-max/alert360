import type { ReactNode } from 'react';
import { useTheme } from '@/core/theme';

interface SectionHeaderProps {
    title: string;
    description?: string;
    icon?: ReactNode;
}

export const SectionHeader = ({ title, description, icon }: SectionHeaderProps) => {
    const { typography, colors } = useTheme();

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
                {icon && <div style={{ color: colors.accent.primary }}>{icon}</div>}
                <h2 style={{ ...typography.h3, margin: 0 }}>{title}</h2>
            </div>
            {description && (
                <p style={{ ...typography.caption, color: colors.text.muted, fontSize: '14px' }}>
                    {description}
                </p>
            )}
        </div>
    );
};
