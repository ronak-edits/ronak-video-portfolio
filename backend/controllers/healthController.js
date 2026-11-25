import env from '../config/env.js';
import { getDatabaseStatus } from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * GET /api/health
 * Returns API operational status and database readiness.
 */
export const getHealth = (_req, res) => {
  const healthPayload = {
    status: 'ok',
    service: 'ronak-portfolio-api',
    environment: env.nodeEnv,
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
  };

  res
    .status(200)
    .json(new ApiResponse(200, 'API is healthy', healthPayload));
};
