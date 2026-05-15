import type { TEERegistryStats, TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';

export const PLACEHOLDER_TEE_REGISTRY_STATS: TEERegistryStats = {
  totalTypes: 3,
  totalNodes: 12,
  activeNodes: 8,
  enabledNodes: 10,
  approvedPCRs: 5,
};

export const PLACEHOLDER_TEE_TYPES: Array<TEETypeSummary> = [
  { typeId: 0, name: 'LLM Inference', totalNodes: 5, enabledNodes: 4, activeNodes: 3, approvedPCRs: 2, addedAt: BigInt(0) },
  { typeId: 1, name: 'Agent Execution', totalNodes: 4, enabledNodes: 3, activeNodes: 3, approvedPCRs: 2, addedAt: BigInt(0) },
  { typeId: 2, name: 'Model Training', totalNodes: 3, enabledNodes: 3, activeNodes: 2, approvedPCRs: 1, addedAt: BigInt(0) },
];
