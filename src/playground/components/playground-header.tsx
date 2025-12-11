import KYC_SDK from "../../index";
import { InitializeButton } from "./initialize-button";
import { ConfigurationToggle } from "./configuration-toggle";

interface PlaygroundHeaderProps {
  isInitialized: boolean;
  onInitialize: () => void;
  onOpenConfig: () => void;
}

export function PlaygroundHeader({ isInitialized, onInitialize, onOpenConfig }: PlaygroundHeaderProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="m-0 text-2xl font-bold">KYC SDK Development Playground</h1>
        <div className="flex gap-2 items-center">
          <InitializeButton isInitialized={isInitialized} onInitialize={onInitialize} />
          <ConfigurationToggle onToggle={onOpenConfig} />
        </div>
      </div>
      <p className="m-0 text-sm text-gray-600">Version {KYC_SDK.version} | Test all SDK methods with live reload</p>
    </div>
  );
}
