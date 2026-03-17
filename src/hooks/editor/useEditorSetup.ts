import type { EditorView } from '@codemirror/view';
import { useCallback } from 'react';
import {
  cleanupMenuCommands,
  createEditorCommandRegistry,
  exportMenuCommands,
  globalCommandRegistry,
} from '../../lib/editor/commands';
import { createExtensions } from '../../lib/editor/extensions';
import type { KeymapHandlers } from '../../lib/editor/extensions/keymap';

/**
 * Hook for setting up editor extensions and commands
 */
export const useEditorSetup = (
  onSave: () => void,
  onFocus: () => void,
  onBlur: () => void,
  keymapHandlers?: KeymapHandlers,
) => {
  // Create extensions with current configuration
  const extensions = createExtensions({
    onFocus,
    onBlur,
    keymapHandlers,
  });

  // Set up editor commands when editor view is available
  const setupCommands = useCallback(
    (editorView: EditorView) => {
      const commands = createEditorCommandRegistry(onSave);
      globalCommandRegistry.register(commands, editorView);
      exportMenuCommands();
    },
    [onSave],
  );

  // Cleanup commands
  const cleanupCommands = useCallback(() => {
    globalCommandRegistry.unregister();
    cleanupMenuCommands();
  }, []);

  return {
    extensions,
    setupCommands,
    cleanupCommands,
  };
};
