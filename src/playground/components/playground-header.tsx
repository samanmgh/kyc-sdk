import KYC_SDK, { getWidgetInstance } from "../../index";
import { InitializeButton } from "./initialize-button";
import { ConfigurationToggle } from "./configuration-toggle";

const AVAILABLE_LANGUAGES = [
  { code: "en" as const, name: "English" },
  { code: "de" as const, name: "German" },
];

interface PlaygroundHeaderProps {
  isInitialized: boolean;
  onInitialize: () => void;
  onOpenConfig: () => void;
  currentLanguage: "en" | "de";
  onLanguageChange: (lang: "en" | "de") => void;
}

export function PlaygroundHeader({
  isInitialized,
  onInitialize,
  onOpenConfig,
  currentLanguage,
  onLanguageChange,
}: PlaygroundHeaderProps) {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as "en" | "de";
    onLanguageChange(lang);

    const instance = getWidgetInstance();
    if (instance) {
      instance.changeLanguage(lang);
    }
  };

  return (
    <div className='w-full bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex justify-between items-center mb-2'>
        <h1 className='m-0 text-2xl font-bold'>KYC SDK Development Playground</h1>
        <div className='flex gap-2 items-center'>
          {isInitialized && (
            <select
              value={currentLanguage}
              onChange={handleLanguageChange}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-blue-500'
              title='Change Language'
            >
              {AVAILABLE_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <InitializeButton isInitialized={isInitialized} onInitialize={onInitialize} />
          <ConfigurationToggle onToggle={onOpenConfig} />
        </div>
      </div>
      <p className='m-0 text-sm text-gray-600'>
        Version {KYC_SDK.version} | Test all SDK methods with live reload
      </p>
    </div>
  );
}
