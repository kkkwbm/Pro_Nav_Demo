import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { authService } from '../../services/auth/authService';

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Obecne hasło jest wymagane';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nowe hasło jest wymagane';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Nowe hasło musi mieć co najmniej 8 znaków';
    } else {
      // Check password strength
      const hasUpper = /[A-Z]/.test(formData.newPassword);
      const hasLower = /[a-z]/.test(formData.newPassword);
      const hasDigit = /\d/.test(formData.newPassword);

      if (!hasUpper || !hasLower || !hasDigit) {
        newErrors.newPassword = 'Hasło musi zawierać co najmniej jedną wielką literę, małą literę i cyfrę';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdź nowe hasło';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Nowe hasło musi być różne od obecnego';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        onSave();
        onClose();

        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        // Check if the error is about incorrect current password
        if (result.error && result.error.includes('incorrect')) {
          setErrors({ currentPassword: 'Obecne hasło jest nieprawidłowe' });
        } else {
          setErrors({ submit: result.error || 'Wystąpił błąd podczas zmiany hasła' });
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ submit: 'Wystąpił błąd podczas zmiany hasła' });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#e5e7eb' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { label: 'Bardzo słabe', color: '#ef4444' },
      { label: 'Słabe', color: '#f59e0b' },
      { label: 'Średnie', color: '#eab308' },
      { label: 'Dobre', color: '#22c55e' },
      { label: 'Bardzo dobre', color: '#10b981' },
    ];

    return { strength, ...levels[Math.min(strength, 4)] };
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '44px',
    paddingRight: '44px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  });

  const inputContainerStyle = {
    position: 'relative',
    marginBottom: 20,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const iconStyle = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    zIndex: 1,
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorStyle = {
    fontSize: 13,
    color: '#ef4444',
    marginTop: 4,
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              padding: 8,
              backgroundColor: '#fef3c7',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={20} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>
              Zmień Hasło
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          padding: 16,
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0c4a6e', margin: '0 0 8px 0' }}>
            Wymagania dotyczące hasła:
          </h4>
          <ul style={{ fontSize: 13, color: '#0369a1', margin: 0, paddingLeft: 20 }}>
            <li>Co najmniej 8 znaków</li>
            <li>Przynajmniej jedna wielka litera (A-Z)</li>
            <li>Przynajmniej jedna mała litera (a-z)</li>
            <li>Przynajmniej jedna cyfra (0-9)</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={{
              padding: 12,
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#991b1b',
              fontSize: 14,
              marginBottom: 20,
            }}>
              {errors.submit}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label style={labelStyle}>Obecne hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={iconStyle} />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                style={inputStyle(errors.currentPassword)}
                placeholder="Wprowadź obecne hasło"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.currentPassword ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => togglePasswordVisibility('current')}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.currentPassword && <div style={errorStyle}>{errors.currentPassword}</div>}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={labelStyle}>Nowe hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={iconStyle} />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                style={inputStyle(errors.newPassword)}
                placeholder="Wprowadź nowe hasło"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.newPassword ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => togglePasswordVisibility('new')}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {formData.newPassword && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Siła hasła:</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: 4,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      height: '100%',
                      backgroundColor: passwordStrength.color,
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                </div>
              )}
              {errors.newPassword && <div style={errorStyle}>{errors.newPassword}</div>}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Potwierdź nowe hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={iconStyle} />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle(errors.confirmPassword)}
                placeholder="Powtórz nowe hasło"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => togglePasswordVisibility('confirm')}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Anuluj
            </button>
            
            <button
              type="button"
              disabled={true}
              title="Niedostępne w wersji demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'not-allowed',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                opacity: 0.7,
              }}
            >
              <Shield size={16} />
              Zmień hasło
            </button>
          </div>
        </form>
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

export default ChangePasswordModal;