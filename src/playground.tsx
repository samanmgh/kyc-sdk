import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { PlaygroundHeader, WidgetContainer, ConfigurationModal } from "./playground/components";
import { useSDKInitialization } from "./playground/hooks";
import { DEFAULT_CONFIG } from "./playground/constants";
import type { PlaygroundConfig } from "./playground/types";
import "./index.css";

function Playground() {
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(config.language || 'en');
  const { isInitialized, showContainer, initialize } = useSDKInitialization();

  const handleInitialize = () => initialize(config);

  const handleConfigChange = (updates: Partial<PlaygroundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    // Sync language state if language was changed in config
    if (updates.language) {
      setCurrentLanguage(updates.language);
    }
  };

  const handleLanguageChange = (lang: 'en' | 'de') => {
    setCurrentLanguage(lang);
    setConfig(prev => ({ ...prev, language: lang }));
  };

  const handleOpenConfig = () => setShowConfigModal(true);
  const handleCloseConfig = () => setShowConfigModal(false);

  return (
    <div className="font-sans min-h-screen">
      <PlaygroundHeader
        isInitialized={isInitialized}
        onInitialize={handleInitialize}
        onOpenConfig={handleOpenConfig}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <WidgetContainer isVisible={showContainer} />
      <ConfigurationModal
        config={config}
        isInitialized={isInitialized}
        isOpen={showConfigModal}
        onClose={handleCloseConfig}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Playground />
    </StrictMode>
  );
}

export default Playground;
