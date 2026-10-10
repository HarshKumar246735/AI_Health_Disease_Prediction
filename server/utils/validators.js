const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

exports.cleanString = (v) => (typeof v === 'string' ? v.trim() : '');

exports.validateName = (name) => {
  if (name.length < 2 || name.length > 60) return 'Name must be between 2 and 60 characters.';
  return '';
};
exports.validateEmail = (email) => (EMAIL_RE.test(email) && email.length <= 120 ? '' : 'Enter a valid email address.');
exports.validatePassword = (pw) => {
  if (typeof pw !== 'string' || pw.length < 8) return 'Password must be at least 8 characters.';
  if (pw.length > 100) return 'Password is too long.';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password must include a letter and a number.';
  return '';
};

exports.escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.pageParams = (query, maxLimit = 50) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};
