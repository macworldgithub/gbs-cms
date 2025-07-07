import { User, UserPreferences } from '../types';

class UserService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Software developer and tech enthusiast',
      location: 'New York, USA',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-15'),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en',
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: false,
          allowMessages: true,
        },
      },
      roles: [
        {
          id: '1',
          name: 'Super Admin',
          description: 'Full system access with all permissions',
          permissions: [
            {
              id: '1',
              name: 'users.create',
              description: 'Create new users',
              resource: 'users',
              action: 'create',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '2',
              name: 'users.read',
              description: 'View user information',
              resource: 'users',
              action: 'read',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '3',
              name: 'users.update',
              description: 'Update user information',
              resource: 'users',
              action: 'update',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '4',
              name: 'users.delete',
              description: 'Delete users',
              resource: 'users',
              action: 'delete',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '5',
              name: 'events.manage',
              description: 'Full event management',
              resource: 'events',
              action: 'manage',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '6',
              name: 'chats.moderate',
              description: 'Moderate chat conversations',
              resource: 'chats',
              action: 'moderate',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '7',
              name: 'roles.manage',
              description: 'Manage roles and permissions',
              resource: 'roles',
              action: 'manage',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ],
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Event organizer and community builder',
      location: 'Los Angeles, USA',
      preferences: {
        notifications: true,
        darkMode: true,
        language: 'en',
        privacy: {
          profileVisibility: 'friends',
          showEmail: false,
          showPhone: false,
          allowMessages: true,
        },
      },
      roles: [
        {
          id: '2',
          name: 'Event Manager',
          description: 'Manage events and related content',
          permissions: [
            {
              id: '2',
              name: 'users.read',
              description: 'View user information',
              resource: 'users',
              action: 'read',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
            {
              id: '5',
              name: 'events.manage',
              description: 'Full event management',
              resource: 'events',
              action: 'manage',
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          ],
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      isActive: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.filter(user => user.isActive);
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date(),
    };

    return this.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index].isActive = false;
    this.users[index].updatedAt = new Date();
  }

  async updateUserPreferences(id: string, preferences: Partial<UserPreferences>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    user.preferences = { ...user.preferences, ...preferences };
    user.updatedAt = new Date();
    
    return user;
  }

  async searchUsers(query: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.isActive && (
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.bio?.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, you would fetch the role from roleService
    // For now, we'll create a mock role assignment
    user.updatedAt = new Date();
    return user;
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.roles = user.roles.filter(role => role.id !== roleId);
    user.updatedAt = new Date();
    return user;
  }
}

export const userService = new UserService();