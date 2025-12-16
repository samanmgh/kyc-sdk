import { Modal } from './modal';
import { ColorPicker } from './color-picker';
import { LanguageSelector } from './language-selector';

import type { PlaygroundConfig } from '../types';

interface ConfigurationModalProps {
  config: PlaygroundConfig;
  isInitialized: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: Partial<PlaygroundConfig>) => void;
}

export function ConfigurationModal({
  config,
  isInitialized,
  isOpen,
  onClose,
  onConfigChange,
}: ConfigurationModalProps) {
  const handleStyleChange = (styleUpdate: Partial<NonNullable<PlaygroundConfig['styles']>>) => {
    const newStyles = { ...config.styles, ...styleUpdate };
    onConfigChange({ styles: newStyles });

    // Note: Direct SDK instance access removed - styles managed through props
  };

  const handleLanguageChange = (language: 'en' | 'de') => {
    onConfigChange({ language });

    // Note: Direct SDK instance access removed - language managed through props
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onConfigChange({ theme });

    // Note: Direct SDK instance access removed - theme managed through props
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SDK Configuration">
      {/* API Configuration Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          API Settings
        </h3>

        <div className="mb-4">
          <label htmlFor="api-key" className="block mb-2 text-sm font-semibold text-gray-700">
            API Key
          </label>
          <input
            id="api-key"
            type="text"
            value={config.apiKey}
            onChange={(e) => onConfigChange({ apiKey: e.target.value })}
            disabled={isInitialized}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tenant-id" className="block mb-2 text-sm font-semibold text-gray-700">
            Tenant ID
          </label>
          <input
            id="tenant-id"
            type="number"
            value={config.tenantId}
            onChange={(e) => onConfigChange({ tenantId: Number(e.target.value) })}
            disabled={isInitialized}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Style Customization Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Style Customization
        </h3>

        <div className="mb-4">
          <label htmlFor="theme" className="block mb-2 text-sm font-semibold text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            value={config.theme || 'dark'}
            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <ColorPicker
          label="Primary Color"
          value={config.styles?.primary || 'oklch(0.55 0.22 264)'}
          onChange={(value) => handleStyleChange({ primary: value })}
          disabled={false}
        />

        <div className="mb-4">
          <label htmlFor="radius" className="block mb-2 text-sm font-semibold text-gray-700">
            Border Radius
          </label>
          <input
            id="radius"
            type="text"
            value={config.styles?.radius || '0.625rem'}
            onChange={(e) => handleStyleChange({ radius: e.target.value })}
            disabled={false}
            placeholder="0.625rem"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Language Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Language Settings
        </h3>

        <LanguageSelector
          label="Language"
          value={config.language || 'en'}
          onChange={handleLanguageChange}
          disabled={false}
        />
      </div>
    </Modal>
  );
}
