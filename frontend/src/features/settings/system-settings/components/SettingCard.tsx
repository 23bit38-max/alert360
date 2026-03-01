import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTheme, GlobalStyles } from '@/core/theme';
import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/components/ui/tooltip';

interface SettingCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    tooltip?: string;
}

export const SettingCard = ({ title, description, children, tooltip }: SettingCardProps) => {
    const { typography, colors } = useTheme();

    return (
        <Card style={GlobalStyles.card} className="overflow-hidden border-white/5 bg-white/5 backdrop-blur-md">
            <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle style={{ ...typography.label, fontSize: '12px', letterSpacing: '0.05em' }} className="flex items-center gap-2">
                        {title}
                        {tooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info size={14} className="text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 border-white/10 text-white text-[11px] max-w-[200px]">
                                        <p>{tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardTitle>
                </div>
                {description && (
                    <p style={{ ...typography.caption, color: colors.text.muted, marginTop: '4px' }}>
                        {description}
                    </p>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {children}
            </CardContent>
        </Card>
    );
};
