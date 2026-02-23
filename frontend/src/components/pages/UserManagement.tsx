import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Users,
  Shield,
  Search,
  Plus,
  Edit,
  UserX,
  Save,
  X,
  ChevronDown,
  History as HistoryIcon,
  MapPin,
  Target,
  Activity,
  Zap,
  Lock,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import {
  PERMISSIONS,
  ROLES,
  getRoleDisplayName,
  getDepartmentDisplayName,
  getPermissionDisplayName,
  getPermissionDomain,
  hasPermission,
  type UserRole,
  type Permission,
} from '../../utils/rbac';
import { type User } from '../../data/data';

// Group permissions by domain
const groupPermissionsByDomain = (): Record<string, Permission[]> => {
  const grouped: Record<string, Permission[]> = {};

  Object.values(PERMISSIONS).forEach((permission) => {
    const domain = getPermissionDomain(permission as Permission);
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(permission as Permission);
  });

  return grouped;
};

const PERMISSION_GROUPS = groupPermissionsByDomain();

export const UserManagement: React.FC = () => {
  const { allUsers, updateUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(['Core Access']));

  // Filter users based on search
  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDomain = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    const success = await updateUser(selectedUser);
    if (success) {
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (selectedUser) {
      const originalUser = allUsers.find(u => u.id === selectedUser.id);
      if (originalUser) {
        setSelectedUser(originalUser);
      }
    }
  };

  return (
    <div className="page-container animate-in fade-in duration-800 max-w-[1750px] mx-auto pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* Precision Operational Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl">
            <Shield size={16} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Personnel Matrix Control</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.1em]">Level 4 Super Admin Terminal</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Operators</span>
              <span className="text-sm font-black text-white">{allUsers.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Sessions</span>
              <span className="text-sm font-black text-primary">{allUsers.filter(u => u.status === 'active').length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-lg">
            Operational Integrity Verified
          </Badge>
          <Button className="h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all flex items-center gap-2">
            <Plus size={14} /> Add New Operator
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* User List: Personnel Directory */}
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
                onClick={() => handleSelectUser(user)}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-[24px] border transition-all duration-300 cursor-pointer relative overflow-hidden group ${selectedUser?.id === user.id
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
                  <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${selectedUser?.id === user.id ? '-rotate-90 text-primary opacity-100' : 'group-hover:opacity-100 opacity-0'}`} />
                </div>

                {selectedUser?.id === user.id && (
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
                              onClick={handleCancelEdit}
                              className="border-white/10 text-white/60 hover:bg-white/5 text-[10px] font-black tracking-widest h-11 px-6 rounded-2xl"
                            >
                              <X className="h-4 w-4 mr-2" />
                              ABORT
                            </Button>
                            <Button
                              onClick={handleSaveChanges}
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
                              onClick={() => setEditMode(true)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              AMEND DOSSIER
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
                            setSelectedUser({ ...selectedUser, role: value as UserRole })
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
                          <div key={domain} className="glass border-white/5 rounded-[24px] overflow-hidden">
                            <button
                              onClick={() => toggleDomain(domain)}
                              className="w-full p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all"
                            >
                              <div className="flex items-center gap-6">
                                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center border transition-all ${expandedDomains.has(domain) ? 'bg-primary/10 border-primary/20' : 'bg-white/[0.03] border-white/5 opacity-40'}`}>
                                  <Shield className={`h-5 w-5 ${expandedDomains.has(domain) ? 'text-primary' : 'text-white'}`} />
                                </div>
                                <div className="text-left space-y-1">
                                  <span className="text-[12px] font-black text-white tracking-widest uppercase">{domain} Authority Group</span>
                                  <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase opacity-40">{permissions.length} Active Protocols</p>
                                </div>
                              </div>
                              <ChevronDown className={`h-5 w-5 text-primary/40 transition-transform ${expandedDomains.has(domain) ? 'rotate-180 text-primary opacity-100' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {expandedDomains.has(domain) && (
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
                                              onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                const currentToggles = selectedUser.permissionToggles || {};
                                                const newToggles = { ...currentToggles, [permission]: isChecked };
                                                setSelectedUser({ ...selectedUser, permissionToggles: newToggles });
                                              }}
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
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
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
