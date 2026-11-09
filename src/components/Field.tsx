interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'month' | 'tel' | 'url';
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}

export function Field({ label, id, value, onChange, type = 'text', placeholder, multiline, rows = 4, hint }: FieldProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
