import type { TEERegistryStats, TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';

export const PLACEHOLDER_TEE_REGISTRY_STATS: TEERegistryStats = {
  totalTypes: 0,
  totalNodes: 0,
  activeNodes: 0,
  enabledNodes: 0,
  approvedPCRs: 0,
};

export const PLACEHOLDER_TEE_TYPES: Array<TEETypeSummary> = [];
