import type React from 'react';
import { TitleBarToolbar } from './TitleBarToolbar';
import { TrafficLights } from './TrafficLights';

/**
 * macOS-specific unified title bar with traffic light window controls.
 * Traffic lights are positioned on the left, before the sidebar toggle.
 */
export const UnifiedTitleBarMacOS: React.FC = () => {
  return <TitleBarToolbar leftSlot={<TrafficLights />} />;
};
