import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = parseInt(process.env.PORT) || 3000;
// connectDb();

import user from "./router/user.js";
import restaurant from "./router/restaurant.js";
import food from "./router/food.js";
import comment from "./router/comment.js";
import album from "./router/album.js";
import customResourceResponse from "./utils/constant.js";

app.get("/", (req, res) => {
  res.send("Started");
});

//User
app.use("/user", user);

//Restaurant
app.use("/restaurant", restaurant);

//Food
app.use("/food", food);

//Comment
app.use("/commnet", comment);

///Album
app.use("/album", album);

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
