import React from 'react';

const VARIANT_MAP = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  'ghost-primary': 'btn-ghost-primary',
  'ghost-danger': 'btn-ghost-danger',
  'ghost-secondary': 'btn-ghost-secondary',
  'outline-danger': 'btn-outline-danger',
  'outline-secondary': 'btn-outline-secondary',
  link: 'btn-link',
};

const SIZE_MAP = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = false,
  loading = false,
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const classes = [
    'btn',
    VARIANT_MAP[variant] ?? 'btn-primary',
    SIZE_MAP[size] ?? '',
    icon ? 'btn-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
