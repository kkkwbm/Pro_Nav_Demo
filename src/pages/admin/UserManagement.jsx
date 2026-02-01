import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UsersAPI from '../../services/api/users';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import UserManagementHeader from '../../components/users/UserManagementHeader';
import UserFilters from '../../components/users/UserFilters';
import UserTable from '../../components/users/UserTable';
import AddUserModal from '../../components/users/AddUserModal';
import ResetPasswordModal from '../../components/users/ResetPasswordModal';
import EditUserModal from '../../components/users/EditUserModal';

const UserManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddUser, setShowAddUser] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  // Fetch users from API
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await UsersAPI.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
        console.error('Failed to load users:', result.error);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania użytkowników');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return;
    }

    try {
      const result = await UsersAPI.deleteUser(userId);
      
      if (result.success) {
        setUsers(users.filter(u => u.id !== userId));
        alert('Użytkownik został usunięty pomyślnie');
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas usuwania użytkownika');
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const result = await UsersAPI.toggleUserStatus(userId, !currentStatus);

      if (result.success) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, active: !currentStatus } : u
        ));
        alert(`Użytkownik został ${!currentStatus ? 'zatwierdzony i aktywowany' : 'dezaktywowany'}`);
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas zmiany statusu użytkownika');
      console.error('Error toggling user status:', err);
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      const result = await UsersAPI.resetUserPassword(userId, newPassword);

      if (result.success) {
        alert('Hasło użytkownika zostało zresetowane pomyślnie');
        setUserToResetPassword(null);
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas resetowania hasła');
      console.error('Error resetting password:', err);
    }
  };

  const handleEditUser = async (userId, userData) => {
    try {
      const result = await UsersAPI.updateUser(userId, userData);

      if (result.success) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, ...userData } : u
        ));
        alert('Dane użytkownika zostały zaktualizowane pomyślnie');
        setUserToEdit(null);
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas aktualizacji danych użytkownika');
      console.error('Error updating user:', err);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const result = await UsersAPI.createUser(userData);

      if (result.success) {
        setUsers([...users, result.data]);
        alert('Użytkownik został dodany pomyślnie');
        setShowAddUser(false);
        await loadUsers();
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas dodawania użytkownika');
      console.error('Error creating user:', err);
    }
  };


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'ALL' || user.roles.includes(filterRole);

    const matchesStatus = filterStatus === 'ALL' ||
                         (filterStatus === 'ACTIVE' && user.active) ||
                         (filterStatus === 'PENDING' && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f3ef',
    padding: '20px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: 16,
            fontSize: 16,
            color: '#6b7280'
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #e67e22',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            Ładowanie użytkowników...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #c0392b',
              borderRadius: 6,
              padding: 24,
              textAlign: 'center',
              maxWidth: 400,
            }}>
              <AlertTriangle size={32} color="#c0392b" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#c0392b', margin: '0 0 8px 0' }}>
                Błąd ładowania danych
              </h3>
              <p style={{ color: '#c0392b', margin: '0 0 16px 0' }}>
                {error}
              </p>
              <button
                onClick={loadUsers}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  margin: '0 auto',
                  boxShadow: '0 2px 6px rgba(230, 126, 34, 0.3)',
                }}
              >
                <RefreshCw size={14} />
                Spróbuj ponownie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <UserManagementHeader
          onNavigateBack={() => navigate('/dashboard')}
          onRefresh={loadUsers}
          onAddUser={() => setShowAddUser(true)}
          userCount={filteredUsers.length}
        />

        <div style={{
          backgroundColor: 'white',
          borderRadius: 6,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
          borderLeft: '4px solid #e67e22',
        }}>
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterRole={filterRole}
            onRoleChange={setFilterRole}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
          />
        </div>

        <UserTable
          users={filteredUsers}
          onToggleUserStatus={handleToggleUserStatus}
          onDeleteUser={handleDeleteUser}
          onResetPassword={(user) => setUserToResetPassword(user)}
          onEditUser={(user) => setUserToEdit(user)}
        />

        <AddUserModal
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
          onConfirm={handleAddUser}
        />

        {userToResetPassword && (
          <ResetPasswordModal
            user={userToResetPassword}
            onClose={() => setUserToResetPassword(null)}
            onConfirm={handleResetPassword}
          />
        )}

        {userToEdit && (
          <EditUserModal
            user={userToEdit}
            onClose={() => setUserToEdit(null)}
            onConfirm={handleEditUser}
          />
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;