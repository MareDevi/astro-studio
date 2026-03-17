/**
 * Editor library - comprehensive markdown editing system
 *
 * This module provides a complete markdown editing solution for CodeMirror 6:
 *
 * - Syntax highlighting with custom tags and comprehensive styling
 * - Markdown editing utilities (formatting, links, headings)
 * - URL handling with Alt+Click support
 * - Drag & drop file processing
 * - Paste handling for URL link creation
 * - Type-safe command system
 * - Extension factory for easy setup
 *
 * The entire system is designed to be:
 * - Modular and testable
 * - Type-safe throughout
 * - Easy to extend and maintain
 * - Following React/TypeScript best practices
 */

// Command system
export * from './commands';
// Drag & drop functionality
export * from './dragdrop';
// Extensions system
export * from './extensions';
// Markdown editing utilities
export * from './markdown';

// Paste handling
export * from './paste';
// Core syntax highlighting
export * from './syntax';
// URL handling system
export * from './urls';
