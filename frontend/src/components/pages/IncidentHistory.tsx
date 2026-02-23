import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useTheme, GlobalStyles } from '../../theme';
import {
  getAccessibleZones,
  canAccessZone,
  isSuperAdmin,
} from '../../utils/rbac';
import {
  History,
  Clock,
  MapPin,
  Download,
  Eye,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Camera,
  FileText,
  Users,
  Truck,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Printer,
  Share2,
  Bookmark,
  Archive,
  PieChart,
  Layers,
  Wifi,
  Lock,
  Globe,
  Circle,
  Radio,
  Cpu
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';

interface IncidentRecord {
  id: string;
  title: string;
  type: 'collision' | 'rollover' | 'fire' | 'medical' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  zone: string;
  timestamp: Date;
  resolvedAt?: Date;
  vehicles: number;
  casualties: number;
  responseTime: number;
  assignedUnits: string[];
  status: 'resolved' | 'escalated' | 'dismissed';
  confidence: number;
  cameraId: string;
  reportGenerated: boolean;
  cost?: number;
  responsibleDepartment: 'police' | 'fire' | 'hospital';
  handledBy: string;
  weather?: 'clear' | 'rain' | 'snow' | 'fog';
  roadCondition?: 'dry' | 'wet' | 'icy' | 'under-construction';
}

export const IncidentHistory = () => {
  const { user } = useAuth();
  const { colors, sizes, typography, } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const accessibleZones = getAccessibleZones(user);

  // Enhanced mock data
  const mockIncidents: IncidentRecord[] = [
    {
      id: 'inc-001',
      title: 'Multi-Vehicle Collision',
      type: 'collision',
      severity: 'critical',
      location: 'Main St & 5th Ave',
      zone: 'zone-1',
      timestamp: new Date('2025-01-25T14:30:00'),
      resolvedAt: new Date('2025-01-25T15:15:00'),
      vehicles: 3,
      casualties: 2,
      responseTime: 4.2,
      assignedUnits: ['Unit-12', 'Ambulance-3', 'Fire-07'],
      status: 'resolved',
      confidence: 95,
      cameraId: 'cam-001',
      reportGenerated: true,
      cost: 45000,
      responsibleDepartment: 'police',
      handledBy: 'Officer Johnson',
      weather: 'clear',
      roadCondition: 'dry'
    },
    {
      id: 'inc-002',
      title: 'Vehicle Rollover',
      type: 'rollover',
      severity: 'high',
      location: 'Highway 101 Mile 45',
      zone: 'zone-2',
      timestamp: new Date('2025-01-25T09:15:00'),
      resolvedAt: new Date('2025-01-25T10:00:00'),
      vehicles: 1,
      casualties: 1,
      responseTime: 3.8,
      assignedUnits: ['Unit-07', 'Ambulance-2'],
      status: 'resolved',
      confidence: 92,
      cameraId: 'cam-002',
      reportGenerated: true,
      cost: 12000,
      responsibleDepartment: 'fire',
      handledBy: 'Chief Martinez',
      weather: 'rain',
      roadCondition: 'wet'
    },
    {
      id: 'inc-003',
      title: 'Structure Fire',
      type: 'fire',
      severity: 'critical',
      location: '123 Oak Avenue',
      zone: 'zone-1',
      timestamp: new Date('2025-01-24T22:45:00'),
      resolvedAt: new Date('2025-01-25T01:30:00'),
      vehicles: 4,
      casualties: 0,
      responseTime: 3.2,
      assignedUnits: ['Fire-01', 'Fire-02', 'Ambulance-4', 'Unit-05'],
      status: 'resolved',
      confidence: 98,
      cameraId: 'cam-015',
      reportGenerated: true,
      cost: 250000,
      responsibleDepartment: 'fire',
      handledBy: 'Chief Williams',
      weather: 'clear',
      roadCondition: 'dry'
    },
    {
      id: 'inc-004',
      title: 'Medical Emergency',
      type: 'medical',
      severity: 'high',
      location: 'Central Station',
      zone: 'zone-3',
      timestamp: new Date('2025-01-24T16:20:00'),
      resolvedAt: new Date('2025-01-24T17:05:00'),
      vehicles: 1,
      casualties: 1,
      responseTime: 2.5,
      assignedUnits: ['Ambulance-7'],
      status: 'resolved',
      confidence: 100,
      cameraId: 'cam-089',
      reportGenerated: true,
      cost: 5000,
      responsibleDepartment: 'hospital',
      handledBy: 'Dr. Chen',
      weather: 'clear',
      roadCondition: 'dry'
    }
  ];

  // Analytics data
  const incidentTrends = [
    { date: '2025-01-19', collisions: 2, fires: 1, medical: 3, rollovers: 0 },
    { date: '2025-01-20', collisions: 3, fires: 0, medical: 2, rollovers: 1 },
    { date: '2025-01-21', collisions: 1, fires: 2, medical: 4, rollovers: 0 },
    { date: '2025-01-22', collisions: 4, fires: 1, medical: 2, rollovers: 1 },
    { date: '2025-01-23', collisions: 2, fires: 0, medical: 3, rollovers: 0 },
    { date: '2025-01-24', collisions: 3, fires: 1, medical: 2, rollovers: 1 },
    { date: '2025-01-25', collisions: 2, fires: 1, medical: 1, rollovers: 1 },
  ];

  const severityDistribution = [
    { name: 'Critical', value: 8, color: colors.status.critical.main },
    { name: 'High', value: 15, color: colors.status.warning.main },
    { name: 'Medium', value: 23, color: colors.status.info.main },
    { name: 'Low', value: 12, color: colors.status.safe.main },
  ];

  const responseTimeByType = [
    { type: 'Collision', time: 4.2 },
    { type: 'Fire', time: 3.1 },
    { type: 'Medical', time: 2.8 },
    { type: 'Rollover', time: 3.9 },
  ];

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesZone = accessibleZones.includes('all') || canAccessZone(user, incident.zone);
    const matchesDept = isSuperAdmin(user) || incident.responsibleDepartment === user?.department;
    const matchesType = selectedType === 'all' || incident.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesDept && matchesType && matchesSeverity && matchesSearch;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      resolved: { icon: CheckCircle, color: colors.status.safe.main, bg: colors.status.safe.soft },
      escalated: { icon: AlertTriangle, color: colors.status.critical.main, bg: colors.status.critical.soft },
      dismissed: { icon: XCircle, color: colors.text.muted, bg: colors.background.app }
    };
    const { icon: Icon, color, bg } = config[status as keyof typeof config];

    return (
      <Badge style={{ 
        backgroundColor: bg, 
        color: color, 
        border: 'none', 
        display: 'flex', 
        gap: '4px', 
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '20px'
      }}>
        <Icon size={12} /> {status.toUpperCase()}
      </Badge>
    );
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const typeColors = {
      collision: { bg: colors.status.warning.soft, color: colors.status.warning.main },
      rollover: { bg: colors.accent.secondary + '20', color: colors.accent.secondary },
      fire: { bg: colors.status.critical.soft, color: colors.status.critical.main },
      medical: { bg: colors.status.info.soft, color: colors.status.info.main },
      other: { bg: colors.background.elevated, color: colors.text.muted }
    };
    const { bg, color } = typeColors[type as keyof typeof typeColors];

    return (
      <Badge style={{ backgroundColor: bg, color: color, border: 'none' }}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <Card style={{ ...GlobalStyles.card, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
        borderRadius: '50%'
      }} />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div style={{ color: color }}>
            <Icon size={20} />
          </div>
          {trend && (
            <div className="flex items-center gap-1" style={{ color: trend > 0 ? colors.status.critical.main : colors.status.safe.main }}>
              {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span style={{ fontSize: '10px', fontWeight: 600 }}>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <p style={{ ...typography.caption, fontSize: '10px', marginBottom: '2px' }}>{label}</p>
        <p style={{ ...typography.h2, fontSize: '24px', lineHeight: 1.2 }}>{value}</p>
      </CardContent>
    </Card>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card style={GlobalStyles.card}>
          <CardHeader className="pb-2">
            <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={14} color={colors.accent.primary} />
              INCIDENT TRENDS (7 DAYS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incidentTrends}>
                  <defs>
                    <linearGradient id="colorCollisions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.status.warning.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.status.warning.main} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFires" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.status.critical.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.status.critical.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.background.border} />
                  <XAxis dataKey="date" stroke={colors.text.muted} fontSize={10} />
                  <YAxis stroke={colors.text.muted} fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.elevated,
                      border: `1px solid ${colors.background.border}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="collisions" stroke={colors.status.warning.main} fill="url(#colorCollisions)" />
                  <Area type="monotone" dataKey="fires" stroke={colors.status.critical.main} fill="url(#colorFires)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card style={GlobalStyles.card}>
          <CardHeader className="pb-2">
            <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={14} color={colors.accent.primary} />
              SEVERITY DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.elevated,
                      border: `1px solid ${colors.background.border}`,
                      borderRadius: '8px'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p style={{ ...typography.h3, fontSize: '24px' }}>58</p>
                  <p style={typography.caption}>Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card style={GlobalStyles.card}>
          <CardHeader className="pb-2">
            <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color={colors.accent.primary} />
              RESPONSE TIME BY INCIDENT TYPE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.background.border} />
                  <XAxis dataKey="type" stroke={colors.text.muted} fontSize={10} />
                  <YAxis stroke={colors.text.muted} fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.elevated,
                      border: `1px solid ${colors.background.border}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="time" fill={colors.accent.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card style={GlobalStyles.card}>
          <CardHeader className="pb-2">
            <CardTitle style={{ ...typography.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={14} color={colors.accent.primary} />
              PERFORMANCE METRICS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Avg Response Time', value: '3.8 min', target: '< 5 min', progress: 76 },
                { label: 'Resolution Rate', value: '94%', target: '> 90%', progress: 94 },
                { label: 'Accuracy Score', value: '97%', target: '> 95%', progress: 97 },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={typography.caption}>{metric.label}</span>
                    <span style={{ ...typography.body, fontWeight: 600 }}>{metric.value}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: colors.background.border, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${metric.progress}%`, 
                      height: '100%', 
                      backgroundColor: metric.progress >= 90 ? colors.status.safe.main : colors.status.warning.main,
                      borderRadius: '2px'
                    }} />
                  </div>
                  <p style={{ ...typography.caption, fontSize: '8px', marginTop: '2px' }}>Target: {metric.target}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // System status indicators
  const SystemStatus = () => (
    <div className="flex items-center gap-4 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.background.elevated }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Circle size={6} color={colors.status.safe.main} fill={colors.status.safe.main} />
          <span style={{ fontSize: '10px', color: colors.text.muted }}>LIVE</span>
        </div>
        <div className="flex items-center gap-1">
          <Wifi size={12} color={colors.status.info.main} />
          <span style={{ fontSize: '10px', color: colors.text.muted }}>NETWORK</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock size={12} color={colors.status.safe.main} />
          <span style={{ fontSize: '10px', color: colors.text.muted }}>SECURE</span>
        </div>
        <div className="flex items-center gap-1">
          <Radio size={12} color={colors.status.warning.main} />
          <span style={{ fontSize: '10px', color: colors.text.muted }}>STATUS</span>
        </div>
      </div>
      <div className="h-4 w-px" style={{ backgroundColor: colors.background.border }} />
      <div className="flex items-center gap-1">
        <Clock size={12} color={colors.accent.primary} />
        <span style={{ fontSize: '10px', fontWeight: 600 }}>07:36 PM</span>
        <span style={{ fontSize: '8px', color: colors.text.muted }}>LOCAL TIME</span>
      </div>
    </div>
  );

  return (
    <div style={GlobalStyles.pageContainer}>


      {/* User Info Bar */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: colors.background.elevated }}>
          <Shield size={14} color={colors.accent.primary} />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>SYSTEM ADMINISTRATOR</span>
          <Badge style={{ backgroundColor: colors.status.info.soft, color: colors.status.info.main, border: 'none', fontSize: '8px' }}>
            SUPER ADMIN
          </Badge>
        </div>
      </div>

      {/* Quick Stats with Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon={History} label="Total Incidents" value="158" trend={12} color={colors.status.info.main} />
        <StatCard icon={CheckCircle} label="Resolved" value="142" trend={8} color={colors.status.safe.main} />
        <StatCard icon={AlertTriangle} label="Active" value="16" trend={-5} color={colors.status.warning.main} />
        <StatCard icon={Clock} label="Avg Response" value="3.8m" trend={-2} color={colors.accent.primary} />
        <StatCard icon={Truck} label="Units Deployed" value="342" trend={15} color={colors.accent.secondary} />
      </div>

      {/* Filter Bar with View Toggle */}
      <Card style={{ ...GlobalStyles.card, marginBottom: sizes.spacing.lg }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={16} color={colors.accent.primary} />
              <span style={typography.label}>FILTERS</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                style={{
                  backgroundColor: viewMode === 'table' ? colors.accent.primary + '20' : 'transparent',
                  color: viewMode === 'table' ? colors.accent.primary : colors.text.muted
                }}
              >
                <Layers size={14} className="mr-2" /> Table
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('analytics')}
                style={{
                  backgroundColor: viewMode === 'analytics' ? colors.accent.primary + '20' : 'transparent',
                  color: viewMode === 'analytics' ? colors.accent.primary : colors.text.muted
                }}
              >
                <BarChart3 size={14} className="mr-2" /> Analytics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.text.muted }} />
              <Input
                placeholder="Search incidents by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingLeft: '32px', 
                  backgroundColor: colors.background.app, 
                  borderColor: colors.background.border,
                  width: '100%'
                }}
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }}>
                <Calendar size={14} className="mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: colors.background.sidebar, borderColor: colors.background.border }}>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }}>
                <AlertOctagon size={14} className="mr-2" />
                <SelectValue placeholder="Incident Type" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: colors.background.sidebar, borderColor: colors.background.border }}>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="collision">Collision</SelectItem>
                <SelectItem value="rollover">Rollover</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }}>
                <AlertTriangle size={14} className="mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: colors.background.sidebar, borderColor: colors.background.border }}>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" style={{ borderColor: colors.background.border }}>
              <Archive size={14} className="mr-2" /> Advanced
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: colors.background.border }}>
            <span style={{ ...typography.caption, fontSize: '10px' }}>ACTIVE FILTERS:</span>
            <Badge style={{ backgroundColor: colors.accent.primary + '20', color: colors.accent.primary, border: 'none' }}>
              Department: {user?.department || 'All'}
            </Badge>
            {selectedType !== 'all' && (
              <Badge style={{ backgroundColor: colors.background.elevated, border: 'none' }}>
                Type: {selectedType}
              </Badge>
            )}
            {selectedSeverity !== 'all' && (
              <Badge style={{ backgroundColor: colors.background.elevated, border: 'none' }}>
                Severity: {selectedSeverity}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conditional Content */}
      {viewMode === 'analytics' ? renderAnalytics() : (
        <Card style={{ ...GlobalStyles.card, padding: 0 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.background.border }}>
            <div className="flex items-center gap-2">
              <FileText size={14} color={colors.accent.primary} />
              <span style={typography.label}>INCIDENT LOGS ({filteredIncidents.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bookmark size={14} className="mr-2" /> Save View
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical size={14} />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-550px)]">
            <Table>
              <TableHeader style={{ backgroundColor: colors.background.elevated }}>
                <TableRow style={{ borderColor: colors.background.border }}>
                  <TableHead style={typography.label}>INCIDENT</TableHead>
                  <TableHead style={typography.label}>TYPE</TableHead>
                  <TableHead style={typography.label}>LOCATION</TableHead>
                  <TableHead style={typography.label}>SEVERITY</TableHead>
                  <TableHead style={typography.label}>STATUS</TableHead>
                  <TableHead style={typography.label}>RESPONSE</TableHead>
                  <TableHead style={typography.label}>UNITS</TableHead>
                  <TableHead style={typography.label} className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow 
                    key={incident.id} 
                    style={{ borderColor: colors.background.border }} 
                    className="hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setSelectedIncident(incident.id)}
                  >
                    <TableCell>
                      <div>
                        <p style={{ ...typography.body, fontWeight: '700' }}>{incident.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Camera size={10} style={{ color: colors.text.muted }} />
                          <p style={{ ...typography.caption, fontSize: '9px' }}>{incident.cameraId}</p>
                          <Clock size={10} style={{ color: colors.text.muted }} />
                          <p style={{ ...typography.caption, fontSize: '9px' }}>{incident.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={incident.type} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} style={{ color: colors.accent.primary }} />
                        <span style={typography.caption}>{incident.location}</span>
                      </div>
                      {incident.weather && (
                        <p style={{ ...typography.caption, fontSize: '9px', marginTop: '2px' }}>
                          {incident.weather} · {incident.roadCondition}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge style={{
                        backgroundColor: incident.severity === 'critical' ? colors.status.critical.soft : 
                                       incident.severity === 'high' ? colors.status.warning.soft :
                                       incident.severity === 'medium' ? colors.status.info.soft : colors.status.safe.soft,
                        color: incident.severity === 'critical' ? colors.status.critical.main : 
                               incident.severity === 'high' ? colors.status.warning.main :
                               incident.severity === 'medium' ? colors.status.info.main : colors.status.safe.main,
                        border: 'none'
                      }}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p style={{ ...typography.body, fontWeight: '600' }}>{incident.responseTime}m</p>
                        <p style={typography.caption}>avg</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {incident.assignedUnits.slice(0, 3).map((unit, i) => (
                          <div
                            key={i}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '20px',
                              backgroundColor: colors.accent.primary + '20',
                              border: `2px solid ${colors.background.sidebar}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '8px',
                              fontWeight: 600,
                              color: colors.accent.primary
                            }}
                          >
                            {unit.split('-')[0]}
                          </div>
                        ))}
                        {incident.assignedUnits.length > 3 && (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '20px',
                              backgroundColor: colors.background.elevated,
                              border: `2px solid ${colors.background.sidebar}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '8px',
                              fontWeight: 600,
                              color: colors.text.muted
                            }}
                          >
                            +{incident.assignedUnits.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" style={{ color: colors.accent.primary }}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: colors.text.muted }}>
                          <FileText size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: colors.background.border }}>
            <p style={typography.caption}>Showing {filteredIncidents.length} of 158 incidents</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" style={{ backgroundColor: colors.accent.primary + '20', color: colors.accent.primary }}>1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};