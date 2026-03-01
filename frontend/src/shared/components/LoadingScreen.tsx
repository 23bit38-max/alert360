import { Activity } from 'lucide-react';
import { GlobalStyles } from '@/core/theme';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen = ({ message = "Synchronizing Secure Archives..." }: LoadingScreenProps) => {
    return (
        <div style={GlobalStyles.pageContainer} className="flex flex-col items-center justify-center min-h-[60vh]">
            <Activity className="animate-spin text-primary mb-4" size={32} />
            <span className="text-white/50 animate-pulse font-black uppercase tracking-widest text-[10px]">
                {message}
            </span>
        </div>
    );
};
