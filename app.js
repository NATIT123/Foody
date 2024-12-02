import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = parseInt(process.env.PORT) || 3000;
// connectDb();

import user from "./router/user.js";
import customResourceResponse from "./utils/constant.js";

app.get("/", (req, res) => {
  res.send("Started");
});

app.use("/user", user);

app.use((req, res) => {
  res.status(404).send({
    message: "The requested URL could not be found",
    statusCode: 404,
  });
});

app.use((error, req, res, next) => {});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT} `);
});
