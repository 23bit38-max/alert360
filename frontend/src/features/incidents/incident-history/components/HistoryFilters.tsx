import { Filter, Search, Calendar, AlertOctagon, AlertTriangle, Archive } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface HistoryFiltersProps {
    colors: any;
    sizes: any;
    typography: any;
    GlobalStyles: any;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    timeRange: string;
    setTimeRange: (t: string) => void;
    selectedType: string;
    setSelectedType: (t: string) => void;
    selectedSeverity: string;
    setSelectedSeverity: (s: string) => void;
    viewMode: 'table' | 'analytics';
    setViewMode: (v: 'table' | 'analytics') => void;
    user: any;
}

export const HistoryFilters = ({
    colors,
    sizes,
    typography,
    GlobalStyles,
    searchQuery,
    setSearchQuery,
    timeRange,
    setTimeRange,
    selectedType,
    setSelectedType,
    selectedSeverity,
    setSelectedSeverity,
    viewMode,
    setViewMode,
    user
}: HistoryFiltersProps) => (
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
                        Table
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
                        Analytics
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
);
