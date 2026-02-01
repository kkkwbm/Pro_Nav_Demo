import React, { useState, useRef, useEffect } from 'react';
import { Map, Users, Calendar, Settings, ChevronDown, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const tabs = [
    { id: 'map', label: 'Mapa', icon: Map, color: '#e67e22' },
    { id: 'clients', label: 'Klienci', icon: Users, color: '#27ae60' },
    { id: 'services', label: 'Serwisy', icon: Calendar, color: '#f59e0b' },
    { id: 'settings', label: 'Ustawienia', icon: Settings, color: '#d35400' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDashboard = () => {
    setShowDropdown(false);
    navigate('/dashboard');
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    paddingRight: 'calc(24px + 17px)', // Add scrollbar width to right padding
    zIndex: 1000,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  };

  const tabContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(243, 244, 246, 0.5)',
    padding: 4,
    borderRadius: 6,
  };

  const tabStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.25s ease',
    border: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  const getTabStyle = (tabId, color) => {
    const isActive = activeTab === tabId;
    return {
      ...tabStyle,
      backgroundColor: isActive ? 'white' : 'transparent',
      color: isActive ? color : '#6b7280',
      boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
    };
  };

  const indicatorStyle = (isActive, color) => ({
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: isActive ? '60%' : '0%',
    height: 3,
    background: color,
    borderRadius: '3px 3px 0 0',
    transition: 'width 0.3s ease',
  });

  const iconStyle = (isActive) => ({
    transition: 'transform 0.2s ease',
    transform: isActive ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
  });

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginRight: 'auto',
    paddingRight: 24,
  };

  const logoIconStyle = {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)',
  };

  return (
    <div style={containerStyle}>
      {/* Logo/Brand */}
      <div style={logoStyle}>
        <div style={logoIconStyle}>
          <Map size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>
            SerwisPro
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: -2 }}>
            System serwisowy
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        {tabs.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={getTabStyle(id, color)}
            onMouseEnter={(e) => {
              if (activeTab !== id) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon 
                size={18} 
                style={iconStyle(activeTab === id)}
                strokeWidth={activeTab === id ? 2.5 : 2}
              />
            </div>
            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
            <div style={indicatorStyle(activeTab === id, color)}></div>
          </button>
        ))}
      </div>

      {/* User dropdown menu */}
      <div style={{ 
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
      }} ref={dropdownRef}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 24,
            background: showDropdown ? 'rgba(230, 126, 34, 0.1)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: showDropdown ? '1px solid rgba(230, 126, 34, 0.2)' : '1px solid transparent',
          }}
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={(e) => {
            if (!showDropdown) {
              e.currentTarget.style.background = 'rgba(230, 126, 34, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showDropdown) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            transition: 'transform 0.2s ease',
            boxShadow: '0 2px 8px rgba(230, 126, 34, 0.3)',
          }}>
            SP
          </div>

          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                SerwisPro Demo
              </span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {user.email || 'user@serwispro.pl'}
              </span>
            </div>
          )}
          
          <ChevronDown 
            size={16} 
            style={{ 
              color: '#6b7280',
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            minWidth: 200,
            backgroundColor: 'white',
            borderRadius: 6,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            zIndex: 3000,
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f3f4f6',
              backgroundColor: '#f9fafb',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                SerwisPro Demo
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                {user?.email || 'user@serwispro.pl'}
              </div>
            </div>
            
            <div style={{ padding: 8 }}>
              <button
                onClick={handleDashboard}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Home size={16} color="#6b7280" />
                Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#c0392b',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={16} color="#c0392b" />
                Wyloguj się
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;