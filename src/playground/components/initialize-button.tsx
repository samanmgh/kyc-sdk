interface InitializeButtonProps {
  isInitialized: boolean;
  onInitialize: () => void;
}

export function InitializeButton({ isInitialized, onInitialize }: InitializeButtonProps) {
  return (
    <button
      onClick={onInitialize}
      disabled={isInitialized}
      className={`px-4 py-2 text-sm font-semibold text-white border-none rounded-md cursor-pointer transition-opacity ${
        isInitialized ? "bg-green-500 opacity-70 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {isInitialized ? "✅ SDK Initialized" : "🚀 Initialize SDK"}
    </button>
  );
}
