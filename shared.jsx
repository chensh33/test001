
// Shared Fluent UI-style components

const FluentColors = {
  primary: '#0078d4',
  primaryDark: '#005a9e',
  primaryLight: '#deecf9',
  bg: '#f3f2f1',
  bgDark: '#edebe9',
  surface: '#ffffff',
  border: '#e1dfdd',
  borderDark: '#c8c6c4',
  text: '#201f1e',
  textSecondary: '#605e5c',
  textMuted: '#a19f9d',
  navBg: '#1b1a19',
  navText: '#c8c6c4',
  navActive: '#0078d4',
  success: '#107c10',
  warning: '#d83b01',
  error: '#a4262c',
  info: '#0078d4',
  purple: '#8764b8',
  teal: '#038387',
};

const Avatar = ({ initials, color = '#0078d4', size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    letterSpacing: '0.02em',
  }}>{initials}</div>
);

const Badge = ({ label, type = 'default' }) => {
  const styles = {
    Active: { bg: '#dff6dd', color: '#107c10' },
    Inactive: { bg: '#fde7e9', color: '#a4262c' },
    Pending: { bg: '#fff4ce', color: '#8a6914' },
    Open: { bg: '#deecf9', color: '#0078d4' },
    'In Review': { bg: '#fff4ce', color: '#8a6914' },
    Closed: { bg: '#f3f2f1', color: '#605e5c' },
    High: { bg: '#fde7e9', color: '#a4262c' },
    Medium: { bg: '#fff4ce', color: '#8a6914' },
    Low: { bg: '#dff6dd', color: '#107c10' },
    'In Network': { bg: '#dff6dd', color: '#107c10' },
    'Out of Network': { bg: '#fde7e9', color: '#a4262c' },
    'On Call': { bg: '#deecf9', color: '#0078d4' },
    Available: { bg: '#dff6dd', color: '#107c10' },
    'Wrap-Up': { bg: '#fff4ce', color: '#8a6914' },
    Break: { bg: '#f3f2f1', color: '#605e5c' },
    'In Progress': { bg: '#deecf9', color: '#0078d4' },
    'Pending Approval': { bg: '#fff4ce', color: '#8a6914' },
    Completed: { bg: '#dff6dd', color: '#107c10' },
    default: { bg: '#f3f2f1', color: '#605e5c' },
  };
  const s = styles[label] || styles.default;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 8px', borderRadius: 2, fontSize: 11,
      fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>{label}</span>
  );
};

const CommandBar = ({ title, subtitle, actions = [], onBack }) => (
  <div style={{
    background: FluentColors.surface,
    borderBottom: `1px solid ${FluentColors.border}`,
    padding: '0 16px',
    minHeight: 44,
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '6px 8px', color: FluentColors.primary, fontSize: 16,
        display: 'flex', alignItems: 'center', borderRadius: 2,
      }}>
        ←
      </button>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: FluentColors.text }}>{title}</span>
        {subtitle && <span style={{ fontSize: 12, color: FluentColors.textSecondary }}>· {subtitle}</span>}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      {actions.map((a, i) => (
        <button key={i} onClick={a.onClick} style={{
          background: a.primary ? FluentColors.primary : 'none',
          color: a.primary ? '#fff' : FluentColors.text,
          border: a.primary ? 'none' : `1px solid ${FluentColors.borderDark}`,
          padding: '5px 12px', borderRadius: 2, cursor: 'pointer',
          fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {a.icon && <span>{a.icon}</span>}
          {a.label}
        </button>
      ))}
    </div>
  </div>
);

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div style={{ position: 'relative', flex: 1 }}>
    <span style={{
      position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
      color: FluentColors.textMuted, fontSize: 13,
    }}>🔍</span>
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '6px 10px 6px 28px',
        border: `1px solid ${FluentColors.border}`,
        borderRadius: 2, fontSize: 13, outline: 'none',
        background: FluentColors.surface,
        color: FluentColors.text,
      }}
    />
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', borderBottom: `1px solid ${FluentColors.border}`,
    background: FluentColors.surface,
    paddingLeft: 16,
  }}>
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '10px 16px', fontSize: 13, fontWeight: 500,
        color: active === t ? FluentColors.primary : FluentColors.textSecondary,
        borderBottom: active === t ? `2px solid ${FluentColors.primary}` : '2px solid transparent',
        marginBottom: -1,
      }}>{t}</button>
    ))}
  </div>
);

const FormField = ({ label, value, onChange, type = 'text', required, readOnly, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: FluentColors.textSecondary }}>
      {label}{required && <span style={{ color: FluentColors.error }}> *</span>}
    </label>
    {options ? (
      <select value={value} onChange={e => onChange && onChange(e.target.value)}
        disabled={readOnly}
        style={{ padding: '5px 8px', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, fontSize: 13, background: readOnly ? FluentColors.bg : FluentColors.surface }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea value={value} onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly} rows={3}
        style={{ padding: '5px 8px', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, fontSize: 13, resize: 'vertical', background: readOnly ? FluentColors.bg : FluentColors.surface, fontFamily: 'inherit' }} />
    ) : (
      <input value={value} onChange={e => onChange && onChange(e.target.value)}
        type={type} readOnly={readOnly}
        style={{ padding: '5px 8px', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, fontSize: 13, background: readOnly ? FluentColors.bg : FluentColors.surface }} />
    )}
  </div>
);

const Section = ({ title, children, collapsible }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={() => collapsible && setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 0', borderBottom: `1px solid ${FluentColors.border}`,
        cursor: collapsible ? 'pointer' : 'default', marginBottom: 10,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: FluentColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        {collapsible && <span style={{ fontSize: 11, color: FluentColors.textMuted }}>{open ? '▲' : '▼'}</span>}
      </div>
      {open && children}
    </div>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8, color: FluentColors.textMuted }}>
    <div style={{ fontSize: 32 }}>{icon}</div>
    <div style={{ fontWeight: 600, color: FluentColors.textSecondary, fontSize: 14 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 12, color: FluentColors.textMuted }}>{subtitle}</div>}
  </div>
);

const Modal = ({ open, title, onClose, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: FluentColors.surface, width, maxWidth: '95vw',
        maxHeight: '90vh', overflow: 'auto', borderRadius: 4,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${FluentColors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: FluentColors.textSecondary, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
};

Object.assign(window, { FluentColors, Avatar, Badge, CommandBar, SearchBar, Tabs, FormField, Section, EmptyState, Modal });
