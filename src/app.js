const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const server = express();
server.name = "vm-api";

//configuraciones de express
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Content-Type", "multipart/form-data");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE"
  );
  next();
});

//conecta con las rutas
const router = require("./routes/index.routes");
server.use("/", router);

module.exports = server;
