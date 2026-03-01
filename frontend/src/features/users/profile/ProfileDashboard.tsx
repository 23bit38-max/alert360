import { useState, useEffect, useCallback } from 'react';
import { useTheme, GlobalStyles } from '@/core/theme';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/core/auth/AuthContext';
import {
    User,
    BadgeCheck,
    HeartPulse,
    Save,
    RotateCcw,
    AlertTriangle,
    Eye,
    ChevronRight,
    Lock,
    LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';

import {
    GeneralSection,
    ProfessionalSection,
    SecuritySection,
    EmergencySection,
    OverviewSection
} from '@/features/users/profile/sections';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/shared/components/ui/dialog';
export const ProfileDashboard = () => {
    const { user } = useAuth();
    useTheme();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Track dirty state per section
    const [dirtySections, setDirtySections] = useState<Record<string, boolean>>({});
    const isDirty = Object.values(dirtySections).some(v => v);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async () => {
        // In a real app, we'd collect all section data and update it via context
        toast.success('Personnel record updated', {
            description: 'Changes have been synchronized with the encrypted database.',
        });
        setDirtySections({});
    };

    const handleReset = () => {
        toast.info('Profile changes discarded');
        setDirtySections({});
        window.location.reload();
    };

    const handleDirtyChange = useCallback((section: string, isSectionDirty: boolean) => {
        setDirtySections(prev => {
            if (prev[section] === isSectionDirty) return prev;
            return { ...prev, [section]: isSectionDirty };
        });
    }, []);

    if (loading) {
        return <LoadingScreen message="Retrieving Personnel Protocol..." />;
    }

    if (!user) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'general', label: 'General Identity', icon: User },
        { id: 'professional', label: 'Professional Data', icon: BadgeCheck },
        { id: 'security', label: 'Access & Security', icon: Lock },
        { id: 'emergency', label: 'Medical & Emergency', icon: HeartPulse },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewSection />;
            case 'general': return <GeneralSection onDirtyChange={(d: boolean) => handleDirtyChange('general', d)} />;
            case 'professional': return <ProfessionalSection onDirtyChange={(d: boolean) => handleDirtyChange('professional', d)} />;
            case 'security': return <SecuritySection onDirtyChange={(d: boolean) => handleDirtyChange('security', d)} />;
            case 'emergency': return <EmergencySection onDirtyChange={(d: boolean) => handleDirtyChange('emergency', d)} />;
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
                                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                                    <AlertTriangle className="text-rose-500" size={24} />
                                </div>
                                <DialogTitle className="text-white">Discard Personnel Changes?</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Unsaved modifications to your personnel record will be permanently lost. Proceed?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6 gap-2">
                                <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => { }}>Cancel</Button>
                                <Button variant="destructive" onClick={handleReset}>Discard Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={handleSave}
                        className="h-12 px-8 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:scale-[1.05] transition-all"
                    >
                        <Save size={14} className="mr-2" /> Commit Profile Record
                    </Button>
                </div>
            </div>

            <div className="pt-4" />

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Personnel Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="space-y-6 sticky top-24">
                        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-3.5 px-5 py-4 rounded-2xl text-left transition-all group whitespace-nowrap border-2
                                        ${activeTab === tab.id
                                            ? 'bg-primary/5 border-primary/40 text-primary shadow-[0_0_25px_rgba(16,185,129,0.1)]'
                                            : 'bg-white/[0.01] border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-white'}
                                    `}
                                >
                                    <tab.icon size={18} className={`${activeTab === tab.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
                                    <span className="text-sm font-bold tracking-wide">{tab.label}</span>
                                    {dirtySections[tab.id] && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse" />
                                    )}
                                    {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-40" />}
                                </button>
                            ))}
                        </nav>

                        {/* Quick Stats/Badge */}
                        <div className="hidden lg:block p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Oversight</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-zinc-500">Record Sensitivity</span>
                                    <span className="text-zinc-300 font-bold">Class A</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-zinc-500">Last Audit</span>
                                    <span className="text-zinc-300 font-bold text-emerald-500">Passed</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-zinc-500">Encryption Code</span>
                                    <span className="text-[9px] font-mono text-indigo-400 tracking-tighter">0x4F...E82</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Identity Area */}
                <main className="flex-1 min-w-0">
                    <div key={activeTab} className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
