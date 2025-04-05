const express = require("express");
const cors = require("cors");
const OrgsRoute = require("./orgs");
const InvestorRoute = require("./investors");
const AdminRoute = require("./admin");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/orgs", OrgsRoute);
app.use("/investors", InvestorRoute);
app.use("/admin", AdminRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
