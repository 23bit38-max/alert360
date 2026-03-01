import {
    Shield,
    MapPin,
    Target,
    Lock,
    Edit,
    UserX,
    X,
    Save,
    History as HistoryIcon,
    Plus
} from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { type User } from '@/data/data';
import {
    ROLES,
    getRoleDisplayName,
    getDepartmentDisplayName,
    type UserRole,
    type Permission
} from '@/shared/utils/rbac';
import { PERMISSION_GROUPS } from '@/features/users/user-management/constants/userManagement.constants';
import { PermissionGroup } from '@/features/users/user-management/components/PermissionGroup';

interface UserDetailProps {
    selectedUser: User;
    editMode: boolean;
    expandedDomains: Set<string>;
    onEditToggle: (mode: boolean) => void;
    onCancelEdit: () => void;
    onSaveChanges: () => void;
    onUserUpdate: (updatedUser: User) => void;
    onToggleDomain: (domain: string) => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
    selectedUser,
    editMode,
    expandedDomains,
    onEditToggle,
    onCancelEdit,
    onSaveChanges,
    onUserUpdate,
    onToggleDomain,
}) => {
    const handlePermissionToggle = (permission: Permission, isChecked: boolean) => {
        const currentToggles = selectedUser.permissionToggles || {};
        const newToggles = { ...currentToggles, [permission]: isChecked };
        onUserUpdate({ ...selectedUser, permissionToggles: newToggles });
    };

    return (
        <Card className="glass h-full overflow-hidden border-white/5 premium-shadow rounded-[32px] flex flex-col">
            {/* Profile HUD Area */}
            <div className="p-8 pb-0 shrink-0">
                <div className="flex items-start justify-between gap-8 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            {selectedUser.avatar ? (
                                <img
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    className="h-28 w-28 rounded-[32px] object-cover border-2 border-white/10 shadow-2xl"
                                />
                            ) : (
                                <div className="h-28 w-28 rounded-[32px] bg-primary/5 border-2 border-primary/20 flex items-center justify-center">
                                    <span className="text-primary font-black text-4xl">
                                        {selectedUser.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg border-2 border-[#0B0F1A] text-[9px] font-black uppercase tracking-widest ${selectedUser.status === 'active' ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>
                                {selectedUser.status}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">{selectedUser.name}</h2>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <p className="text-[10px] font-mono text-primary tracking-widest uppercase">
                                    ID: {selectedUser.id.toUpperCase()}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-lg">
                                    {getRoleDisplayName(selectedUser.role)}
                                </Badge>
                                <Badge className="bg-white/5 text-white/40 border-white/10 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-lg">
                                    {getDepartmentDisplayName(selectedUser.department)}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <div className="flex items-center gap-2">
                                    <Lock size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Encryption: AES-256</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target size={12} className="text-yellow-400" />
                                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Clearance: Level {selectedUser.role === ROLES.SUPER_ADMIN ? '4' : '2'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {editMode ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={onCancelEdit}
                                    className="border-white/10 text-white/60 hover:bg-white/5 text-[10px] font-black tracking-widest h-11 px-6 rounded-2xl"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    ABORT
                                </Button>
                                <Button
                                    onClick={onSaveChanges}
                                    className="bg-primary hover:bg-primary/80 text-white text-[10px] font-black tracking-widest h-11 px-8 rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)]"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    COMMIT
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary/5 text-[10px] font-black tracking-widest h-11 px-6 rounded-2xl"
                                    onClick={() => onEditToggle(true)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    UPDATE PROFILE
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-red-500/30 text-red-500 hover:bg-red-500/5 text-[10px] font-black tracking-widest h-11 px-6 rounded-2xl"
                                >
                                    <UserX className="h-4 w-4 mr-2" />
                                    REVOKE ACCESS
                                </Button>
                            </div>
                        )}
                        <span className="text-[9px] font-bold text-right text-white/20 uppercase tracking-[0.2em]">Secure Node Link Established</span>
                    </div>
                </div>
            </div>

            {/* Functional Controls Grid */}
            <div className="p-8 pt-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 opacity-70">
                            <Shield className="h-3.5 w-3.5 text-primary" />
                            Authority Hierarchy Override
                        </Label>
                        <Select
                            value={selectedUser.role}
                            disabled={!editMode}
                            onValueChange={(value) =>
                                onUserUpdate({ ...selectedUser, role: value as UserRole })
                            }
                        >
                            <SelectTrigger className="bg-white/[0.03] border-white/10 text-[11px] font-bold tracking-widest text-white h-14 rounded-2xl focus:ring-primary/50 transition-all uppercase px-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/10 rounded-2xl overflow-hidden">
                                {Object.values(ROLES).map((role) => (
                                    <SelectItem key={role} value={role} className="text-[11px] font-bold tracking-widest uppercase py-3 hover:bg-white/5 transition-colors">
                                        {getRoleDisplayName(role)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 opacity-70">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            Assigned Tactical Sectors
                        </Label>
                        <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl min-h-[56px] items-center">
                            {selectedUser.assignedZones?.includes('all') ? (
                                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-xl">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">GLOBAL AUTH [ALL ZONES]</span>
                                </div>
                            ) : (
                                selectedUser.assignedZones?.map((zone) => (
                                    <Badge
                                        key={zone}
                                        variant="outline"
                                        className="border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                                    >
                                        {zone.toUpperCase()}
                                    </Badge>
                                ))
                            )}
                            {editMode && (
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full border border-white/10 text-primary hover:bg-primary/10">
                                    <Plus size={12} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Permission Toggles: Access Authority Matrix */}
                <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock size={18} className="text-primary" />
                            <h3 className="text-white text-[11px] font-black tracking-[0.4em] uppercase">Control Matrix</h3>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-9 px-4 text-primary/60 hover:text-primary hover:bg-primary/5 text-[10px] font-black tracking-widest uppercase rounded-xl"
                        >
                            <HistoryIcon className="h-4 w-4 mr-2" />
                            Personnel Audit Log
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {Object.entries(PERMISSION_GROUPS).map(([domain, permissions]) => (
                            <PermissionGroup
                                key={domain}
                                domain={domain}
                                permissions={permissions}
                                selectedUser={selectedUser}
                                editMode={editMode}
                                isExpanded={expandedDomains.has(domain)}
                                onToggle={() => onToggleDomain(domain)}
                                onPermissionToggle={handlePermissionToggle}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};
