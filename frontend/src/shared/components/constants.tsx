// Severity levels for incidents with colors and labels
export const SEVERITY_LEVELS = {
  critical: { color: 'bg-red-500/80 text-white', label: 'Critical' },
  high: { color: 'bg-orange-500/80 text-white', label: 'High' },
  medium: { color: 'bg-yellow-500/80 text-black', label: 'Medium' },
  low: { color: 'bg-green-500/80 text-white', label: 'Low' }
} as const;

// Status levels for incident tracking
export const STATUS_LEVELS = {
  active: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Active' },
  responding: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Responding' },
  resolved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Resolved' },
  escalated: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Escalated' },
  dismissed: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Dismissed' }
} as const;

// Types of incidents that can be detected
export const INCIDENT_TYPES = {
  collision: { color: 'bg-red-500/20 text-red-400', label: 'Collision' },
  rollover: { color: 'bg-orange-500/20 text-orange-400', label: 'Rollover' },
  fire: { color: 'bg-red-600/20 text-red-300', label: 'Fire' },
  medical: { color: 'bg-blue-500/20 text-blue-400', label: 'Medical' },
  other: { color: 'bg-gray-500/20 text-gray-400', label: 'Other' }
} as const;

// User roles with colors, labels, and permissions
export const USER_ROLES = {
  super_admin: { 
    color: 'from-purple-500 to-pink-500', 
    label: 'Super Admin',
    permissions: ['all']
  },
  police_admin: { 
    color: 'from-blue-500 to-cyan-500', 
    label: 'Police Admin',
    permissions: ['alerts', 'cameras', 'incidents', 'map']
  },
  fire_admin: { 
    color: 'from-red-500 to-orange-500', 
    label: 'Fire Admin',
    permissions: ['alerts', 'cameras', 'incidents', 'map']
  },
  hospital_admin: { 
    color: 'from-green-500 to-emerald-500', 
    label: 'Hospital Admin',
    permissions: ['alerts', 'incidents', 'map']
  }
} as const;

// Mumbai zones for incident management
export const ZONES = [
  'north-Mumbai', 
  'south-Mumbai', 
  'central-Mumbai', 
  'west-Mumbai', 
  'east-Mumbai'
] as const;

// Available notification channels
export const NOTIFICATION_CHANNELS = {
  email: { icon: 'Mail', label: 'Email' },
  sms: { icon: 'Phone', label: 'SMS' },
  whatsapp: { icon: 'MessageSquare', label: 'WhatsApp' },
  push: { icon: 'Bell', label: 'Push Notifications' }
} as const;
