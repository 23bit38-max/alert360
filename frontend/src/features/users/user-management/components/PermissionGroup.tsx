import { Shield, ChevronDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/shared/components/ui/badge';
import { type User } from '@/data/data';
import { type Permission, getPermissionDisplayName, hasPermission } from '@/shared/utils/rbac';

interface PermissionGroupProps {
    domain: string;
    permissions: Permission[];
    selectedUser: User;
    editMode: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onPermissionToggle: (permission: Permission, isChecked: boolean) => void;
}

export const PermissionGroup: React.FC<PermissionGroupProps> = ({
    domain,
    permissions,
    selectedUser,
    editMode,
    isExpanded,
    onToggle,
    onPermissionToggle,
}) => {
    return (
        <div className="glass border-white/5 rounded-[24px] overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all"
            >
                <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center border transition-all ${isExpanded ? 'bg-primary/10 border-primary/20' : 'bg-white/[0.03] border-white/5 opacity-40'}`}>
                        <Shield className={`h-5 w-5 ${isExpanded ? 'text-primary' : 'text-white'}`} />
                    </div>
                    <div className="text-left space-y-1">
                        <span className="text-[12px] font-black text-white tracking-widest uppercase">{domain} Authority Group</span>
                        <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase opacity-40">{permissions.length} Active Protocols</p>
                    </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-primary/40 transition-transform ${isExpanded ? 'rotate-180 text-primary opacity-100' : ''}`} />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 space-y-3">
                            {permissions.map((permission) => {
                                const isEnabled = hasPermission(selectedUser, permission);
                                return (
                                    <div
                                        key={permission}
                                        className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl group hover:border-white/10 transition-all hover:bg-white/[0.04]"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-black text-white tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {getPermissionDisplayName(permission)}
                                                </span>
                                                {isEnabled && (
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase tracking-tighter px-2">Verified</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity size={10} className={`${isEnabled ? 'text-primary' : 'text-white/10'}`} />
                                                <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase opacity-30"> Operational Policy: {permission.toLowerCase()}.v1 </span>
                                            </div>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!isEnabled}
                                                disabled={!editMode}
                                                onChange={(e) => onPermissionToggle(permission, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-6 bg-white/5 border border-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/10 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-white peer-checked:after:shadow-[0_0_10px_rgba(255,255,255,0.5)] peer-checked:bg-primary shadow-inner peer-disabled:opacity-20 cursor-pointer"></div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
