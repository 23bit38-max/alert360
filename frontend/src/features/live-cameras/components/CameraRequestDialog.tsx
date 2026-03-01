import { useState } from 'react';
import { Camera, FileText, Building } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { useNotifications } from '@/shared/components/NotificationService';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

interface CameraRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CameraRequestDialog = ({ open, onOpenChange }: CameraRequestDialogProps) => {
    const { user } = useAuth();
    const { showToast, addNotification } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Camera request form state
    const [requestForm, setRequestForm] = useState({
        name: '',
        location: '',
        zone: user?.assignedZones?.[0] || '',
        justification: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        estimatedCost: ''
    });

    // Handle form submission
    const handleRequestSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            // Send notification to super admin
            addNotification({
                type: 'camera_request',
                title: 'New Camera Request',
                message: `${user?.department} department has requested a new camera installation at ${requestForm.location}`,
                priority: requestForm.priority as 'low' | 'medium' | 'high' | 'critical',
                department: user?.department,
                requestedBy: user?.name
            });

            // Show success message
            showToast('success', 'Request Submitted', 'Your camera request has been submitted to the Approval Center for review');

            // Reset form
            setRequestForm({
                name: '',
                location: '',
                zone: user?.assignedZones?.[0] || '',
                justification: '',
                priority: 'medium',
                estimatedCost: ''
            });
            onOpenChange(false);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-glass-border backdrop-blur-xl max-w-[95vw] w-full sm:max-w-2xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-electric-blue" />
                        Request New Camera Installation
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Submit a request for new camera installation. This will be reviewed by Super Administrators.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4 p-4 glass rounded-xl border border-glass-border">
                            <h4 className="text-white font-medium flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-electric-blue" />
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-muted-foreground">Camera Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter descriptive camera name"
                                        value={requestForm.name}
                                        onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                                        className="glass border-glass-border bg-background/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-muted-foreground">Installation Location *</Label>
                                    <Input
                                        id="location"
                                        placeholder="Enter specific location details"
                                        value={requestForm.location}
                                        onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                                        className="glass border-glass-border bg-background/20 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Justification */}
                        <div className="space-y-4 p-4 glass rounded-xl border border-glass-border">
                            <h4 className="text-white font-medium flex items-center">
                                <Building className="w-4 h-4 mr-2 text-electric-blue" />
                                Request Justification
                            </h4>
                            <div className="space-y-2">
                                <Label htmlFor="justification" className="text-muted-foreground">Why is this camera needed? *</Label>
                                <Textarea
                                    id="justification"
                                    placeholder="Provide detailed justification..."
                                    value={requestForm.justification}
                                    onChange={(e) => setRequestForm({ ...requestForm, justification: e.target.value })}
                                    className="glass border-glass-border bg-background/20 text-white min-h-20"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="flex space-x-4 pt-2">
                    <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleRequestSubmit} disabled={isSubmitting} className="bg-electric-blue text-black">
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
