import type { ReactNode } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useTheme, GlobalStyles } from '@/core/theme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Info } from 'lucide-react';

interface SettingCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    tooltip?: string;
}

export const SettingCard = ({ title, description, children, tooltip }: SettingCardProps) => {
    const { colors, typography } = useTheme();

    return (
        <Card style={GlobalStyles.card} className="border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden group hover:border-white/10 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <h3 style={{ ...typography.caption, color: colors.text.muted, fontWeight: '800', letterSpacing: '0.1em' }} className="uppercase">
                        {title}
                    </h3>
                    {tooltip && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info size={12} className="text-zinc-500 hover:text-primary transition-colors cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-950 border-white/10 text-[10px] text-zinc-300 max-w-[200px]">
                                    {tooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {description && (
                    <p style={{ ...typography.caption, color: colors.text.muted, marginBottom: '24px', lineHeight: '1.6' }}>
                        {description}
                    </p>
                )}
                <div className="space-y-6">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};
