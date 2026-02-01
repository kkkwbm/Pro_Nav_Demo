import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import {
  Users,
  Calendar,
  Settings,
  Map,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Phone,
  Mail,
  Shield,
  User,
  Edit,
  Lock,
  Activity,
  BarChart3,
  MessageSquare,
  TestTube,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);


  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      ADMIN: { bg: '#fef5e7', color: '#e67e22', border: '#e67e22' },
      MANAGER: { bg: '#e8f5e9', color: '#27ae60', border: '#27ae60' },
      TECHNICIAN: { bg: '#e3f2fd', color: '#2c3e50', border: '#2c3e50' },
      VIEWER: { bg: '#f5f3ef', color: '#5a6c7d', border: '#5a6c7d' },
    };

    const style = roleStyles[role] || roleStyles.VIEWER;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}>
        {role}
      </span>
    );
  };

  const pageStyle = {
    height: '100vh',
    backgroundColor: '#f5f3ef',
    padding: '20px',
    overflow: 'auto',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };

  const headerStyle = {
    marginBottom: 28,
  };

  const welcomeCardStyle = {
    backgroundColor: '#2c3e50',
    borderRadius: 6,
    padding: 28,
    color: '#ecf0f1',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
    marginBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
    marginBottom: 28,
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 22,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    borderLeft: '4px solid #e67e22',
    transition: 'all 0.25s ease',
  };

  const quickActionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 14,
    marginBottom: 28,
  };

  const actionCardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 18,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    borderLeft: '4px solid #e67e22',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 28,
  };

  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 18,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    borderLeft: '4px solid #e67e22',
    textAlign: 'center',
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickActions = [
    {
      icon: Map,
      title: 'Mapa Serwisowa',
      description: 'Zobacz lokalizacje klientów',
      color: '#2c3e50',
      onClick: () => navigate('/app?tab=map'),
    },
    {
      icon: TestTube,
      title: 'Testy Usług Zewnętrznych',
      description: 'Sprawdź status integracji',
      color: '#e67e22',
      onClick: () => navigate('/admin/external-services'),
    },
  ];

  const adminActions = [
    {
      icon: Bell,
      title: 'Zgłoszenia Serwisowe',
      description: 'Zarządzaj zgłoszeniami klientów',
      color: '#c0392b',
      onClick: () => navigate('/app?tab=custom-clients'),
    },
    {
      icon: Shield,
      title: 'Zarządzaj Użytkownikami',
      description: 'Dodaj i zarządzaj kontami',
      color: '#2c3e50',
      onClick: () => navigate('/admin/users'),
    },
    {
      icon: BarChart3,
      title: 'Raporty i Statystyki',
      description: 'Analizuj dane biznesowe',
      color: '#e67e22',
      onClick: () => navigate('/admin/reports'),
    },
    {
      icon: MessageSquare,
      title: 'Historia SMS',
      description: 'Przeglądaj wysłane wiadomości',
      color: '#27ae60',
      onClick: () => navigate('/admin/sms-history'),
    },
    {
      icon: Clock,
      title: 'Zaplanowane SMS',
      description: 'Zarządzaj zaplanowanymi wiadomościami',
      color: '#2c3e50',
      onClick: () => navigate('/admin/planned-sms'),
    },
  ];

  const handleProfileSave = (updatedUser) => {
    // The authService already updates the stored user data
    // We just need to show a success message
    alert('Profil został zaktualizowany pomyślnie!');
    // Force a page refresh to show updated data
    window.location.reload();
  };

  const handlePasswordChange = () => {
    alert('Hasło zostało zmienione pomyślnie!');
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Welcome Header */}
        <div style={welcomeCardStyle}>
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px 0' }}>
                  Witaj! 👋
                </h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                  Miło Cię widzieć w systemie SerwisPro
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
                  {formatDate(currentTime)}
                </div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
              }}>
                SP
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                  SerwisPro Demo
                </div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>
                  {user?.email || 'user@serwispro.pl'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={statsStyle}>
          <div style={statCardStyle}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#27ae60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <CheckCircle size={24} color="white" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 4 }}>
              {user?.active ? 'Aktywny' : 'Nieaktywny'}
            </div>
            <div style={{ fontSize: 12, color: '#5a6c7d' }}>Status konta</div>
          </div>

          <div style={statCardStyle}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Activity size={24} color="white" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 4 }}>
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pl-PL') : 'Nigdy'}
            </div>
            <div style={{ fontSize: 12, color: '#5a6c7d' }}>Ostatnie logowanie</div>
          </div>

          <div style={statCardStyle}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#e67e22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Clock size={24} color="white" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 4 }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : 'N/A'}
            </div>
            <div style={{ fontSize: 12, color: '#5a6c7d' }}>Dołączył do systemu</div>
          </div>

          <div style={statCardStyle}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Shield size={24} color="white" />
            </div>
            <div style={{
              fontSize: user?.roles?.length > 1 ? 14 : 18,
              fontWeight: 700,
              color: '#2c3e50',
              marginBottom: 4,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4
            }}>
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <span key={role}>
                    {role}{index < user.roles.length - 1 ? ',' : ''}
                  </span>
                ))
              ) : (
                'Brak'
              )}
            </div>
            <div style={{ fontSize: 12, color: '#5a6c7d' }}>Przypisane role</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
            Szybkie akcje
          </h2>
          <div style={quickActionsStyle}>
            {quickActions.map((action, index) => (
              <div
                key={index}
                style={actionCardStyle}
                onClick={action.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderLeftWidth = '6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.borderLeftWidth = '4px';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  backgroundColor: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <action.icon size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginBottom: 4 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#5a6c7d' }}>
                    {action.description}
                  </div>
                </div>
              </div>
            ))}

            {(isAdmin() || isManager()) && adminActions.map((action, index) => (
              <div
                key={`admin-${index}`}
                style={actionCardStyle}
                onClick={action.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderLeftWidth = '6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.borderLeftWidth = '4px';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  backgroundColor: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <action.icon size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginBottom: 4 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#5a6c7d' }}>
                    {action.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Information */}
        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 20 }}>
              Informacje o koncie
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <User size={20} color="#5a6c7d" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>
                    SerwisPro Demo
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6c7d' }}>Nazwa użytkownika</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mail size={20} color="#5a6c7d" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {user?.email}
                    {user?.emailVerified && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        backgroundColor: '#e8f5e9',
                        color: '#27ae60',
                        border: '1px solid #27ae60',
                      }}>
                        ✓ Zweryfikowany
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6c7d' }}>Adres email</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Phone size={20} color="#5a6c7d" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>
                    {user?.phoneNumber || 'Nie podano'}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6c7d' }}>Numer telefonu</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Shield size={20} color="#5a6c7d" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                    {user?.roles?.map((role) => (
                      <span key={role}>
                        {getRoleBadge(role)}
                      </span>
                    )) || (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: '#f5f3ef',
                        color: '#5a6c7d',
                        border: '1px solid #5a6c7d',
                      }}>
                        Brak ról
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6c7d' }}>Przypisane role</div>
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50', marginBottom: 20 }}>
              Zarządzanie kontem
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => setShowEditProfile(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Edit size={16} color="#6b7280" />
                <div>
                  <div style={{ fontWeight: 600 }}>Edytuj profil</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Zmień dane osobowe</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowChangePassword(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Lock size={16} color="#6b7280" />
                <div>
                  <div style={{ fontWeight: 600 }}>Zmień hasło</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Aktualizuj hasło dostępu</div>
                </div>
              </button>
              
              <button
                disabled={true}
                title="Niedostępne w wersji demo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  cursor: 'not-allowed',
                  fontSize: 14,
                  color: '#9ca3af',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left',
                  opacity: 0.7,
                }}
              >
                <User size={16} color="#9ca3af" />
                <div>
                  <div style={{ fontWeight: 600 }}>Wyloguj się</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Zakończ sesję użytkownika</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        {isAdmin() && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fed7aa',
            borderLeft: '4px solid #f59e0b',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 32,
            marginBottom: 20,
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <AlertCircle size={20} color="#d97706" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>
                Uprawnienia administratora
              </div>
              <div style={{ fontSize: 13, color: '#a16207' }}>
                Posiadasz pełne uprawnienia administratora. Używaj ich odpowiedzialnie.
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />

        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          onSave={handlePasswordChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;