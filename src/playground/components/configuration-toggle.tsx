interface ConfigurationToggleProps {
  onToggle: () => void;
}

export function ConfigurationToggle({ onToggle }: ConfigurationToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 bg-blue-500 text-white border-none rounded-md cursor-pointer font-medium text-sm hover:bg-blue-600 transition-colors"
    >
      ⚙️ Configuration
    </button>
  );
}
