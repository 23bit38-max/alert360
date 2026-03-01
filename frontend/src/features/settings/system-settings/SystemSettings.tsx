import { useState, useEffect, useCallback } from 'react';
import { useTheme, GlobalStyles } from '@/core/theme';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { Button } from '@/shared/components/ui/button';
import {
    Shield,
    Settings,
    Database,
    Cpu,
    Palette,
    Share2,
    Save,
    RotateCcw,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

import { YoloSection } from '@/features/settings/system-settings/sections/YoloSection';
import { SecuritySection } from '@/features/settings/system-settings/sections/SecuritySection';
import { SystemSection } from '@/features/settings/system-settings/sections/SystemSection';
import { IntegrationsSection } from '@/features/settings/system-settings/sections/IntegrationsSection';
import { DataSection } from '@/features/settings/system-settings/sections/DataSection';
import { AppearanceSection } from '@/features/settings/system-settings/sections/AppearanceSection';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/shared/components/ui/dialog';

export const SystemSettings = () => {
    useTheme();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ai-detection');

    // Track dirty state per section
    const [dirtySections, setDirtySections] = useState<Record<string, boolean>>({});
    const isDirty = Object.values(dirtySections).some(v => v);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        toast.success('Settings synchronized successfully', {
            description: 'System-wide parameters have been committed to the cluster.',
        });
        setDirtySections({});
    };

    const handleReset = () => {
        toast.info('Settings restored to defaults');
        setDirtySections({});
        // In a real app, we'd trigger a reset in the child sections via a ref or state broadcast
        window.location.reload();
    };

    const handleDirtyChange = useCallback((section: string, isSectionDirty: boolean) => {
        setDirtySections(prev => {
            if (prev[section] === isSectionDirty) return prev;
            return { ...prev, [section]: isSectionDirty };
        });
    }, []);

    if (loading) {
        return <LoadingScreen message="Initializing Management Interface..." />;
    }

    const tabs = [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'ai-detection', label: 'AI Detection', icon: Cpu },
        { id: 'system', label: 'System Configuration', icon: Settings },
        { id: 'integrations', label: 'Integrations', icon: Share2 },
        { id: 'data', label: 'Data Management', icon: Database },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'security': return <SecuritySection onDirtyChange={(d) => handleDirtyChange('security', d)} />;
            case 'ai-detection': return <YoloSection onDirtyChange={(d) => handleDirtyChange('ai-detection', d)} />;
            case 'system': return <SystemSection onDirtyChange={(d) => handleDirtyChange('system', d)} />;
            case 'integrations': return <IntegrationsSection onDirtyChange={(d) => handleDirtyChange('integrations', d)} />;
            case 'data': return <DataSection onDirtyChange={(d) => handleDirtyChange('data', d)} />;
            case 'appearance': return <AppearanceSection onDirtyChange={(d) => handleDirtyChange('appearance', d)} />;
            default: return null;
        }
    };

    return (
        <div style={GlobalStyles.pageContainer} className="relative min-h-[calc(100vh-100px)]">
            {/* Compact Action Bar */}
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isDirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex items-center gap-3 p-3 glass border-white/10 rounded-[28px] shadow-2xl backdrop-blur-3xl">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-12 px-6 rounded-2xl glass border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <RotateCcw size={14} className="mr-2" /> Discard
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10">
                            <DialogHeader>
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                                    <AlertTriangle className="text-amber-500" size={24} />
                                </div>
                                <DialogTitle className="text-white">Discard Changes?</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Are you sure you want to discard all unsaved changes and revert to the last committed state?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6 gap-2">
                                <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => { }}>Cancel</Button>
                                <Button variant="destructive" onClick={handleReset}>Yes, Discard Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={handleSave}
                        className="h-12 px-8 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:scale-[1.05] transition-all"
                    >
                        <Save size={14} className="mr-2" /> Commit System Parameters
                    </Button>
                </div>
            </div>

            <div className="pt-4" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group whitespace-nowrap
                  ${activeTab === tab.id
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                        : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}
                `}
                            >
                                <tab.icon size={18} className={`${activeTab === tab.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
                                <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
                                {dirtySections[tab.id] && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shadow-[0_0_8px_rgba(16,185,129,1)]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    <div key={activeTab} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
