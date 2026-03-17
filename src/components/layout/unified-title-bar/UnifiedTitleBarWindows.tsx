import type React from 'react';
import { TitleBarToolbar } from './TitleBarToolbar';
import { WindowsControls } from './WindowsControls';
import { WindowsMenu } from './WindowsMenu';

/**
 * Windows-specific unified title bar with window controls on the right.
 * Uses custom decorations (no native title bar) with drag region support.
 * Includes overflow menu for app functions that macOS gets via native menu bar.
 */
export const UnifiedTitleBarWindows: React.FC = () => {
  return (
    <TitleBarToolbar
      rightSlot={
        <>
          <WindowsMenu />
          <WindowsControls />
        </>
      }
    />
  );
};
