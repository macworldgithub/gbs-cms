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
            // commented permissions
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
            // commented permissions
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

  // ✅ API INTEGRATED METHOD
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch('http://localhost:9000/user');
      const data = await response.json();

      // Transform the backend data to match your `User` type
      const users: User[] = data.map((u: any) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        avatar: '', // set default avatar or extract if available
        bio: '',
        location: '',
        dateOfBirth: new Date(), // fallback, or parse if exists
        isActive: true,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
          privacy: {
            profileVisibility: 'public',
            showEmail: true,
            showPhone: true,
            allowMessages: true,
          },
        },
        roles: u.activatedPackage?.role
          ? [
              {
                id: u.activatedPackage.role._id,
                name: u.activatedPackage.role.name,
                description: u.activatedPackage.role.label,
                isActive: true,
                createdAt: new Date(u.activatedPackage.role.createdAt),
                updatedAt: new Date(u.activatedPackage.role.updatedAt),
                permissions:
                  u.activatedPackage.role.permissions?.map((p: any) => ({
                    id: p.permission._id,
                    name: p.permission.name,
                    description: p.permission.label,
                    resource: '',
                    action: '',
                    isActive: true,
                    createdAt: new Date(p.permission.createdAt),
                    updatedAt: new Date(p.permission.updatedAt),
                  })) || [],
              },
            ]
          : [],
      }));

      return users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`http://localhost:9000/user/${id}`);

    if (!response.ok) {
      throw new Error(`User with ID ${id} not found`);
    }

    const user = await response.json();

    // Transform to match your `User` interface
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: '', // add avatar if available in API
      bio: '',
      location: '',
      dateOfBirth: new Date(), // If available in API, replace this
      isActive: true,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en',
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: true,
          allowMessages: true,
        },
      },
      roles: user.activatedPackage?.role
        ? [
            {
              id: user.activatedPackage.role._id,
              name: user.activatedPackage.role.name,
              description: user.activatedPackage.role.label,
              isActive: true,
              createdAt: new Date(user.activatedPackage.role.createdAt),
              updatedAt: new Date(user.activatedPackage.role.updatedAt),
              permissions:
                user.activatedPackage.role.permissions?.map((p: any) => ({
                  id: p.permission._id,
                  name: p.permission.name,
                  description: p.permission.label,
                  resource: '',
                  action: '',
                  isActive: true,
                  createdAt: new Date(p.permission.createdAt),
                  updatedAt: new Date(p.permission.updatedAt),
                })) || [],
            },
          ]
        : [],
    };
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    return null;
  }
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
  try {
    const response = await fetch(`http://localhost:9000/user/${id}`, {
      method: 'PATCH', // Use 'PATCH' if your API requires
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user with ID ${id}`);
    }

    const updatedUser = await response.json();

    // Mapping API response to local User type
    return {
      id: updatedUser._id || id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      avatar: '', // You can update this if your API returns avatar
      bio: '',
      location: '',
      dateOfBirth: new Date(), // If API provides dateOfBirth, use that
      isActive: true,
      createdAt: new Date(updatedUser.createdAt),
      updatedAt: new Date(updatedUser.updatedAt),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en',
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: true,
          allowMessages: true,
        },
      },
      roles: updatedUser.activatedPackage?.role
        ? [
            {
              id: updatedUser.activatedPackage.role._id,
              name: updatedUser.activatedPackage.role.name,
              description: updatedUser.activatedPackage.role.label,
              isActive: true,
              createdAt: new Date(updatedUser.activatedPackage.role.createdAt),
              updatedAt: new Date(updatedUser.activatedPackage.role.updatedAt),
              permissions:
                updatedUser.activatedPackage.role.permissions?.map((p: any) => ({
                  id: p.permission._id,
                  name: p.permission.name,
                  description: p.permission.label,
                  resource: '',
                  action: '',
                  isActive: true,
                  createdAt: new Date(p.permission.createdAt),
                  updatedAt: new Date(p.permission.updatedAt),
                })) || [],
            },
          ]
        : [],
    };
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
}

 async deleteUser(id: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:9000/user/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }

    console.log(`User with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Delete user failed:', error);
    throw error;
  }
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
      user.isActive &&
      (user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.bio?.toLowerCase().includes(lowercaseQuery))
    );
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

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
