import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Eye, EyeOff, Lock, User, Mail, Phone, AlertCircle, CheckCircle, Wrench } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const notification = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Nazwa użytkownika jest wymagana';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nazwa użytkownika musi mieć co najmniej 3 znaki';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Nazwa użytkownika nie może przekraczać 50 znaków';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Niepoprawny format email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło jest niewystarczająco silne';
    } else {
      // Check password strength
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasDigit = /\d/.test(formData.password);

      if (!hasUpper || !hasLower || !hasDigit) {
        newErrors.password = 'Hasło jest niewystarczająco silne';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdź hasło';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła są różne';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    // Phone number validation (optional) - more specific validation
    if (formData.phoneNumber) {
      const phoneRegex = /^[\d\s\-\+\(\)]{9,}$/;
      const digitsOnly = formData.phoneNumber.replace(/[^\d]/g, '');
      
      if (!phoneRegex.test(formData.phoneNumber) || digitsOnly.length < 9) {
        newErrors.phoneNumber = 'Niepoprawny format numeru telefonu';
      }
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
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      const result = await register(userData);

      if (result.success) {
        // Show success notification
        notification.showSuccess('Zarejestrowano, poczekaj na zatwierdzenie przez Admina');
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Map specific backend errors to user-friendly messages
        let errorMessage = 'Rejestracja nie powiodła się. Spróbuj ponownie.';
        
        if (result.error) {
          const errorLower = result.error.toLowerCase();
          if (errorLower.includes('email') && errorLower.includes('exist')) {
            errorMessage = 'Email jest już zarejestrowany';
          } else if (errorLower.includes('username') && errorLower.includes('exist')) {
            errorMessage = 'Nazwa użytkownika jest już zajęta';
          } else if (errorLower.includes('email') && (errorLower.includes('invalid') || errorLower.includes('format'))) {
            errorMessage = 'Niepoprawny format email';
          } else if (errorLower.includes('phone') && (errorLower.includes('invalid') || errorLower.includes('format'))) {
            errorMessage = 'Niepoprawny format numeru telefonu';
          } else if (errorLower.includes('password') && errorLower.includes('weak')) {
            errorMessage = 'Hasło jest niewystarczająco silne';
          } else {
            errorMessage = result.error;
          }
        }
        
        setErrors({
          submit: errorMessage,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Niepoprawne dane rejestracji';
      } else if (error.response?.status === 409) {
        errorMessage = 'Użytkownik o tym emailu lub nazwie już istnieje';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Problem z serwerem. Spróbuj ponownie za chwilę.';
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
    maxWidth: '480px',
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

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
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

  const successStyle = {
    padding: 16,
    backgroundColor: '#f0fdf4',
    border: '1px solid #27ae60',
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

  const linkStyle = {
    fontSize: 14,
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 500,
  };

  const termsStyle = {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 1.5,
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
          <h1 style={titleStyle}>Utwórz konto</h1>
          <p style={subtitleStyle}>Wypełnij formularz, aby założyć nowe konto</p>
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
            <label style={labelStyle}>Nazwa użytkownika</label>
            <div style={inputContainerStyle}>
              <User size={16} style={inputIconStyle} />
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                style={inputStyle(errors.username)}
                placeholder="Wybierz nazwę użytkownika"
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
            <label style={labelStyle}>Adres email</label>
            <div style={inputContainerStyle}>
              <Mail size={16} style={inputIconStyle} />
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                style={inputStyle(errors.email)}
                placeholder="twoj@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div style={rowStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Imię</label>
              <div style={inputContainerStyle}>
                <User size={16} style={inputIconStyle} />
                <input
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  style={inputStyle(errors.firstName)}
                  placeholder="Jan"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e67e22';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.firstName ? '#c0392b' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nazwisko</label>
              <div style={inputContainerStyle}>
                <User size={16} style={inputIconStyle} />
                <input
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  style={inputStyle(errors.lastName)}
                  placeholder="Kowalski"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e67e22';
                    e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.lastName ? '#c0392b' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Numer telefonu (opcjonalny)</label>
            <div style={inputContainerStyle}>
              <Phone size={16} style={inputIconStyle} />
              <input
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                style={inputStyle(errors.phoneNumber)}
                placeholder="+48 123 456 789"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.phoneNumber ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.phoneNumber && <p style={errorStyle}>{errors.phoneNumber}</p>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={inputIconStyle} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                style={{ ...inputStyle(errors.password), paddingRight: '44px' }}
                placeholder="Co najmniej 8 znaków z wielką literą, małą i cyfrą"
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

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Potwierdź hasło</label>
            <div style={inputContainerStyle}>
              <Lock size={16} style={inputIconStyle} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                style={{ ...inputStyle(errors.confirmPassword), paddingRight: '44px' }}
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? '#c0392b' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
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
                Tworzenie konta...
              </>
            ) : (
              'Utwórz konto'
            )}
          </button>

          <div style={termsStyle}>
            Tworząc konto, akceptujesz nasze{' '}
            <Link to="/terms" style={linkStyle}>
              Warunki świadczenia usług
            </Link>{' '}
            oraz{' '}
            <Link to="/privacy" style={linkStyle}>
              Politykę prywatności
            </Link>
          </div>
        </form>

        <div style={footerStyle}>
          Masz już konto?{' '}
          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#d35400'}
            onMouseLeave={(e) => e.target.style.color = '#e67e22'}
          >
            Zaloguj się
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

export default Register;