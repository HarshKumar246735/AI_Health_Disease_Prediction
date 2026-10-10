const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (value) => {
  if (!value.trim()) return 'Enter your email address.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email, like name@example.com.';
  return '';
};

export const validateName = (value) => {
  const v = value.trim();
  if (!v) return 'Enter your full name.';
  if (v.length < 2) return 'Your name must be at least 2 characters.';
  if (v.length > 60) return 'Your name must be 60 characters or fewer.';
  return '';
};

export const validatePassword = (value) => {
  if (!value) return 'Enter a password.';
  if (value.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Include at least one letter and one number.';
  return '';
};

// 0-4 score used by the strength meter
export const passwordStrength = (value) => {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Za-z]/.test(value) && /\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) || (/[a-z]/.test(value) && /[A-Z]/.test(value))) score += 1;
  return score;
};
