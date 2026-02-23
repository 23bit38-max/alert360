import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { USER_ROLES, ZONES } from '../../shared/constants';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
}

export const AddUserModal = ({ open, onClose, onAddUser }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    zones: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;

    const newUser = {
      ...formData,
      status: 'active',
      lastLogin: new Date()
    };

    onAddUser(newUser);
    setFormData({ name: '', email: '', role: '', department: '', zones: [] });
  };

  const handleZoneToggle = (zone: string) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones.includes(zone)
        ? prev.zones.filter(z => z !== zone)
        : [...prev.zones, zone]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-glass-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="glass border-glass-border bg-white/5 text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="glass border-glass-border bg-white/5 text-white"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className="glass border-glass-border bg-white/5 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="glass border-glass-border">
                {Object.entries(USER_ROLES).map(([key, role]) => (
                  <SelectItem key={key} value={key}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Department</Label>
            <Input
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="glass border-glass-border bg-white/5 text-white"
              placeholder="Enter department"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Access Zones</Label>
            <div className="grid grid-cols-2 gap-2">
              {ZONES.map((zone) => (
                <div key={zone} className="flex items-center space-x-2">
                  <Checkbox
                    id={zone}
                    checked={formData.zones.includes(zone)}
                    onCheckedChange={() => handleZoneToggle(zone)}
                  />
                  <Label htmlFor={zone} className="text-sm text-gray-300">
                    {zone.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};