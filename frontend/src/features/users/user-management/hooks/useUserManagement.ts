import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { type User } from '@/data/data';

export const useUserManagement = () => {
    const { allUsers, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(['Core Access']));

    // Filter users based on search
    const filteredUsers = allUsers.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleDomain = (domain: string) => {
        const newExpanded = new Set(expandedDomains);
        if (newExpanded.has(domain)) {
            newExpanded.delete(domain);
        } else {
            newExpanded.add(domain);
        }
        setExpandedDomains(newExpanded);
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setEditMode(false);
    };

    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        const success = await updateUser(selectedUser);
        if (success) {
            setEditMode(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        if (selectedUser) {
            const originalUser = allUsers.find(u => u.id === selectedUser.id);
            if (originalUser) {
                setSelectedUser(originalUser);
            }
        }
    };

    return {
        allUsers,
        loading,
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        editMode,
        setEditMode,
        expandedDomains,
        filteredUsers,
        toggleDomain,
        handleSelectUser,
        handleSaveChanges,
        handleCancelEdit
    };
};
