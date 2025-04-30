const cron = require("node-cron");
const { loadCSV } = require("../services/csvLoader.service");
const logger = require("../utils/logger");

cron.schedule("0 2 * * *", async () => {
  logger.info("[CRON] Starting daily CSV refresh...");
  try {
    await loadCSV(process.env.CSV_PATH);
    logger.info("[CRON] Refresh successful.");
  } catch (e) {
    logger.error("[CRON] Refresh failed.", e);
  }
});