import type { Address } from 'viem';

export const TEE_REGISTRY_ADDRESS = '0x4e72238852f3c918f4E4e57AeC9280dDB0c80248';

export interface TEETypeInfo {
  typeId: number;
  name: string;
  addedAt: bigint;
}

export interface TEEInfo {
  teeId: string;
  owner: Address;
  paymentAddress: Address;
  endpoint: string;
  publicKey: string;
  tlsCertificate: string;
  pcrHash: string;
  teeType: number;
  enabled: boolean;
  registeredAt: bigint;
  lastHeartbeatAt: bigint;
}

export interface TEENodeWithStatus extends TEEInfo {
  isActive: boolean;
}

export interface TEETypeSummary {
  typeId: number;
  name: string;
  totalNodes: number;
  enabledNodes: number;
  activeNodes: number;
  approvedPCRs: number;
  addedAt: bigint;
}

export interface TEERegistryStats {
  totalTypes: number;
  totalNodes: number;
  activeNodes: number;
  enabledNodes: number;
  approvedPCRs: number;
}

export type TEERegistryOverview = {
  types: Array<TEETypeSummary>;
  stats: TEERegistryStats;
  nodesByType: Record<number, Array<TEENodeWithStatus>>;
};

export type SerializedTEERegistryOverview = {
  types: Array<Omit<TEETypeSummary, 'addedAt'> & { addedAt: string }>;
  stats: TEERegistryStats;
  nodesByType: Record<string, Array<Omit<TEENodeWithStatus, 'registeredAt' | 'lastHeartbeatAt'> & {
    registeredAt: string;
    lastHeartbeatAt: string;
  }>>;
};

export const serializeTEERegistryOverview = (overview: TEERegistryOverview): SerializedTEERegistryOverview => ({
  types: overview.types.map((type) => ({
    ...type,
    addedAt: type.addedAt.toString(),
  })),
  stats: overview.stats,
  nodesByType: Object.fromEntries(
    Object.entries(overview.nodesByType).map(([ typeId, nodes ]) => [
      typeId,
      nodes.map((node) => ({
        ...node,
        registeredAt: node.registeredAt.toString(),
        lastHeartbeatAt: node.lastHeartbeatAt.toString(),
      })),
    ]),
  ),
});

export const parseTEERegistryOverview = (overview: SerializedTEERegistryOverview): TEERegistryOverview => ({
  types: overview.types.map((type) => ({
    ...type,
    addedAt: BigInt(type.addedAt),
  })),
  stats: overview.stats,
  nodesByType: Object.fromEntries(
    Object.entries(overview.nodesByType).map(([ typeId, nodes ]) => [
      Number(typeId),
      nodes.map((node) => ({
        ...node,
        registeredAt: BigInt(node.registeredAt),
        lastHeartbeatAt: BigInt(node.lastHeartbeatAt),
      })),
    ]),
  ),
});

export const getTEERegistryOverview = async(): Promise<TEERegistryOverview> => {
  const response = await fetch('/api/opengradient/tee-registry');
  if (!response.ok) {
    throw new Error(`Failed to load TEE registry overview: ${ response.status }`);
  }

  return parseTEERegistryOverview(await response.json() as SerializedTEERegistryOverview);
};

export const TEE_REGISTRY_QUERY_KEY = [ 'opengradient', 'teeRegistry' ];
