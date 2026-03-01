/**
 * AUTHENTICATION CONTEXT
 * 
 * 🎯 For Beginners:
 * This file manages user login/logout and keeps track of who is currently logged in.
 * It's like a security guard that:
 * - Checks if someone is allowed to enter (login)
 * - Remembers who is currently inside (user state)
 * - Lets people leave (logout)
 * 
 * The AuthContext is used throughout the app to:
 * - Show different content based on who is logged in
 * - Protect certain pages from unauthorized access
 * - Display user-specific information
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Import our centralized data store
import { MOCK_USERS } from '@/data/data';
import type { User } from '@/data/data';

// Define the registration data type
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string;
  badgeId: string;
  zone: string;
  emergencyContact: string;
}

// Define the registration result type
export interface RegisterResult {
  success: boolean;
  message?: string;
}

// ===== TYPE DEFINITIONS =====
/**
 * Shape of our authentication context
 * This defines what functions and data will be available to components
 */
export interface AuthContextType {
  user: User | null;           // Currently logged in user (null if nobody is logged in)
  loading: boolean;            // Whether we're still checking if someone is logged in
  allUsers: User[];            // All users in the system (for management)
  updateUser: (updatedUser: User) => Promise<boolean>; // Function to update a user's data
  login: (email: string, password: string) => Promise<boolean>; // Function to log in
  logout: () => void;          // Function to log out
  register: (data: RegistrationData) => Promise<RegisterResult>; // Function to register a new user
}

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode; // The app components that will have access to auth
}

// ===== CREATE CONTEXT =====
// Create the authentication context (initially undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTHENTICATION PROVIDER COMPONENT
 * 
 * This component wraps our entire app and provides authentication functionality
 * to all child components. Think of it as the "security system" for our app.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ===== STATE MANAGEMENT =====
  const [user, setUser] = useState<User | null>(null);    // Currently logged in user
  const [loading, setLoading] = useState(true);           // Loading state
  // Store all users in state to allow modifications during the session
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('allUsers');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Hydrate Date objects
        return parsedUsers.map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt),
          lastModified: new Date(u.lastModified)
        }));
      }
      return Object.values(MOCK_USERS);
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return Object.values(MOCK_USERS);
    }
  });

  // ===== INITIALIZATION =====
  /**
   * When the app first loads, check if someone was already logged in
   * (by looking in localStorage - like a "remember me" feature)
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Try to get saved user data from browser storage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);

          // Verify this user still exists in our system (using local state)
          const validUser = allUsers.find(u => u.id === userData.id);
          if (validUser) {
            setUser(validUser); // Log them in automatically
          } else {
            localStorage.removeItem('currentUser'); // Clean up invalid data
          }
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('currentUser'); // Clean up corrupted data
      } finally {
        setLoading(false); // We're done checking
      }
    };

    initializeAuth();
  }, [allUsers]); // Re-run if allUsers changes, to ensure validUser check is against latest data

  // ===== DATA MANAGEMENT =====

  /**
   * UPDATE USER FUNCTION
   * 
   * Updates a user's data in the global state.
   * If the updated user is the currently logged-in user, updates their session too.
   */
  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      // 1. Update the user in the allUsers list
      const newUsers = allUsers.map(u =>
        u.id === updatedUser.id ? updatedUser : u
      );
      setAllUsers(newUsers);

      // 2. If this is the currently logged-in user, update their session
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Persist session
      }

      // 3. Persist all users to storage
      localStorage.setItem('allUsers', JSON.stringify(newUsers));

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  // ===== AUTHENTICATION FUNCTIONS =====

  /**
   * LOGIN FUNCTION
   * 
   * This function attempts to log in a user with email and password.
   * In a real app, this would send credentials to a server.
   * For our demo, we check against our mock users.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - true if login successful, false if failed
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate network delay (like a real login request)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with matching email and password
      const user = allUsers.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        // Login successful!
        setUser(user);

        // Save user to localStorage so they stay logged in
        // (even if they refresh the page or close the browser)
        localStorage.setItem('currentUser', JSON.stringify(user));

        console.log('✅ Login successful:', user.name, `(${user.role})`);
        return true;
      } else {
        // Login failed - wrong email or password
        console.log('❌ Login failed: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * LOGOUT FUNCTION
   * 
   * This function logs out the current user and cleans up their data.
   * It removes them from memory and from browser storage.
   */
  const logout = () => {
    console.log('👋 Logging out user:', user?.name);

    // Clear user from state
    setUser(null);

    // Clear user from browser storage
    localStorage.removeItem('currentUser');

    // In a real app, you might also:
    // - Invalidate the user's session on the server
    // - Clear any cached user data
    // - Redirect to login page
  };

  /**
   * REGISTER FUNCTION
   * 
   * This function registers a new user with the provided data.
   * In a real app, this would send the data to a server to create a new account.
   * For our demo, it just simulates a successful registration.
   * 
   * @param data - The registration data
   * @returns Promise<RegisterResult> - Result of the registration attempt
   */
  const register = async (data: RegistrationData): Promise<RegisterResult> => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Basic validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return {
          success: false,
          message: 'Please fill in all required fields'
        };
      }

      // Check if email already exists in allUsers
      const emailExists = allUsers.some(user =>
        user.email.toLowerCase() === data.email.toLowerCase()
      );

      if (emailExists) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      // In a real app, you would create the user in your database
      console.log('📝 Registration attempt:', {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        department: data.department
      });

      return {
        success: true,
        message: `Welcome ${data.firstName}! Your registration was successful.`
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // ===== CONTEXT VALUE =====
  /**
   * This object contains all the authentication data and functions
   * that will be available to components throughout the app
   */
  const contextValue: AuthContextType = {
    user,      // Current user (or null if not logged in)
    loading,   // Whether we're still initializing
    allUsers,  // All users in the system (for management)
    updateUser,// Function to update a user's data
    login,     // Function to log in
    logout,    // Function to log out  
    register   // Function to register a new user
  };

  // ===== RENDER =====
  /**
   * Provide the authentication context to all child components
   * This makes the auth data and functions available everywhere in the app
   */
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
/**
 * USEAUTH HOOK
 * 
 * This is a custom hook that makes it easy for components to access auth data.
 * Instead of importing and using the context directly, components can just call:
 * 
 * const { user, login, logout } = useAuth();
 * 
 * It's like a shortcut that also includes error checking.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Make sure this hook is only used inside the AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ===== HELPER FUNCTIONS =====

/**
 * Check if a user has a specific role
 * 
 * @param user - The user to check
 * @param role - The role to check for
 * @returns boolean - true if user has the role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role;
};

/**
 * Check if a user has any of the specified roles
 * 
 * @param user - The user to check
 * @param roles - Array of roles to check for
 * @returns boolean - true if user has any of the roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  return user ? roles.includes(user.role) : false;
};

/**
 * Check if a user can access a specific zone
 * 
 * @param user - The user to check
 * @param zone - The zone to check access for
 * @returns boolean - true if user can access the zone
 */
export const canAccessZone = (user: User | null, zone: string): boolean => {
  if (!user) return false;
  return (user.assignedZones?.includes('all') ?? false) || (user.assignedZones?.includes(zone) ?? false);
};