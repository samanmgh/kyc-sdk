interface LanguageSelectorProps {
  value: 'en' | 'de';
  onChange: (language: 'en' | 'de') => void;
  disabled?: boolean;
  label?: string;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en' as const, name: 'English' },
  { code: 'de' as const, name: 'German' },
];

export function LanguageSelector({
  value,
  onChange,
  disabled,
  label = "Language"
}: LanguageSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as 'en' | 'de')}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 bg-white"
      >
        {AVAILABLE_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
