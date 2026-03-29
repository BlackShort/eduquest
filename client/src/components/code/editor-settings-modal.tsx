import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface EditorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
}

export const EditorSettingsModal = ({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  tabSize,
  setTabSize,
}: EditorSettingsModalProps) => {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-100">Editor Settings</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Font Size */}
          <div>
            <label className="text-sm font-medium text-neutral-200">Font Size</label>
            <p className="mt-1 text-xs text-neutral-400 mb-3">
              Adjust the size of the text in the code editor.
            </p>
            <div className="flex flex-wrap gap-2">
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                    fontSize === size 
                      ? "bg-blue-600 border-blue-500 text-white" 
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Tab Size */}
          <div>
            <label className="text-sm font-medium text-neutral-200">Tab Size</label>
            <p className="mt-1 text-xs text-neutral-400 mb-3">
              Set the number of spaces for indentation.
            </p>
            <div className="flex gap-2">
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setTabSize(size)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                    tabSize === size 
                      ? "bg-blue-600 border-blue-500 text-white" 
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  {size} Spaces
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
