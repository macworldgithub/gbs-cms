// Core Types for the entire application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: Date;
  preferences: UserPreferences;
  roles: Role[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: EventCategory;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  location: Location;
  organizer: User;
  attendees: User[];
  maxAttendees?: number;
  price?: number;
  tags: string[];
  isPopular: boolean;
  isLive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string; // For group chats
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  isActive: boolean;
  theme: ChatTheme;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  timestamp: Date;
  isRead: boolean;
  replyTo?: string;
}

export interface ChatTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundImage?: string;
  textColor: string;
}

export type EventCategory = 'music' | 'sports' | 'technology' | 'food' | 'art' | 'business' | 'other';
export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

// Language types
export interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  icon: string;
  selected: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LanguageFormData {
  name: string;
  nativeName: string;
  code: string;
  icon: string;
  isActive: boolean;
}

// Role and Permission Form Data
export interface RoleFormData {
  name: string;
  description: string;
  permissionIds: string[];
  isActive: boolean;
}

export interface PermissionFormData {
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface BulkRoleData {
  name: string;
  description: string;
  permissionNames: string[];
}

export interface BulkPermissionData {
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Context Types
export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

export interface EventContextType {
  events: Event[];
  popularEvents: Event[];
  upcomingEvents: Event[];
  liveEvents: Event[];
  loading: boolean;
  error: string | null;
  searchEvents: (query: string, location?: string) => Promise<Event[]>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchEvents: () => Promise<void>;
}

export interface ChatContextType {
  chats: Chat[];
  groupChats: Chat[];
  directChats: Chat[];
  chatThemes: ChatTheme[];
  loading: boolean;
  error: string | null;
  createChat: (chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  sendMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  updateChatTheme: (chatId: string, themeId: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  fetchChats: () => Promise<void>;
}

export interface RoleContextType {
  roles: Role[];
  loading: boolean;
  error: string | null;
  createRole: (role: RoleFormData) => Promise<void>;
  updateRole: (id: string, role: Partial<RoleFormData>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  addPermissionToRole: (roleId: string, permissionId: string) => Promise<void>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<void>;
  createBulkRoles: (roles: BulkRoleData[]) => Promise<void>;
  fetchRoles: () => Promise<void>;
}

export interface PermissionContextType {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  createPermission: (permission: PermissionFormData) => Promise<void>;
  updatePermission: (id: string, permission: Partial<PermissionFormData>) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;
  createBulkPermissions: (permissions: BulkPermissionData[]) => Promise<void>;
  fetchPermissions: () => Promise<void>;
}

export interface LanguageContextType {
  languages: Language[];
  selectedLanguage: Language | null;
  loading: boolean;
  error: string | null;
  addLanguage: (language: LanguageFormData) => Promise<void>;
  updateLanguage: (id: string, language: Partial<LanguageFormData>) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
  selectLanguage: (id: string) => Promise<void>;
  fetchLanguages: () => Promise<void>;
}