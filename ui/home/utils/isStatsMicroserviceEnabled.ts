import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';

const statsFeature = getFeaturePayload(config.features.stats);

const isStatsMicroserviceEnabled = Boolean(
  statsFeature && (statsFeature.api.endpoint !== config.api.endpoint || statsFeature.api.basePath),
);

export default isStatsMicroserviceEnabled;
