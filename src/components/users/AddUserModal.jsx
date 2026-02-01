import React, { useState } from 'react';
import { X, UserPlus, User, Mail, Phone, Shield, Key } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    roles: [],
    active: true
  });

  const [errors, setErrors] = useState({});

  const availableRoles = ['ADMIN', 'MANAGER', 'TECHNICIAN', 'VIEWER'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Nazwa użytkownika jest wymagana';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nazwa użytkownika musi mieć minimum 3 znaki';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć minimum 8 znaków';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'Wybierz przynajmniej jedną rolę';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      onConfirm(userData);
    }
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      roles: [],
      active: true
    });
    setErrors({});
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#c0392b',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  };

  const errorStyle = {
    color: '#c0392b',
    fontSize: 12,
    marginTop: 4,
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        maxWidth: 600,
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#111827',
            margin: 0,
          }}>
            Dodaj nowego użytkownika
          </h2>
          <button
            onClick={handleClose}
            style={{
              padding: 6,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>
                <User size={14} style={{ display: 'inline', marginRight: 4 }} />
                Imię *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={errors.firstName ? errorInputStyle : inputStyle}
                placeholder="Imię"
              />
              {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
            </div>

            <div>
              <label style={labelStyle}>
                <User size={14} style={{ display: 'inline', marginRight: 4 }} />
                Nazwisko *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={errors.lastName ? errorInputStyle : inputStyle}
                placeholder="Nazwisko"
              />
              {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <User size={14} style={{ display: 'inline', marginRight: 4 }} />
              Nazwa użytkownika *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={errors.username ? errorInputStyle : inputStyle}
              placeholder="Nazwa użytkownika"
            />
            {errors.username && <div style={errorStyle}>{errors.username}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <Mail size={14} style={{ display: 'inline', marginRight: 4 }} />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={errors.email ? errorInputStyle : inputStyle}
              placeholder="email@example.com"
            />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
              Numer telefonu
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              style={inputStyle}
              placeholder="+48 123 456 789"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>
                <Key size={14} style={{ display: 'inline', marginRight: 4 }} />
                Hasło *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={errors.password ? errorInputStyle : inputStyle}
                placeholder="Minimum 8 znaków"
              />
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </div>

            <div>
              <label style={labelStyle}>
                <Key size={14} style={{ display: 'inline', marginRight: 4 }} />
                Potwierdź hasło *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={errors.confirmPassword ? errorInputStyle : inputStyle}
                placeholder="Powtórz hasło"
              />
              {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <Shield size={14} style={{ display: 'inline', marginRight: 4 }} />
              Role *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {availableRoles.map((role) => (
                <label
                  key={role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 12,
                    border: `2px solid ${formData.roles.includes(role) ? '#e67e22' : '#e5e7eb'}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    backgroundColor: formData.roles.includes(role) ? '#fff5ec' : 'white',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    style={{ marginRight: 8, cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: formData.roles.includes(role) ? '#e67e22' : '#374151',
                  }}>
                    {role}
                  </span>
                </label>
              ))}
            </div>
            {errors.roles && <div style={errorStyle}>{errors.roles}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 12,
                border: `2px solid ${formData.active ? '#27ae60' : '#e5e7eb'}`,
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: formData.active ? '#f0fdf4' : '#f9fafb',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                style={{ marginRight: 8, cursor: 'pointer' }}
              />
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: formData.active ? '#27ae60' : '#6b7280',
              }}>
                Konto aktywne
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Anuluj
            </button>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 6px rgba(39, 174, 96, 0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
            >
              <UserPlus size={16} />
              Dodaj użytkownika
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;