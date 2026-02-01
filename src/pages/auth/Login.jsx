import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle, Wrench } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const notification = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect path from location state or default to app
  const from = location.state?.from?.pathname || '/app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nazwa użytkownika lub email jest wymagana';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.username, formData.password, rememberMe);

      if (result.success) {
        // Show success notification and redirect immediately
        notification.showSuccess('Zalogowano pomyślnie!');
        navigate(from, { replace: true });
      } else {
        // Map specific error types to user-friendly Polish messages
        let errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
        
        if (result.error) {
          const errorLower = result.error.toLowerCase();
          if (errorLower.includes('invalid') || errorLower.includes('credentials') || 
              errorLower.includes('unauthorized') || errorLower.includes('bad credentials') ||
              errorLower.includes('niepoprawne') || result.error === 'Login failed') {
            errorMessage = 'Niepoprawne dane';
            notification.showError('Niepoprawne dane logowania. Sprawdź nazwę użytkownika i hasło.');
          } else if (errorLower.includes('not found') || errorLower.includes('user not found')) {
            errorMessage = 'Niepoprawne dane';
            notification.showError('Niepoprawne dane logowania. Sprawdź nazwę użytkownika i hasło.');
          } else if (errorLower.includes('locked') || errorLower.includes('disabled')) {
            errorMessage = 'Konto zostało zablokowane. Skontaktuj się z administratorem.';
            notification.showError('Konto zostało zablokowane. Skontaktuj się z administratorem.');
          } else if (errorLower.includes('expired')) {
            errorMessage = 'Sesja wygasła. Spróbuj ponownie.';
            notification.showError('Sesja wygasła. Spróbuj ponownie.');
          } else {
            errorMessage = result.error;
            notification.showError(result.error);
          }
        }
        
        setErrors({
          submit: errorMessage,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.';
        notification.showError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
      } else if (error.response?.status === 401) {
        errorMessage = 'Niepoprawne dane';
        notification.showError('Niepoprawne dane logowania. Sprawdź nazwę użytkownika i hasło.');
      } else if (error.response?.status >= 500) {
        errorMessage = 'Problem z serwerem. Spróbuj ponownie za chwilę.';
        notification.showError('Problem z serwerem. Spróbuj ponownie za chwilę.');
      } else {
        notification.showError(errorMessage);
      }
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ef',
    padding: '20px',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
    padding: 40,
    borderLeft: '4px solid #e67e22',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 32,
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  };

  const titleStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
  };

  const subtitleStyle = {
    fontSize: 15,
    color: '#6b7280',
    margin: 0,
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
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

  const inputIconStyle = {
    position: 'absolute',
    left: 14,
    color: '#9ca3af',
    zIndex: 1,
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: 12,
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
    color: '#c0392b',
    margin: 0,
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  };

  const checkboxGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const checkboxStyle = {
    width: 16,
    height: 16,
    accentColor: '#e67e22',
  };

  const checkboxLabelStyle = {
    fontSize: 14,
    color: '#374151',
    cursor: 'pointer',
  };

  const linkStyle = {
    fontSize: 14,
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 500,
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: isSubmitting ? '#9ca3af' : '#e67e22',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 600,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
    marginTop: 8,
    boxShadow: isSubmitting ? 'none' : '0 2px 6px rgba(230, 126, 34, 0.3)',
  };

  const submitErrorStyle = {
    padding: 16,
    backgroundColor: '#fef2f2',
    border: '1px solid #c0392b',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: '#6b7280',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={brandStyle}>
            <div style={{
              padding: 12,
              backgroundColor: '#e67e22',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Wrench size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2c3e50' }}>Tebar</div>
              <div style={{ fontSize: 12, color: '#5a6c7d' }}>Service Management</div>
            </div>
          </div>
          <h1 style={titleStyle}>Zaloguj się</h1>
          <p style={subtitleStyle}>Wprowadź swoje dane, aby uzyskać dostęp do systemu</p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={submitErrorStyle}>
              <AlertCircle size={20} color="#c0392b" />
              <span style={{ color: '#c0392b', fontSize: 14, fontWeight: 500 }}>
                {errors.submit}
              </span>
            </div>
          )}


          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nazwa użytkownika lub email</label>
            <div style={inputContainerStyle}>
              <User size={16} style={inputIconStyle} />
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                style={inputStyle(errors.username)}
                placeholder="Wprowadź nazwę użytkownika lub email"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.username ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={inputIconStyle} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{ ...inputStyle(errors.password), paddingRight: '44px' }}
                placeholder="Wprowadź hasło"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          <div style={checkboxContainerStyle}>
            <div style={checkboxGroupStyle}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={checkboxStyle}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" style={checkboxLabelStyle}>
                Zapamiętaj mnie
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#d35400';
                e.target.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#e67e22';
                e.target.style.boxShadow = '0 2px 6px rgba(230, 126, 34, 0.3)';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                Logowanie...
              </>
            ) : (
              'Zaloguj się'
            )}
          </button>
        </form>

        <div style={footerStyle}>
          Nie masz konta?{' '}
          <Link
            to="/register"
            style={linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#d35400'}
            onMouseLeave={(e) => e.target.style.color = '#e67e22'}
          >
            Zarejestruj się
          </Link>
        </div>
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

export default Login;