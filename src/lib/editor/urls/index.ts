/**
 * URL handling system for the editor
 *
 * This module provides comprehensive URL handling capabilities:
 *
 * - URL detection in plain text and markdown links
 * - Alt+Click to open URLs in browser
 * - Visual feedback when Alt key is pressed
 * - State management for Alt key tracking
 *
 * Usage:
 * ```typescript
 * import { altKeyState, urlHoverPlugin, handleUrlClick } from './urls'
 *
 * const extensions = [
 *   altKeyState,
 *   urlHoverPlugin,
 *   EditorView.domEventHandlers({
 *     click: (event, view) => handleUrlClick(view, event)
 *   })
 * ]
 * ```
 */

export type { UrlMatch } from './detection';
export { findUrlsInText, isValidUrl, urlRegex } from './detection';
export { handleUrlClick } from './handlers';
export { altKeyEffect, altKeyState, urlHoverPlugin } from './plugin';
