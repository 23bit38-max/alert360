import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import { type AIInsight } from '@/shared/types/dashboard';

interface AIInsightsSectionProps {
    insights: AIInsight[];
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights }) => {
    return (
        <Card className="glass border-primary/20 rounded-[40px] overflow-hidden p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative h-full flex flex-col bg-[#070B14]/40">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <CardHeader className="relative z-10 pb-10 px-0 pt-0">
                <CardTitle className="text-2xl font-black tracking-tighter text-white flex items-center gap-5 uppercase italic">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-primary/20">
                        <Zap size={28} />
                    </div>
                    Inference Analytics
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10 px-0 flex-1">
                {insights.map((insight, index) => (
                    <div key={index} className="p-6 glass border-white/5 rounded-3xl hover:bg-white/5 transition-all group border hover:border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <Badge className="bg-primary/20 text-primary border border-primary/20 text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-lg">
                                {insight.type}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
                                <span className="text-[9px] font-black text-zinc-500 tracking-[0.1em] uppercase">{insight.confidence}% MODEL CONFIDENCE</span>
                            </div>
                        </div>
                        <h5 className="text-base font-black text-white mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                            {insight.title}
                        </h5>
                        <p className="text-xs leading-relaxed text-zinc-400 font-medium tracking-wide">
                            {insight.message}
                        </p>
                    </div>
                ))}
            </CardContent>

            <div className="pt-8 relative z-10 mt-auto">
                <Button className="w-full h-14 rounded-2xl glass border-primary/30 text-primary font-black uppercase tracking-[0.3em] text-xs hover:bg-primary hover:text-white transition-all shadow-xl group">
                    Acknowledge Analysis <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    );
};
