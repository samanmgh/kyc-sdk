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
  const { isInitialized, showContainer, initialize } = useSDKInitialization();

  const handleInitialize = () => initialize(config);

  const handleConfigChange = (updates: Partial<PlaygroundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleOpenConfig = () => setShowConfigModal(true);
  const handleCloseConfig = () => setShowConfigModal(false);

  return (
    <div className="font-sans min-h-screen">
      <PlaygroundHeader
        isInitialized={isInitialized}
        onInitialize={handleInitialize}
        onOpenConfig={handleOpenConfig}
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
