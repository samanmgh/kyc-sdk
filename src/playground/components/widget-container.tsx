interface WidgetContainerProps {
  isVisible: boolean;
}

export function WidgetContainer({ isVisible }: WidgetContainerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div id="kyc-widget-container" className="w-full h-full" />
    </div>
  );
}
