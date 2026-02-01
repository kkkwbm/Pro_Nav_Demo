import React from 'react';
import {
  Mail,
  Phone,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Key
} from 'lucide-react';

const UserTable = ({
  users,
  onToggleUserStatus,
  onDeleteUser,
  onResetPassword,
  onEditUser
}) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: '16px 12px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: 14,
    color: '#111827',
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      ADMIN: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
      MANAGER: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
      TECHNICIAN: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      VIEWER: { bg: '#f9fafb', color: '#374151', border: '#e5e7eb' },
    };

    const style = roleStyles[role] || roleStyles.VIEWER;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        marginRight: 4,
      }}>
        {role}
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
            Użytkownicy (0)
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          Nie znaleziono użytkowników spełniających kryteria wyszukiwania.
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
          Użytkownicy ({users.length})
        </h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Użytkownik</th>
              <th style={thStyle}>Kontakt</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ostatnie logowanie</th>
              <th style={thStyle}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                    }}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Mail size={12} color="#6b7280" />
                      <span style={{ fontSize: 13 }}>{user.email}</span>
                      {user.emailVerified && (
                        <CheckCircle size={12} color="#27ae60" />
                      )}
                    </div>
                    {user.phoneNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={12} color="#6b7280" />
                        <span style={{ fontSize: 13 }}>{user.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {user.roles.map((role, index) => (
                      <span key={`${user.id}-${role}-${index}`}>
                        {getRoleBadge(role)}
                      </span>
                    ))}
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {user.active ? (
                      <>
                        <CheckCircle size={16} color="#27ae60" />
                        <span style={{ color: '#059669', fontSize: 12, fontWeight: 600 }}>
                          Aktywny
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} color="#f59e0b" />
                        <span style={{ color: '#d97706', fontSize: 12, fontWeight: 600 }}>
                          Oczekuje zatwierdzenia
                        </span>
                      </>
                    )}
                  </div>
                </td>

                <td style={tdStyle}>
                  {user.lastLogin ? (
                    <div>
                      <div style={{ fontSize: 13, color: '#111827' }}>
                        {new Date(user.lastLogin).toLocaleDateString('pl-PL')}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {new Date(user.lastLogin).toLocaleTimeString('pl-PL')}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Nigdy</span>
                  )}
                </td>

                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={{
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                      title="Edytuj użytkownika"
                      disabled
                    >
                      <Edit3 size={14} color="#9ca3af" />
                    </button>

                    <button
                      style={{
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                      title="Reset hasła"
                      disabled
                    >
                      <Key size={14} color="#9ca3af" />
                    </button>

                    <button
                      style={{
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                      title={user.active ? 'Dezaktywuj użytkownika' : 'Zatwierdź użytkownika'}
                      disabled
                    >
                      {user.active ? (
                        <XCircle size={14} color="#9ca3af" />
                      ) : (
                        <CheckCircle size={14} color="#9ca3af" />
                      )}
                    </button>

                    <button
                      style={{
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                      title="Usuń użytkownika"
                      disabled
                    >
                      <Trash2 size={14} color="#9ca3af" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;