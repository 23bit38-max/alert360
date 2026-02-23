/**
 * DEMO CREDENTIALS COMPONENT
 * 
 * 🎯 For Beginners:
 * This component shows all the available demo accounts with their login credentials.
 * It's designed to make testing the application easy by providing clear access information.
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Copy, User, Mail, Lock, Shield, Siren, Phone } from 'lucide-react';
import { MOCK_USERS } from '../../data/data';

interface DemoCredentialsProps {
  onSelectAccount?: (email: string, password: string) => void;
}

export const DemoCredentials = ({ onSelectAccount }: DemoCredentialsProps) => {
  const accounts = [
    {
      ...MOCK_USERS.super_admin,
      title: 'Super Administrator',
      description: 'Full system access - Monitor all departments',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      ...MOCK_USERS.police_admin,
      title: 'Police Department Admin',
      description: 'Traffic management & crime response',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      ...MOCK_USERS.fire_admin,
      title: 'Fire Department Admin',
      description: 'Fire emergencies & rescue operations',
      icon: Siren,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      ...MOCK_USERS.hospital_admin,
      title: 'Hospital Admin',
      description: 'Medical emergencies & ambulance dispatch',
      icon: Phone,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Card className="glass border-glass-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Demo Account Credentials
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Use these accounts to test different role-based features of the system
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => {
          const IconComponent = account.icon;
          return (
            <div 
              key={account.id} 
              className={`p-4 rounded-lg ${account.bgColor} border ${account.borderColor} hover:bg-white/5 transition-all duration-200`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${account.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{account.name}</h3>
                    <Badge variant="secondary" className="glass bg-white/10 text-white">
                      {account.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{account.title}</p>
                  <p className="text-gray-400 text-xs mb-3">{account.description}</p>
                  
                  {/* Credentials */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm font-mono">{account.email}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(account.email)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm font-mono">{account.password}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(account.password)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy password"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Login Button */}
                  {onSelectAccount && (
                    <button
                      onClick={() => onSelectAccount(account.email, account.password)}
                      className="mt-3 w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
                    >
                      Use This Account
                    </button>
                  )}
                </div>
              </div>
              
              {/* Zone Coverage */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">Zone Coverage:</p>
                <div className="flex flex-wrap gap-1">
                  {account.zones.map((zone) => (
                    <Badge 
                      key={zone} 
                      variant="outline" 
                      className="text-xs border-white/20 text-gray-300"
                    >
                      {zone === 'all' ? 'All Zones' : zone.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Quick Reference */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <h4 className="text-blue-400 font-medium mb-2">🚀 Quick Start Guide</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>Super Admin:</strong> Can view all data but cannot make changes (monitoring only)</p>
            <p>• <strong>Department Admins:</strong> Can respond to alerts and manage incidents in their zones</p>
            <p>• <strong>Role-Based Access:</strong> Each user sees different data based on their department</p>
            <p>• <strong>Security:</strong> All passwords are visible for demo purposes only</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};