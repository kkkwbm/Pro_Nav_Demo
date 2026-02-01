import React, { useState } from 'react';
import { X, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordModal = ({ user, onClose, onConfirm }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push('Hasło musi mieć co najmniej 8 znaków');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Hasło musi zawierać przynajmniej jedną cyfrę');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać przynajmniej jedną wielką literę');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać przynajmniej jedną małą literę');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const validationErrors = {};
    const passwordErrors = validatePassword(newPassword);

    if (passwordErrors.length > 0) {
      validationErrors.newPassword = passwordErrors.join(', ');
    }

    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(user.id, newPassword);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayStyle = {
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

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const inputGroupStyle = {
    marginBottom: 20,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
  };

  const passwordInputContainerStyle = {
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 40px 10px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const togglePasswordStyle = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  };

  const infoBoxStyle = {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    display: 'flex',
    gap: 8,
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 24,
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <Key size={24} color="#3b82f6" />
            Resetuj hasło użytkownika
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <div style={infoBoxStyle}>
          <AlertCircle size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: '#1e40af' }}>
            Resetujesz hasło dla użytkownika: <strong>{user.firstName} {user.lastName}</strong> (@{user.username})
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="newPassword" style={labelStyle}>
              Nowe hasło *
            </label>
            <div style={passwordInputContainerStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="Wpisz nowe hasło"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={togglePasswordStyle}
              >
                {showPassword ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
              </button>
            </div>
            {errors.newPassword && <p style={errorStyle}>{errors.newPassword}</p>}
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              Minimum 8 znaków, zawierające: małą literę, wielką literę i cyfrę
            </p>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Potwierdź nowe hasło *
            </label>
            <div style={passwordInputContainerStyle}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Wpisz ponownie nowe hasło"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={togglePasswordStyle}
              >
                {showConfirmPassword ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
              </button>
            </div>
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onClose}
              style={cancelButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...submitButtonStyle,
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? 'Resetowanie...' : 'Resetuj hasło'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
