/**
 * Drag & Drop system for the editor
 *
 * This module handles file drag and drop functionality:
 *
 * - File processing and asset copying
 * - Markdown formatting for images and files
 * - Edge case handling (no project, no file, etc.)
 * - Payload parsing from Tauri events
 *
 * Usage:
 * ```typescript
 * import { handleTauriFileDrop } from './dragdrop'
 *
 * const unlistenDrop = await listen('tauri://drag-drop', event => {
 *   handleTauriFileDrop(event.payload, editorView)
 * })
 * ```
 */

export {
  buildFallbackMarkdownForPaths,
  validateDropContext,
} from './edgeCases';
export {
  extractFilename,
  formatAsMarkdown,
  isImageFile,
  processDroppedFile,
  processDroppedFiles,
} from './fileProcessing';
export {
  handleTauriFileDrop,
  isDropWithinElement,
  parseFileDropPayload,
} from './handlers';
export type { DropResult, FileDropPayload, ProcessedFile } from './types';
