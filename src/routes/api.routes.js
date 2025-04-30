const express = require("express");
const router = express.Router();
const analysis = require("../controllers/analysis.controller");
const { refreshData } = require("../services/refresh.service");

router.get("/revenue/region", analysis.totalRevenueByRegion);
router.post("/refresh", async (req, res) => {
  const ok = await refreshData();
  res.status(ok ? 200 : 500).send(ok ? "Refreshed." : "Refresh failed.");
});

module.exports = router;