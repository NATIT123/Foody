import express from "express";
const app = express();
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import AppError from "./utils/appError.js";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import handleErrorGlobal from "./controllers/errorController.js";
import connectDb from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import userRoute from "./router/user.js";
import { importData } from "./controllers/handleFactory.js";
import UserModel from "./models/userModel.js";
///Connect DB
connectDb();

///Set up views Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

///Static Files
app.use(express.static(path.join(__dirname, "public")));

//Cors
app.use(cors());

///Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

//Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

//Body parser, reading data  from body into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));

///Cookie-Parser
app.use(cookieParser());

//Data santization againts NOSQL query injection
app.use(mongoSanitize());

//Data santization against XSS
app.use(xss());

//Prevent parameter poluttion
app.use(hpp());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//Middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Started");
});

app.use((req, res, next) => {
  req.request = new Date().toISOString();
  console.log(req.cookies);
  next();
});

///Routes

//User
app.use("/api/v1/user", userRoute);
///Add Data
importData(UserModel, "user");

app.all("*", (req, res, next) => {
  ///Stop all middleware and run immdiatelty to below
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleErrorGlobal);

export default app;
