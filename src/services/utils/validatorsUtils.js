/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasDigit) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None' };

  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengthLevels = {
    0: { strength: 0, label: 'Very Weak', color: 'red' },
    1: { strength: 20, label: 'Very Weak', color: 'red' },
    2: { strength: 25, label: 'Weak', color: 'orange' },
    3: { strength: 50, label: 'Fair', color: 'yellow' },
    4: { strength: 60, label: 'Fair', color: 'yellow' },
    5: { strength: 70, label: 'Good', color: 'light-green' },
    6: { strength: 85, label: 'Strong', color: 'green' },
    7: { strength: 100, label: 'Very Strong', color: 'green' },
  };

  return strengthLevels[Math.min(strength, 7)];
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      error: 'Username must be less than 50 characters',
    };
  }

  // Check for valid characters (alphanumeric, underscore, dash)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and dashes',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return { isValid: true, error: null }; // Phone is optional
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid phone number length (7-15 digits)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Format as US phone number if 10 digits
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // Return original if not US format
  return phoneNumber;
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate form data
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Object with field names as keys and validation functions as values
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const value = formData[field];
    const validators = Array.isArray(validationRules[field])
      ? validationRules[field]
      : [validationRules[field]];

    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        errors[field] = result.error;
        break; // Stop at first error for this field
      }
    }
  });

  return errors;
};

/**
 * Check if form has errors
 */
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};