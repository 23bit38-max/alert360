import { Users, Search, ChevronDown, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { type User } from '@/data/data';

interface UserListProps {
    filteredUsers: User[];
    selectedUserId?: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSelectUser: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({
    filteredUsers,
    selectedUserId,
    searchQuery,
    setSearchQuery,
    onSelectUser,
}) => {
    return (
        <Card className="glass col-span-4 flex flex-col overflow-hidden border-white/5 premium-shadow rounded-[32px]">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Users size={16} className="text-primary" />
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/80">Personnel Registry</h2>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-[9px] font-bold text-white/40 px-2 py-0.5 uppercase tracking-widest">
                        Real-Time Sync
                    </Badge>
                </div>
                {/* Search Terminal */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                    <Input
                        type="text"
                        placeholder="INTEL SEARCH [NAME, ROLE, ID]..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-white/[0.03] border-white/5 text-[11px] font-bold tracking-[0.1em] text-white h-12 rounded-2xl focus:border-primary/50 transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        whileHover={{ x: 4 }}
                        className={`p-4 rounded-[24px] border transition-all duration-300 cursor-pointer relative overflow-hidden group ${selectedUserId === user.id
                            ? 'glass border-primary/30 bg-primary/5 shadow-[0_4px_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-12 w-12 rounded-[18px] object-cover border border-white/10"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-[18px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-black text-sm">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                {user.status === 'active' && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-[3px] border-[#0B0F1A] shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-black text-white tracking-widest uppercase truncate">{user.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase opacity-60 truncate">{user.role.replace('_', ' ')}</p>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <p className="text-[9px] font-mono text-white/30 truncate">{user.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${selectedUserId === user.id ? '-rotate-90 text-primary opacity-100' : 'group-hover:opacity-100 opacity-0'}`} />
                        </div>

                        {selectedUserId === user.id && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute top-0 right-0 w-1 h-full bg-primary"
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Local Intelligence Meta</span>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap size={12} className="text-yellow-400" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">DB Sync</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-blue-400" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">RBAC Engine</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: '88%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
