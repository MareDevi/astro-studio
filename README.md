# Astro Studio

A native macOS and Windows markdown editor designed specifically for [Astro](https://astro.build) content collections.

![Astro Studio Header](docs/assets/header.png)

https://github.com/user-attachments/assets/dc32dd12-2094-47c4-ab90-620ecd11ba48

## Project Origin

This project is based on [astro-editor](https://github.com/dannysmith/astro-editor) by Danny Smith. Astro Studio extends the original editor with additional features including live preview and integrated Git control.

## Features

**Writing Environment**
- **Schema-Aware Forms:** Automatically generates frontmatter forms based on your Zod schemas.
- **MDX Support:** Intelligent component insertion for Astro, React, Vue, and Svelte.
- **Focus Mode:** Dims everything but the current sentence for distraction-free writing.
- **Copyedit Mode:** Highlights parts of speech to help refine your prose.
- **Smart Images:** Live previews, drag-and-drop support, and relative path handling.

**Project Management**
- **Collection Explorer:** Organize your content by collection, draft status, and date.
- **Command Palette:** Quick access to files and commands with `Cmd+K`.
- **Project Switcher:** Seamlessly move between different Astro projects.
- **Crash Recovery:** Automatic backups and recovery to ensure you never lose work.

## Installation

Download the [latest Release](https://github.com/MareDevi/astro-studio/releases).

**macOS:**
1. Download `astro-editor-latest.dmg`.
2. Open and drag Astro Studio to your Applications folder.

**Windows:**
1. Download `astro-editor-latest.msi`.
2. Run the installer.

**Homebrew (macOS):**
```bash
brew install --cask astro-editor
```

## Feedback

Bug reports and feature requests are welcome. See the [issue tracker](https://github.com/MareDevi/astro-studio/issues).

Pull requests welcome. See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup.

## Credits

- **[astro-editor](https://github.com/dannysmith/astro-editor)** by Danny Smith - The original project that serves as the foundation for Astro Studio
- [iA Writer](https://ia.net/writer) for inspiration and [typography](https://github.com/iaolo/iA-Fonts)
- [DarkMatter](https://getdarkmatter.dev/) by [Vadim Demedes](https://vadimdemedes.com/)

## Development

Astro Studio is built with [Tauri](https://tauri.app), [React](https://reactjs.org), and [CodeMirror 6](https://codemirror.net).

**Prerequisites:**
- [Bun](https://bun.sh)
- [Rust](https://www.rust-lang.org)
- [Tauri dependencies](https://tauri.app/v1/guides/getting-started/prerequisites)

**Setup:**
1. Clone the repository.
2. Run `bun install`.
3. Start development mode with `bun run tauri:dev`.

## License

AGPL-3.0-or-later
