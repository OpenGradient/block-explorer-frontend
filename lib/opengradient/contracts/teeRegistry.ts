import { ethers } from 'ethers';
import type { Address } from 'viem';

import type { TEENodeWithStatus, TEEInfo, TEERegistryOverview, TEETypeInfo, TEETypeSummary } from 'lib/opengradient/teeRegistry';
import { TEE_REGISTRY_ADDRESS } from 'lib/opengradient/teeRegistry';

import TEERegistryAbi from './abi/TEERegistry.json';
import { ethDevnetProvider } from './providers';

const contract = new ethers.Contract(TEE_REGISTRY_ADDRESS, TEERegistryAbi, ethDevnetProvider);

export const getTEETypes = async(): Promise<Array<TEETypeInfo>> => {
  const [ typeIds, infos ] = await contract.getTEETypes();

  return (typeIds as Array<number>).map((typeId: number, i: number) => ({
    typeId: Number(typeId),
    name: infos[i].name as string,
    addedAt: BigInt(infos[i].addedAt),
  }));
};

const parseTEEInfo = (teeId: string, raw: Record<string, unknown>): TEEInfo => ({
  teeId,
  owner: raw.owner as Address,
  paymentAddress: raw.paymentAddress as Address,
  endpoint: raw.endpoint as string,
  publicKey: raw.publicKey as string,
  tlsCertificate: raw.tlsCertificate as string,
  pcrHash: raw.pcrHash as string,
  teeType: Number(raw.teeType),
  enabled: raw.enabled as boolean,
  registeredAt: BigInt(raw.registeredAt as ethers.BigNumberish),
  lastHeartbeatAt: BigInt(raw.lastHeartbeatAt as ethers.BigNumberish),
});

export const getTEEsByType = async(teeType: number): Promise<Array<string>> => {
  const teeIds = await contract.getTEEsByType(teeType);
  return (teeIds as Array<string>).map(String);
};

export const getEnabledTEEs = async(teeType: number): Promise<Array<string>> => {
  const teeIds = await contract.getEnabledTEEs(teeType);
  return (teeIds as Array<string>).map(String);
};

export const getTEE = async(teeId: string): Promise<TEEInfo> => {
  const raw = await contract.getTEE(teeId);
  return parseTEEInfo(teeId, raw);
};

export const isTEEActive = async(teeId: string): Promise<boolean> => {
  return contract.isTEEActive(teeId);
};

export const getApprovedPCRs = async(): Promise<Array<{ pcrHash: string; teeType: number }>> => {
  const pcrs = await contract.getApprovedPCRs();
  return (pcrs as Array<{ pcrHash: string; teeType: number }>).map((p) => ({
    pcrHash: String(p.pcrHash),
    teeType: Number(p.teeType),
  }));
};

export const getHeartbeatMaxAge = async(): Promise<bigint> => {
  const maxAge = await contract.heartbeatMaxAge();
  return BigInt(maxAge);
};

/**
 * Fetch full registry overview: types, nodes per type with status, and global stats.
 */
export const getTEERegistryOverviewFromContract = async(): Promise<TEERegistryOverview> => {
  // 1. Get all TEE types
  const types = await getTEETypes();

  // 2. Get approved PCRs
  const approvedPCRs = await getApprovedPCRs();

  // Count approved PCRs per type
  const approvedPCRsByType: Record<number, number> = {};
  for (const pcr of approvedPCRs) {
    approvedPCRsByType[pcr.teeType] = (approvedPCRsByType[pcr.teeType] ?? 0) + 1;
  }

  // 3. For each type, get all TEE ids, enabled ids, and fetch details
  const nodesByType: Record<number, Array<TEENodeWithStatus>> = {};
  const typeSummaries: Array<TEETypeSummary> = [];

  let totalNodes = 0;
  let totalActive = 0;
  let totalEnabled = 0;

  for (const teeType of types) {
    const [ allIds, enabledIds ] = await Promise.all([
      getTEEsByType(teeType.typeId),
      getEnabledTEEs(teeType.typeId),
    ]);

    const enabledSet = new Set(enabledIds);

    // Fetch details for all TEEs of this type
    const nodes: Array<TEENodeWithStatus> = [];
    const teeDetailsPromises = allIds.map(async(teeId) => {
      const [ teeInfo, active ] = await Promise.all([
        getTEE(teeId),
        isTEEActive(teeId).catch(() => false),
      ]);
      return { ...teeInfo, isActive: active };
    });

    const teeDetails = await Promise.all(teeDetailsPromises);
    nodes.push(...teeDetails);

    const activeCount = nodes.filter((n) => n.isActive).length;
    const enabledCount = nodes.filter((n) => enabledSet.has(n.teeId)).length;

    nodesByType[teeType.typeId] = nodes;
    typeSummaries.push({
      typeId: teeType.typeId,
      name: teeType.name,
      totalNodes: allIds.length,
      enabledNodes: enabledCount,
      activeNodes: activeCount,
      approvedPCRs: approvedPCRsByType[teeType.typeId] ?? 0,
      addedAt: teeType.addedAt,
    });

    totalNodes += allIds.length;
    totalActive += activeCount;
    totalEnabled += enabledCount;
  }

  return {
    types: typeSummaries,
    stats: {
      totalTypes: types.length,
      totalNodes,
      activeNodes: totalActive,
      enabledNodes: totalEnabled,
      approvedPCRs: approvedPCRs.length,
    },
    nodesByType,
  };
};
