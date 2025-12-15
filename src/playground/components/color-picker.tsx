import { useState } from 'react';

import { PRESET_COLORS } from '../constants';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ label, value, onChange, disabled }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  const isPresetSelected = PRESET_COLORS.some((preset) => preset.value === value);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>

      {/* Preset Colors */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              onChange(preset.value);
              setShowCustom(false);
            }}
            disabled={disabled}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === preset.value
                ? 'border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-400'
                : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            style={{ backgroundColor: preset.value }}
            title={preset.name}
          />
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          disabled={disabled}
          className={`px-3 h-8 text-xs rounded border transition-all ${
            showCustom || !isPresetSelected
              ? 'bg-gray-200 border-gray-400'
              : 'bg-white border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          Custom
        </button>
      </div>

      {/* Custom Color Input */}
      {(showCustom || !isPresetSelected) && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="oklch(0.55 0.22 264) or #3b82f6"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
          <div
            className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: value }}
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}
