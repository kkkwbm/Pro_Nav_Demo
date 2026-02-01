import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockUser } from '../../demo/mockData';

// Mock users for demo mode
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@serwispro.pl',
    firstName: 'Admin',
    lastName: 'Główny',
    role: 'ADMIN',
    roles: ['ADMIN', 'ROLE_USER'],
    active: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    username: 'jan.technik',
    email: 'jan.technik@serwispro.pl',
    firstName: 'Jan',
    lastName: 'Technik',
    role: 'USER',
    roles: ['ROLE_USER'],
    active: true,
    createdAt: '2024-03-15',
  },
  {
    id: 3,
    username: 'anna.serwis',
    email: 'anna.serwis@serwispro.pl',
    firstName: 'Anna',
    lastName: 'Serwis',
    role: 'USER',
    roles: ['ROLE_USER'],
    active: true,
    createdAt: '2024-05-20',
  },
];

let demoUsers = DEMO_MODE ? JSON.parse(JSON.stringify(mockUsers)) : [];

class UsersAPI {
  // Get all users (admin only)
  static async getAllUsers() {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        data: demoUsers,
      };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Get user by ID
  static async getUserById(id) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const user = demoUsers.find(u => u.id === id);
      return {
        success: !!user,
        data: user,
        error: user ? null : 'User not found',
      };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Create new user (admin only)
  static async createUser(userData) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const newUser = {
        id: Date.now(),
        ...userData,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      demoUsers.push(newUser);
      return {
        success: true,
        data: newUser,
      };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Update user (admin only)
  static async updateUser(id, userData) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const index = demoUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        demoUsers[index] = { ...demoUsers[index], ...userData };
        return {
          success: true,
          data: demoUsers[index],
        };
      }
      return { success: false, error: 'User not found' };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Delete user (admin only)
  static async deleteUser(id) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      const index = demoUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        demoUsers.splice(index, 1);
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Toggle user active status (admin only)
  static async toggleUserStatus(id, active) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const index = demoUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        demoUsers[index].active = active;
        return {
          success: true,
          data: demoUsers[index],
        };
      }
      return { success: false, error: 'User not found' };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Update user roles (admin only)
  static async updateUserRoles(id, roles) {
    if (DEMO_MODE) {
      await simulateDelay(200);
      const index = demoUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        demoUsers[index].roles = roles;
        return {
          success: true,
          data: demoUsers[index],
        };
      }
      return { success: false, error: 'User not found' };
    }
    return { success: false, error: 'Demo mode only' };
  }

  // Reset user password (admin only)
  static async resetUserPassword(id, newPassword) {
    if (DEMO_MODE) {
      await simulateDelay(300);
      return {
        success: true,
        message: 'Hasło zostało zresetowane (tryb demo)',
      };
    }
    return { success: false, error: 'Demo mode only' };
  }
}

export default UsersAPI;
