import type React from 'react';
import { type AppPlatform, usePlatform } from '../../../hooks/usePlatform';
import { UnifiedTitleBarLinux } from './UnifiedTitleBarLinux';
import { UnifiedTitleBarMacOS } from './UnifiedTitleBarMacOS';
import { UnifiedTitleBarWindows } from './UnifiedTitleBarWindows';

const titleBarByPlatform: Record<AppPlatform, React.FC> = {
  macos: UnifiedTitleBarMacOS,
  windows: UnifiedTitleBarWindows,
  linux: UnifiedTitleBarLinux,
};

/**
 * Platform-aware unified title bar component.
 * - macOS: Traffic lights on left, toolbar items
 * - Windows: Toolbar items, window controls on right
 * - Linux: Native decorations, toolbar only
 */
export const UnifiedTitleBar: React.FC = () => {
  const platform = usePlatform();
  const TitleBar = titleBarByPlatform[platform ?? 'macos'];
  return <TitleBar />;
};
