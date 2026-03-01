import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { VolumeX, Clock } from 'lucide-react';
import { GlobalStyles } from '@/core/theme';

interface QuickMuteCardProps {
    isMobile: boolean;
    colors: any;
    typography: any;
    onMuteAll: (duration: number) => void;
}

export const QuickMuteCard = ({ isMobile, colors, typography, onMuteAll }: QuickMuteCardProps) => {
    return (
        <Card style={GlobalStyles.card}>
            <CardHeader>
                <CardTitle style={{ ...typography.body, fontWeight: '700', color: colors.text.primary }} className="flex items-center">
                    <VolumeX className="w-5 h-5 mr-2" />
                    Quick Mute
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMuteAll(15)}
                        className="border-amber-500/50 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        15 Minutes
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMuteAll(60)}
                        className="border-amber-500/40 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        1 Hour
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMuteAll(480)}
                        className="border-red-500/50 text-red-500 bg-red-500/10 hover:bg-red-500/20"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        8 Hours
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
