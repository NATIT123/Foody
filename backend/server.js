import app from "./app.js";
import dotenv from "dotenv";
const port = process.env.PORT || 8080;

///Enviroment Variables
dotenv.config({ path: "./config.env" });

app.listen(port, () => {
  console.log(`Listening on Port:${port}`);
});

process.on("unhandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLE REJECTION! SHUTTING DOWN....");
  server.close(() => {
    process.exit(1);
  });
});
