import app from "./app.js";
import dotenv from "dotenv";
var port = process.env.PORT || 8080;

///Enviroment Variables
dotenv.config({
  path: "./config.env"
});
app.listen(port, function () {
  console.log("Listening on Port:".concat(port));
});
process.on("unhandleRejection", function (err) {
  console.log(err.name, err.message);
  console.log("UNHANDLE REJECTION! SHUTTING DOWN....");
  server.close(function () {
    process.exit(1);
  });
});