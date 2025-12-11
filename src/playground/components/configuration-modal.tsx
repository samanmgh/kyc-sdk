import { Modal } from "./modal";
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SDK Configuration">
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-700">API Key</label>
        <input
          type="text"
          value={config.apiKey}
          onChange={e => onConfigChange({ apiKey: e.target.value })}
          disabled={isInitialized}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-700">Tenant ID</label>
        <input
          type="number"
          value={config.tenantId}
          onChange={e => onConfigChange({ tenantId: Number(e.target.value) })}
          disabled={isInitialized}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {isInitialized && (
        <p className="mt-4 mb-0 text-sm text-gray-600 p-3 bg-yellow-50 rounded-md border border-yellow-200">
          ⚠️ Configuration is locked after initialization
        </p>
      )}
    </Modal>
  );
}
