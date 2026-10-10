import { Link } from 'react-router-dom';

// variant: primary | secondary | ghost | danger   size: md | lg
export default function Button({
  children, variant = 'primary', size = 'md', loading = false, to, href, className = '', disabled, type = 'button', ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${loading ? 'is-loading' : ''} ${className}`;
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>;
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
    </button>
  );
}
