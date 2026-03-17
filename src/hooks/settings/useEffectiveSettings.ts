/**
 * Hook for getting effective project settings with collection-scoped overrides
 */

import { useShallow } from 'zustand/react/shallow';
import { getEffectiveSettings } from '../../lib/project-registry/effective-settings';
import { useProjectStore } from '../../store/projectStore';

/**
 * Hook to get effective settings with optional collection-specific overrides
 *
 * @param collectionName - Optional collection name for collection-scoped settings
 * @returns Effective settings with three-tier fallback (collection → project → defaults)
 */
export const useEffectiveSettings = (collectionName?: string) => {
  // Object subscription needs shallow
  const currentProjectSettings = useProjectStore(
    useShallow((state) => state.currentProjectSettings),
  );
  return getEffectiveSettings(currentProjectSettings, collectionName);
};
