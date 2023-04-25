import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routers/web";
import connectDB from "./config/conectDB";
import cors from "cors";

require("dotenv").config(); // giup chayj dc dong process.env

let app = express();
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080; //Port === undefined => Port = 6060

app.listen(port, () => {
  //callback
  console.log("Backend Zalo-app is running on the port: " + port);
});
