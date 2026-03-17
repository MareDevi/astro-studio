import { snippet } from '@codemirror/autocomplete';
import type { EditorView } from '@codemirror/view';

/**
 * Inserts a snippet at the current cursor position with tab navigation support
 * @param view The CodeMirror EditorView
 * @param template The snippet template string with ${} placeholders
 */
export function insertSnippet(view: EditorView, template: string) {
  if (!view) return;

  const range = view.state.selection.main;
  snippet(template)(view, null, range.from, range.to);
  view.focus();
}
