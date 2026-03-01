import { Users, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { Card } from '@/shared/components/ui/card';

// New Components
import { OperatorHeader } from '@/features/users/user-management/components/OperatorHeader';
import { UserList } from '@/features/users/user-management/components/UserList';
import { UserDetail } from '@/features/users/user-management/components/UserDetail';

// Hook
import { useUserManagement } from '@/features/users/user-management/hooks/useUserManagement';

export const UserManagement: React.FC = () => {
    const {
        allUsers,
        loading,
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        editMode,
        setEditMode,
        expandedDomains,
        filteredUsers,
        toggleDomain,
        handleSelectUser,
        handleSaveChanges,
        handleCancelEdit
    } = useUserManagement();

    if (loading) {
        return <LoadingScreen message="Establishing Personnel Link..." />;
    }

    return (
        <div className="page-container animate-in fade-in duration-800 max-w-[1750px] mx-auto pb-12 flex flex-col h-[calc(100vh-140px)]">
            {/* Precision Operational Header */}
            <OperatorHeader
                totalUsers={allUsers.length}
                activeSessions={allUsers.filter(u => u.status === 'active').length}
            />

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* User List: Personnel Directory */}
                <UserList
                    filteredUsers={filteredUsers}
                    selectedUserId={selectedUser?.id}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectUser={handleSelectUser}
                />

                {/* User Details & Permissions: Command Terminal */}
                <div className="col-span-8 h-full flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div
                                key={selectedUser.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <UserDetail
                                    selectedUser={selectedUser}
                                    editMode={editMode}
                                    expandedDomains={expandedDomains}
                                    onEditToggle={setEditMode}
                                    onCancelEdit={handleCancelEdit}
                                    onSaveChanges={handleSaveChanges}
                                    onUserUpdate={setSelectedUser}
                                    onToggleDomain={toggleDomain}
                                />
                            </motion.div>
                        ) : (
                            <Card className="glass h-full flex flex-col items-center justify-center border-white/5 premium-shadow rounded-[32px] text-center p-12">
                                <div className="w-24 h-24 rounded-[40px] bg-white/[0.02] border border-white/10 flex items-center justify-center mb-8 relative">
                                    <Users size={40} className="text-white opacity-20" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border border-dashed border-primary/20 rounded-[40px]"
                                    />
                                </div>
                                <h3 className="text-white text-sm font-black tracking-[0.4em] uppercase mb-4 opacity-70">Awaiting Operator Selection</h3>
                                <p className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase leading-relaxed opacity-40 max-w-[320px]">
                                    Initialize secure encrypted link by selecting an active profile from the personnel directory to view operational intelligence.
                                </p>
                                <div className="mt-12 flex items-center gap-3 px-5 py-2 glass border-white/10 rounded-xl">
                                    <Activity size={14} className="text-primary animate-pulse" />
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Awaiting Uplink...</span>
                                </div>
                            </Card>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
