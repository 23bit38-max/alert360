import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Upload,
  Video,
  Image as ImageIcon,
  MapPin,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Camera,
  Car,
  Flame,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { SEVERITY_LEVELS, INCIDENT_TYPES, ZONES } from '../shared/constants';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export const ManualUpload = () => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [vehiclesInvolved, setVehiclesInvolved] = useState('');
  const [casualties, setCasualties] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [witnessInfo, setWitnessInfo] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploaded = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image') ? 'image' : 'video' as 'image' | 'video',
      }));
      setUploadedFiles((prev) => [...prev, ...uploaded]);
    }
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';
    input.onchange = (event) => handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    toast.info('File removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }
    if (!incidentType) {
      toast.error('Please select an incident type');
      return;
    }
    if (!severity) {
      toast.error('Please select severity level');
      return;
    }
    if (!location) {
      toast.error('Please enter location');
      return;
    }
    if (!zone) {
      toast.error('Please select a zone');
      return;
    }

    setUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would upload to Supabase Storage and save metadata to database
      const incidentData = {
        type: incidentType,
        severity,
        location,
        zone,
        latitude: latitude || null,
        longitude: longitude || null,
        description,
        vehiclesInvolved: vehiclesInvolved || null,
        casualties: casualties || null,
        incidentDate: incidentDate || new Date().toISOString().split('T')[0],
        incidentTime: incidentTime || new Date().toTimeString().split(' ')[0],
        cameraId: cameraId || null,
        witnessInfo: witnessInfo || null,
        additionalNotes: additionalNotes || null,
        uploadedBy: user?.name,
        uploadedByRole: user?.role,
        files: uploadedFiles.map(f => ({
          name: f.file.name,
          type: f.type,
          size: f.file.size
        })),
        status: 'pending_review',
        createdAt: new Date().toISOString()
      };

      console.log('Incident data to be saved:', incidentData);

      toast.success('Incident uploaded successfully!', {
        description: 'The incident has been saved and is pending review.'
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload incident');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadedFiles([]);
    setIncidentType('');
    setSeverity('');
    setLocation('');
    setZone('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setVehiclesInvolved('');
    setCasualties('');
    setIncidentDate('');
    setIncidentTime('');
    setCameraId('');
    setWitnessInfo('');
    setAdditionalNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Ingestion Operational Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Upload size={14} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Evidence Ingestion: </span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Manual Entry Protocol</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-lg">
            Upload System Active
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <Card className="glass border-glass-border neon-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-electric-blue" />
              Upload Media Files
            </CardTitle>
            <CardDescription>Upload images or videos of the incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Button */}
            <div className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center hover:border-electric-blue transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-electric-blue" />
                </div>
                <div>
                  <p className="text-white mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">
                    Images: JPG, PNG, GIF (max 10MB) • Videos: MP4, AVI, MOV (max 100MB)
                  </p>
                </div>
                <Button type="button" className="mt-2">
                  Select Files
                </Button>
              </label>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div
                      key={index}
                      className="relative glass rounded-lg overflow-hidden group"
                    >
                      {/* File Preview */}
                      {uploadedFile.type === 'image' ? (
                        <img
                          src={uploadedFile.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <video
                          src={uploadedFile.preview}
                          className="w-full h-48 object-cover"
                          controls
                        />
                      )}

                      {/* File Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <div className="flex items-center gap-2">
                          {uploadedFile.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-electric-blue" />
                          ) : (
                            <Video className="w-4 h-4 text-neon-red" />
                          )}
                          <span className="text-xs text-white truncate flex-1">
                            {uploadedFile.file.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incident Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <Card className="glass border-glass-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-neon-red" />
                Incident Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Incident Type */}
              <div className="space-y-2">
                <Label htmlFor="incident-type" className="text-white">
                  Incident Type *
                </Label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger className="glass border-glass-border">
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
                <Label htmlFor="severity" className="text-white">
                  Severity Level *
                </Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="glass border-glass-border">
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
                <Label htmlFor="vehicles" className="text-white">
                  Vehicles Involved
                </Label>
                <Input
                  id="vehicles"
                  type="number"
                  min="0"
                  value={vehiclesInvolved}
                  onChange={(e) => setVehiclesInvolved(e.target.value)}
                  placeholder="Number of vehicles"
                  className="glass border-glass-border text-white placeholder:text-gray-500"
                />
              </div>

              {/* Casualties */}
              <div className="space-y-2">
                <Label htmlFor="casualties" className="text-white">
                  Casualties / Injuries
                </Label>
                <Input
                  id="casualties"
                  type="number"
                  min="0"
                  value={casualties}
                  onChange={(e) => setCasualties(e.target.value)}
                  placeholder="Number of casualties"
                  className="glass border-glass-border text-white placeholder:text-gray-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Incident Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the incident..."
                  rows={4}
                  className="glass border-glass-border text-white placeholder:text-gray-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <Card className="glass border-glass-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lime-green" />
                Location & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zone */}
              <div className="space-y-2">
                <Label htmlFor="zone" className="text-white">
                  Zone *
                </Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger className="glass border-glass-border">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {ZONES.map((z) => (
                      <SelectItem key={z} value={z}>
                        {z.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">
                  Location Address *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Main Street & 5th Avenue"
                  className="glass border-glass-border text-white placeholder:text-gray-500"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-white">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 40.7128"
                    className="glass border-glass-border text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-white">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., -74.0060"
                    className="glass border-glass-border text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-date" className="text-white">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Incident Date
                  </Label>
                  <Input
                    id="incident-date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="glass border-glass-border text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-time" className="text-white">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Incident Time
                  </Label>
                  <Input
                    id="incident-time"
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="glass border-glass-border text-white"
                  />
                </div>
              </div>

              {/* Camera ID */}
              <div className="space-y-2">
                <Label htmlFor="camera-id" className="text-white">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Camera ID (if applicable)
                </Label>
                <Input
                  id="camera-id"
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  placeholder="e.g., CAM-Z1-001"
                  className="glass border-glass-border text-white placeholder:text-gray-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="glass border-glass-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-electric-blue" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Witness Information */}
            <div className="space-y-2">
              <Label htmlFor="witness-info" className="text-white">
                Witness Information
              </Label>
              <Textarea
                id="witness-info"
                value={witnessInfo}
                onChange={(e) => setWitnessInfo(e.target.value)}
                placeholder="Names, contact details, or statements from witnesses..."
                rows={3}
                className="glass border-glass-border text-white placeholder:text-gray-500 resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additional-notes" className="text-white">
                Additional Notes
              </Label>
              <Textarea
                id="additional-notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any other relevant information..."
                rows={3}
                className="glass border-glass-border text-white placeholder:text-gray-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between glass border-glass-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground">
            * Required fields must be filled
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={uploading}
              className="border-glass-border hover:bg-white/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="bg-electric-blue hover:bg-electric-blue/80 text-black neon-glow"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Incident
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Added usage for openFilePicker */}
      <Button onClick={openFilePicker}>Upload Files</Button>
    </div>
  );
};
