import type { ReactNode } from 'react';
import { useTheme } from '@/core/theme';

interface SectionHeaderProps {
    title: string;
    description: string;
    icon?: ReactNode;
}

export const SectionHeader = ({ title, description, icon }: SectionHeaderProps) => {
    const { colors, typography } = useTheme();

    return (
        <div className="flex items-start gap-4 mb-8">
            {icon && (
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-primary/20">
                    {icon}
                </div>
            )
            }
            <div>
                <h2 style={{ ...typography.h3, color: colors.text.primary, marginBottom: '4px' }}>{title}</h2>
                <p style={{ ...typography.caption, color: colors.text.muted, maxWidth: '600px', lineHeight: '1.6' }}>
                    {description}
                </p>
            </div>
        </div >
    );
};
