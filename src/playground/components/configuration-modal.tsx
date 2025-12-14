import { Modal } from "./modal";
import { ColorPicker } from "./color-picker";
import { LanguageSelector } from "./language-selector";
import { getWidgetInstance } from "../../index";
import type { PlaygroundConfig } from "../types";

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
  const handleStyleChange = (styleUpdate: Partial<NonNullable<PlaygroundConfig['style']>>) => {
    const newStyles = { ...config.style, ...styleUpdate };
    onConfigChange({ style: newStyles });

    // If SDK is initialized, apply styles immediately
    if (isInitialized) {
      const instance = getWidgetInstance();
      if (instance) {
        instance.changeStyles(newStyles);
      }
    }
  };

  const handleLanguageChange = (language: string) => {
    onConfigChange({ language });

    // If SDK is initialized, change language immediately
    if (isInitialized) {
      const instance = getWidgetInstance();
      if (instance) {
        instance.changeLanguage(language);
      }
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onConfigChange({ theme });

    // If SDK is initialized, change theme immediately
    if (isInitialized) {
      const instance = getWidgetInstance();
      if (instance) {
        instance.changeTheme(theme);
      }
    }
  };

  const handleCustomCSSChange = (customCSS: string) => {
    onConfigChange({ customCSS });

    // If SDK is initialized, apply custom CSS immediately
    if (isInitialized) {
      const instance = getWidgetInstance();
      if (instance) {
        instance.changeCustomCSS(customCSS);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SDK Configuration">
      {/* API Configuration Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          API Settings
        </h3>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">API Key</label>
          <input
            type="text"
            value={config.apiKey}
            onChange={e => onConfigChange({ apiKey: e.target.value })}
            disabled={isInitialized}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Tenant ID</label>
          <input
            type="number"
            value={config.tenantId}
            onChange={e => onConfigChange({ tenantId: Number(e.target.value) })}
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
          <label className="block mb-2 text-sm font-semibold text-gray-700">Theme</label>
          <select
            value={config.theme || 'light'}
            onChange={e => handleThemeChange(e.target.value as 'light' | 'dark')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <ColorPicker
          label="Primary Color"
          value={config.style?.primary || 'oklch(0.55 0.22 264)'}
          onChange={value => handleStyleChange({ primary: value })}
          disabled={false}
        />

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Border Radius</label>
          <input
            type="text"
            value={config.style?.radius || '0.625rem'}
            onChange={e => handleStyleChange({ radius: e.target.value })}
            disabled={false}
            placeholder="0.625rem"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Custom CSS</label>
          <textarea
            value={config.customCSS || ''}
            onChange={e => handleCustomCSSChange(e.target.value)}
            placeholder=".my-button { color: red; }"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Raw CSS to inject. Overrides default widget styles.
          </p>
        </div>
      </div>

      {/* Language Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Language Settings
        </h3>

        <LanguageSelector
          label="Default Language"
          value={config.language || 'en'}
          onChange={handleLanguageChange}
          disabled={false}
        />

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Translation Endpoint (Optional)
          </label>
          <input
            type="text"
            value={config.translation?.endpoint || ''}
            onChange={e => onConfigChange({
              translation: { ...config.translation, endpoint: e.target.value || undefined }
            })}
            disabled={false}
            placeholder="https://api.example.com/translations"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to use built-in translations. Format: endpoint/lang.json
          </p>
        </div>
      </div>
    </Modal>
  );
}
