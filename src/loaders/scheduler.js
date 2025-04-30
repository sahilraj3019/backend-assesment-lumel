const cron = require('node-cron');
const dataLoader = require('./dataLoader');
const logger = require('../utils/logger');

function setupScheduledRefresh() {
  // Schedule daily refresh at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting scheduled data refresh');
    try {
      const result = await dataLoader.loadData(process.env.CSV_PATH, true);
      if (result.success) {
        logger.info('Scheduled refresh completed successfully');
      } else {
        logger.error('Scheduled refresh failed');
      }
    } catch (error) {
      logger.error(`Scheduled refresh error: ${error.message}`);
    }
  });

  logger.info('Scheduled refresh setup complete');
}

module.exports = setupScheduledRefresh;


