import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary:
    'btn-purple-glow text-white border border-purple-400/30',
  secondary:
    'bg-surface/80 text-ink border border-border hover:border-accent-bright/60 hover:bg-surface-elevated',
  ghost:
    'bg-transparent text-muted hover:text-ink border border-transparent hover:border-border',
};

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-xs sm:text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm sm:text-base',
};

const Button = ({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
