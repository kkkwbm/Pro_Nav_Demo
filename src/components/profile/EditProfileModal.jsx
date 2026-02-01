import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth/authService';
import { X, User, Mail, Phone, Save } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Podaj prawidłowy adres email';
    }

    if (formData.phoneNumber && !/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Podaj prawidłowy numer telefonu';
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
      const result = await authService.updateProfile(formData);

      if (result.success) {
        if (onSave) {
          onSave(result.user);
        }
        onClose();
      } else {
        setErrors({ submit: result.error || 'Wystąpił błąd podczas zapisywania profilu' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Wystąpił błąd podczas zapisywania profilu' });
    } finally {
      setLoading(false);
    }
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
    borderRadius: 6,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    borderLeft: '4px solid #e67e22',
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '44px',
    border: `1px solid ${hasError ? '#c0392b' : '#d1d5db'}`,
    borderRadius: 4,
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

  const errorStyle = {
    fontSize: 13,
    color: '#c0392b',
    marginTop: 4,
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>
            Edytuj Profil
          </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={{
              padding: 12,
              backgroundColor: '#fef2f2',
              border: '1px solid #c0392b',
              borderRadius: 4,
              color: '#c0392b',
              fontSize: 14,
              marginBottom: 20,
            }}>
              {errors.submit}
            </div>
          )}

          {/* First Name */}
          <div>
            <label style={labelStyle}>Imię</label>
            <div style={inputContainerStyle}>
              <User size={16} style={iconStyle} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle(errors.firstName)}
                placeholder="Wprowadź imię"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.firstName ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label style={labelStyle}>Nazwisko</label>
            <div style={inputContainerStyle}>
              <User size={16} style={iconStyle} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle(errors.lastName)}
                placeholder="Wprowadź nazwisko"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.lastName ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <div style={inputContainerStyle}>
              <Mail size={16} style={iconStyle} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle(errors.email)}
                placeholder="Wprowadź adres email"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={labelStyle}>Numer telefonu (opcjonalny)</label>
            <div style={inputContainerStyle}>
              <Phone size={16} style={iconStyle} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={inputStyle(errors.phoneNumber)}
                placeholder="+48 123 456 789"
                disabled={loading}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.phoneNumber ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.phoneNumber && <div style={errorStyle}>{errors.phoneNumber}</div>}
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
                borderRadius: 4,
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
                borderRadius: 4,
                cursor: 'not-allowed',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                opacity: 0.7,
              }}
            >
              <Save size={16} />
              Zapisz zmiany
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

export default EditProfileModal;