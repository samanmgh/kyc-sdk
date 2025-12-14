import { useState, useCallback } from "react";
import KYC_SDK from "../../index";
import type { PlaygroundConfig } from "../types";
import { INIT_DELAY_MS } from "../constants";

export function useSDKInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  const initialize = useCallback(
    async (config: PlaygroundConfig) => {
      if (isInitialized) {
        return;
      }

      try {
        setShowContainer(true);
        await new Promise(resolve => setTimeout(resolve, INIT_DELAY_MS));

        const instance = new KYC_SDK({
          apiKey: config.apiKey,
          tenantId: config.tenantId,
          debug: true,
          style: config.style,
          customCSS: config.customCSS,
          translation: {
            ...config.translation,
            defaultLanguage: config.language || config.translation?.defaultLanguage || 'en',
          },
        });

        await instance.init("#kyc-widget-container");
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing SDK:", error);
      }
    },
    [isInitialized]
  );

  return {
    isInitialized,
    showContainer,
    initialize,
  };
}
