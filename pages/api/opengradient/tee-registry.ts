import type { NextApiRequest, NextApiResponse } from 'next';

import { getTEERegistryOverviewFromContract } from 'lib/opengradient/contracts/teeRegistry';
import { serializeTEERegistryOverview } from 'lib/opengradient/teeRegistry';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const overview = await getTEERegistryOverviewFromContract();
    res.status(200).json(serializeTEERegistryOverview(overview));
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to load TEE registry overview',
    });
  }
}
