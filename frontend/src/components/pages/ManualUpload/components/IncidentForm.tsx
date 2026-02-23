import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../ui/select';
import {
    AlertTriangle,
    MapPin,
    Calendar,
    Clock,
    FileText,
    Car,
    Flame,
    Truck,
    Users,
    Camera,
    Navigation,
} from 'lucide-react';
import { SEVERITY_LEVELS, INCIDENT_TYPES } from '../../../shared/constants';

interface IncidentFormProps {
    uploading: boolean;
    incidentType: string;
    setIncidentType: (v: string) => void;
    severity: string;
    setSeverity: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
    zone: string;
    setZone: (v: string) => void;
    latitude: string;
    setLatitude: (v: string) => void;
    longitude: string;
    setLongitude: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    vehiclesInvolved: string;
    setVehiclesInvolved: (v: string) => void;
    casualties: string;
    setCasualties: (v: string) => void;
    incidentDate: string;
    setIncidentDate: (v: string) => void;
    incidentTime: string;
    setIncidentTime: (v: string) => void;
    cameraId: string;
    setCameraId: (v: string) => void;
    witnessInfo: string;
    setWitnessInfo: (v: string) => void;
    additionalNotes: string;
    setAdditionalNotes: (v: string) => void;
    availableZones: string[];
    onGetCurrentLocation: () => void;
}

export const IncidentForm = ({
    uploading,
    incidentType, setIncidentType,
    severity, setSeverity,
    location, setLocation,
    zone, setZone,
    latitude, setLatitude,
    longitude, setLongitude,
    description, setDescription,
    vehiclesInvolved, setVehiclesInvolved,
    casualties, setCasualties,
    incidentDate, setIncidentDate,
    incidentTime, setIncidentTime,
    cameraId, setCameraId,
    witnessInfo, setWitnessInfo,
    additionalNotes, setAdditionalNotes,
    availableZones,
    onGetCurrentLocation,
}: IncidentFormProps) => (
    <>
        {/* Incident Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Incident Information */}
            <Card className="glass border-glass-border hover:border-neon-red/30 transition-colors">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-neon-red" />
                        Incident Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Incident Type */}
                    <div className="space-y-2">
                        <Label htmlFor="incident-type" className="text-white flex items-center gap-1">
                            Incident Type <span className="text-neon-red">*</span>
                        </Label>
                        <Select value={incidentType} onValueChange={setIncidentType} disabled={uploading}>
                            <SelectTrigger className="glass border-glass-border hover:border-electric-blue/50 transition-colors">
                                <SelectValue placeholder="Select incident type" />
                            </SelectTrigger>
                            <SelectContent className="glass border-glass-border">
                                {Object.entries(INCIDENT_TYPES).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            {key === 'collision' && <Car className="w-4 h-4" />}
                                            {key === 'rollover' && <Truck className="w-4 h-4" />}
                                            {key === 'fire' && <Flame className="w-4 h-4" />}
                                            {key === 'medical' && <Users className="w-4 h-4" />}
                                            {key === 'other' && <AlertTriangle className="w-4 h-4" />}
                                            {value.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Severity */}
                    <div className="space-y-2">
                        <Label htmlFor="severity" className="text-white flex items-center gap-1">
                            Severity Level <span className="text-neon-red">*</span>
                        </Label>
                        <Select value={severity} onValueChange={setSeverity} disabled={uploading}>
                            <SelectTrigger className="glass border-glass-border hover:border-electric-blue/50 transition-colors">
                                <SelectValue placeholder="Select severity level" />
                            </SelectTrigger>
                            <SelectContent className="glass border-glass-border">
                                {Object.entries(SEVERITY_LEVELS).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${value.color}`}></div>
                                            {value.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Vehicles Involved */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicles" className="text-white flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            Vehicles Involved
                        </Label>
                        <Input
                            id="vehicles"
                            type="number"
                            min="0"
                            value={vehiclesInvolved}
                            onChange={(e) => setVehiclesInvolved(e.target.value)}
                            placeholder="Number of vehicles"
                            className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                            disabled={uploading}
                        />
                    </div>

                    {/* Casualties */}
                    <div className="space-y-2">
                        <Label htmlFor="casualties" className="text-white flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Casualties / Injuries
                        </Label>
                        <Input
                            id="casualties"
                            type="number"
                            min="0"
                            value={casualties}
                            onChange={(e) => setCasualties(e.target.value)}
                            placeholder="Number of casualties"
                            className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                            disabled={uploading}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Incident Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide a detailed description of the incident..."
                            rows={4}
                            className="glass border-glass-border text-white placeholder:text-gray-500 resize-none hover:border-electric-blue/50 transition-colors"
                            disabled={uploading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Right Column - Location & Time */}
            <Card className="glass border-glass-border hover:border-lime-green/30 transition-colors">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-lime-green" />
                        Location & Time
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Zone */}
                    <div className="space-y-2">
                        <Label htmlFor="zone" className="text-white flex items-center gap-1">
                            Zone <span className="text-neon-red">*</span>
                        </Label>
                        <Select value={zone} onValueChange={setZone} disabled={uploading}>
                            <SelectTrigger className="glass border-glass-border hover:border-electric-blue/50 transition-colors">
                                <SelectValue placeholder="Select zone" />
                            </SelectTrigger>
                            <SelectContent className="glass border-glass-border">
                                {availableZones.map((z) => (
                                    <SelectItem key={z} value={z}>
                                        {z.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-white flex items-center gap-1">
                            Location Address <span className="text-neon-red">*</span>
                        </Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Main Street & 5th Avenue"
                            className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                            disabled={uploading}
                        />
                    </div>

                    {/* Coordinates with Auto-detect */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-white">GPS Coordinates</Label>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onGetCurrentLocation}
                                disabled={uploading}
                                className="border-lime-green/30 text-lime-green hover:bg-lime-green/10 hover:text-lime-green"
                            >
                                <Navigation className="w-3 h-3 mr-1" />
                                Auto-detect
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude" className="text-sm text-muted-foreground">
                                    Latitude
                                </Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="e.g., 40.7128"
                                    className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                                    disabled={uploading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude" className="text-sm text-muted-foreground">
                                    Longitude
                                </Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="e.g., -74.0060"
                                    className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="incident-date" className="text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date
                            </Label>
                            <Input
                                id="incident-date"
                                type="date"
                                value={incidentDate}
                                onChange={(e) => setIncidentDate(e.target.value)}
                                className="glass border-glass-border text-white hover:border-electric-blue/50 transition-colors"
                                disabled={uploading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="incident-time" className="text-white flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Time
                            </Label>
                            <Input
                                id="incident-time"
                                type="time"
                                value={incidentTime}
                                onChange={(e) => setIncidentTime(e.target.value)}
                                className="glass border-glass-border text-white hover:border-electric-blue/50 transition-colors"
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    {/* Camera ID */}
                    <div className="space-y-2">
                        <Label htmlFor="camera-id" className="text-white flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Camera ID (if applicable)
                        </Label>
                        <Input
                            id="camera-id"
                            value={cameraId}
                            onChange={(e) => setCameraId(e.target.value)}
                            placeholder="e.g., CAM-Z1-001"
                            className="glass border-glass-border text-white placeholder:text-gray-500 hover:border-electric-blue/50 transition-colors"
                            disabled={uploading}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Additional Information */}
        <Card className="glass border-glass-border hover:border-electric-blue/30 transition-colors">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-electric-blue" />
                    Additional Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Witness Information */}
                <div className="space-y-2">
                    <Label htmlFor="witness-info" className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Witness Information
                    </Label>
                    <Textarea
                        id="witness-info"
                        value={witnessInfo}
                        onChange={(e) => setWitnessInfo(e.target.value)}
                        placeholder="Names, contact details, or statements from witnesses..."
                        rows={3}
                        className="glass border-glass-border text-white placeholder:text-gray-500 resize-none hover:border-electric-blue/50 transition-colors"
                        disabled={uploading}
                    />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                    <Label htmlFor="additional-notes" className="text-white flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Additional Notes
                    </Label>
                    <Textarea
                        id="additional-notes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any other relevant information..."
                        rows={3}
                        className="glass border-glass-border text-white placeholder:text-gray-500 resize-none hover:border-electric-blue/50 transition-colors"
                        disabled={uploading}
                    />
                </div>
            </CardContent>
        </Card>
    </>
);
