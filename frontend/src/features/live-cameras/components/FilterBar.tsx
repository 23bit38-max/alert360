import { Search, Filter } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/shared/components/ui/select';

interface FilterBarProps {
    selectedZone: string;
    setSelectedZone: (zone: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const FilterBar = ({
    selectedZone,
    setSelectedZone,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
}: FilterBarProps) => {
    return (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-xl backdrop-blur-sm">
            <Filter className="w-4 h-4 text-gray-500 ml-2 mr-2" />

            <div className="h-6 w-px bg-white/10 mx-1" />

            <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="w-40 border-0 bg-transparent text-white focus:ring-0 h-9 p-0 hover:bg-white/5 px-2 rounded transition-colors">
                    <div className="flex flex-col items-start gap-0.5 text-left">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Zone</span>
                        <span className="text-xs truncate max-w-[140px] block">{selectedZone === 'all' ? 'All Zones' : selectedZone.replace('-', ' ')}</span>
                    </div>
                </SelectTrigger>
                <SelectContent className="glass border-glass-border">
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="central-Mumbai">Central Mumbai</SelectItem>
                    <SelectItem value="south-Mumbai">South Mumbai</SelectItem>
                    <SelectItem value="north-Mumbai">North Mumbai</SelectItem>
                </SelectContent>
            </Select>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 border-0 bg-transparent text-white focus:ring-0 h-9 p-0 hover:bg-white/5 px-2 rounded transition-colors">
                    <div className="flex flex-col items-start gap-0.5 text-left">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                        <span className="text-xs truncate block">{selectedStatus === 'all' ? 'All Status' : selectedStatus}</span>
                    </div>
                </SelectTrigger>
                <SelectContent className="glass border-glass-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
            </Select>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                <Input
                    placeholder="Search active feeds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/20 border-white/10 h-9 pl-9 text-xs text-white focus:border-electric-blue/50 rounded-lg placeholder:text-gray-600"
                />
            </div>
        </div>
    );
};

