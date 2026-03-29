import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type LayoutOption = "global-header" | "editor-top" | "editor-bottom";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: LayoutOption;
  onLayoutChange: (layout: LayoutOption) => void;
  isAssessmentMode?: boolean;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  currentLayout,
  onLayoutChange,
  isAssessmentMode = false,
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<"layout" | "shortcuts" | "editor">("layout");
  
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
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-100">Settings</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex min-h-75">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-neutral-800 p-4">
            <nav className="space-y-1">
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeTab === "layout"
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
                onClick={() => setActiveTab("layout")}
              >
                Layout
              </button>
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeTab === "shortcuts"
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
                onClick={() => setActiveTab("shortcuts")}
              >
                Shortcuts
              </button>
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeTab === "editor"
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
                onClick={() => setActiveTab("editor")}
              >
                Editor (Coming Soon)
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="w-2/3 p-6">
            {activeTab === "layout" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-200">Action Bar Layout</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Choose where to place the Run and Submit buttons.
                  </p>
                  
                  {isAssessmentMode && (
                    <div className="mt-3 rounded-md bg-orange-500/10 border border-orange-500/20 p-3">
                      <p className="text-xs text-orange-400">
                        Layout customization is disabled during assessments.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <label 
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        currentLayout === "global-header" 
                          ? "border-blue-500 bg-blue-500/5" 
                          : "border-neutral-700 bg-neutral-800/50"
                      } ${isAssessmentMode ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"}`}
                    >
                      <input 
                        type="radio" 
                        name="layout" 
                        value="global-header" 
                        checked={currentLayout === "global-header"}
                        onChange={() => !isAssessmentMode && onLayoutChange("global-header")}
                        disabled={isAssessmentMode}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Top Header</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Buttons appear in the main global navigation bar.</p>
                      </div>
                    </label>

                    <label 
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        currentLayout === "editor-top" 
                          ? "border-blue-500 bg-blue-500/5" 
                          : "border-neutral-700 bg-neutral-800/50"
                      } ${isAssessmentMode ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"}`}
                    >
                      <input 
                        type="radio" 
                        name="layout" 
                        value="editor-top" 
                        checked={currentLayout === "editor-top"}
                        onChange={() => !isAssessmentMode && onLayoutChange("editor-top")}
                        disabled={isAssessmentMode}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Editor Top</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Buttons appear above the code editor next to language selection.</p>
                      </div>
                    </label>

                    <label 
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        currentLayout === "editor-bottom" 
                          ? "border-blue-500 bg-blue-500/5" 
                          : "border-neutral-700 bg-neutral-800/50"
                      } ${isAssessmentMode ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"}`}
                    >
                      <input 
                        type="radio" 
                        name="layout" 
                        value="editor-bottom" 
                        checked={currentLayout === "editor-bottom"}
                        onChange={() => !isAssessmentMode && onLayoutChange("editor-bottom")}
                        disabled={isAssessmentMode}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Editor Bottom</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Buttons appear in a discrete bar below the code editor.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-200">Keyboard Shortcuts</h3>
                  <p className="mt-1 text-xs text-neutral-400 mb-4">
                    Essential shortcuts to speed up your workflow.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-700 bg-neutral-800/50">
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Run Code</p>
                        <p className="text-xs text-neutral-400">Executes your current code against the test cases.</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 border border-neutral-600 rounded">Ctrl</kbd>
                        <span className="text-neutral-500">+</span>
                        <kbd className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 border border-neutral-600 rounded">'</kbd>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-700 bg-neutral-800/50">
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Submit Code</p>
                        <p className="text-xs text-neutral-400">Submits your solution for final evaluation.</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 border border-neutral-600 rounded">Ctrl</kbd>
                        <span className="text-neutral-500">+</span>
                        <kbd className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-700 border border-neutral-600 rounded">Enter</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "editor" && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-neutral-500">More settings coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
