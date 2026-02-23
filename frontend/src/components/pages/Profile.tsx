import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { useTheme, GlobalStyles } from '../../theme';

import {
  Shield,
  Camera,
  Edit3,
  Lock,
  User
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { colors, typography } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) return null;

  return (
    <div style={GlobalStyles.pageContainer} className="max-w-6xl mx-auto">
      {/* Personnel Operational Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <User size={14} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Personnel File: </span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Level 4 Clearance</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              className="h-10 px-6 rounded-xl bg-white/[0.03] border border-white/10 text-muted-foreground hover:bg-white/[0.08] text-[9px] font-black uppercase tracking-widest transition-all"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={14} className="mr-2 opacity-50" /> Modify Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10 px-5 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10 px-6 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                onClick={() => setIsEditing(false)}
              >
                Save File
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Identity Card */}
        <Card style={{ ...GlobalStyles.card, gridColumn: 'span 4' }}>
          <CardContent className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <Avatar style={{ width: '120px', height: '120px', border: `3px solid ${colors.accent.primary}` }}>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer" style={{ backgroundColor: colors.accent.primary }}>
                  <Camera size={14} color="white" />
                </div>
              )}
            </div>
            <h2 style={typography.h2}>{user?.name}</h2>
            <p style={{ ...typography.caption, color: colors.accent.primary, fontWeight: '700', marginTop: '4px' }}>
              {user?.role?.toUpperCase()}
            </p>

            <div className="mt-8 space-y-3 pt-8 border-t" style={{ borderColor: colors.background.border }}>
              <div className="flex justify-between items-center">
                <span style={{ ...typography.caption, color: colors.text.muted }}>ID CODE</span>
                <span style={{ ...typography.caption, fontWeight: '700' }}>#{user?.id?.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ ...typography.caption, color: colors.text.muted }}>CLEARANCE</span>
                <Badge style={{ backgroundColor: colors.status.safe.soft, color: colors.status.safe.main, border: 'none' }}>LEVEL 4</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <div className="lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b p-0 h-auto rounded-none w-full flex justify-start mb-6" style={{ borderColor: colors.background.border }}>
              {['personal', 'security', 'activity'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  style={{
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab ? `2px solid ${colors.accent.primary}` : 'none',
                    color: activeTab === tab ? colors.accent.primary : colors.text.muted,
                    borderRadius: 0,
                    padding: '12px 24px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal">
              <Card style={GlobalStyles.card}>
                <CardHeader>
                  <CardTitle style={typography.label}>BASIC PERSONNEL DATA</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-2">
                    <Label style={typography.caption}>FULL NAME</Label>
                    <Input disabled={!isEditing} defaultValue={user?.name} style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }} />
                  </div>
                  <div className="space-y-2">
                    <Label style={typography.caption}>EMAIL ADDRESS</Label>
                    <Input disabled={!isEditing} defaultValue={user?.email} style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }} />
                  </div>
                  <div className="space-y-2">
                    <Label style={typography.caption}>DEPARTMENT</Label>
                    <Input disabled={true} defaultValue={user?.department} style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }} />
                  </div>
                  <div className="space-y-2">
                    <Label style={typography.caption}>ASSIGNED ZONE</Label>
                    <Input disabled={true} defaultValue="Tamil Nadu South" style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-4">
                <Alert style={{ backgroundColor: colors.status.info.soft, border: `1px solid ${colors.status.info.main}`, color: colors.status.info.main }}>
                  <Shield size={16} />
                  <AlertDescription style={typography.caption}>Encryption status: AES-256 RSA-4096 Active</AlertDescription>
                </Alert>
                <Card style={GlobalStyles.card}>
                  <CardHeader><CardTitle style={typography.label}>ACCESS CREDENTIALS</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: colors.background.app }}>
                      <div className="flex items-center gap-3">
                        <Lock size={18} style={{ color: colors.accent.primary }} />
                        <div>
                          <p style={{ ...typography.body, fontWeight: '700' }}>Two-Factor Authentication</p>
                          <p style={typography.caption}>Secure your account with mobile verification</p>
                        </div>
                      </div>
                      <Badge style={{ backgroundColor: colors.status.safe.main }}>ENABLED</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};