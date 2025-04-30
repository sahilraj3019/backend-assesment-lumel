require("dotenv").config();
const express = require("express");
const db = require("./models");
const routes = require("./routes/api.routes");
require("./jobs/refresh.job");

const app = express();
app.use(express.json());
app.use("/api", routes);
const analysisRoutes = require('./routes/analysis.routes');

app.use('/api/analysis', analysisRoutes);

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
