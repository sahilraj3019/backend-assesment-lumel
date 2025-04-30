const { loadCSV } = require("./csvLoader.service");
const logger = require("../utils/logger");

async function refreshData() {
  logger.info("Starting manual data refresh...");
  try {
    await loadCSV(process.env.CSV_PATH);
    logger.info("Manual refresh completed.");
    return true;
  } catch (e) {
    logger.error("Manual refresh failed", e);
    return false;
  }
}

module.exports = { refreshData };