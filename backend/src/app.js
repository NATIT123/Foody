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
import restaurantRoute from "./router/restaurant.js";
import foodRoute from "./router/food.js";
import commentRoute from "./router/comment.js";
import albumRoute from "./router/album.js";
import countryRoute from "./router/country.js";
import cityRoute from "./router/city.js";
import districtRoute from "./router/district.js";
import categoryRoute from "./router/category.js";
import subCategoryRoute from "./router/subCategory.js";
import cuisinesRoute from "./router/cuisines.js";
import coordinateRoute from "./router/coordinate.js";
import favoriteRestaurantRoute from "./router/favoriteRestaurant.js";
import notificationRoute from "./router/notification.js";
import { importData } from "./controllers/handleFactory.js";
import UserModel from "./models/userModel.js";
import CountryModel from "./models/CountryModel.js";
import CityModel from "./models/cityModel.js";
import CategoryModel from "./models/categoryModel.js";
import SubCategoryModel from "./models/subCategoryModel.js";
import DistrictModel from "./models/districtModel.js";
import RestaurantModel from "./models/restaurantModel.js";
import FoodModel from "./models/foodModel.js";
import CommentModel from "./models/commentModel.js";
import AlbumModel from "./models/AlbumModel.js";
import CuisinesModel from "./models/CuisinesModel.js";
import CoordinateModel from "./models/coordinateModel.js";
import FavoriteRestaurantModel from "./models/favoriteRestaurantModel.js";
import NotificationModel from "./models/notificationModel.js";
import bankRoute from "./router/bank.js";
import paymentRoute from "./router/payment.js";
///Connect DB
connectDb();

///Set up views Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

///Static Files
app.use(express.static(path.join(__dirname, "public")));

//Proxy
app.enable("trust proxy");
//Cors
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

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

//Restaurant
app.use("/api/v1/restaurant", restaurantRoute);
importData(RestaurantModel, "restaurants");
// updateDatabase(RestaurantModel, `${__dirname}/data/sorted_restaurants.csv`);

//Food
app.use("/api/v1/food", foodRoute);
importData(FoodModel, "foods");

//Comment
app.use("/api/v1/comment", commentRoute);
importData(CommentModel, "comments");

///Album
app.use("/api/v1/album", albumRoute);
importData(AlbumModel, "albums");

//City
app.use("/api/v1/city", cityRoute);
importData(CityModel, "city");

//District
app.use("/api/v1/district", districtRoute);
importData(DistrictModel, "district");

//Category
app.use("/api/v1/category", categoryRoute);
importData(CategoryModel, "category");

//SubCategory
app.use("/api/v1/subCategory", subCategoryRoute);
importData(SubCategoryModel, "subCategory");

//Cuisines
app.use("/api/v1/cuisines", cuisinesRoute);
importData(CuisinesModel, "cuisines");

//Coordinate
app.use("/api/v1/coordinates", coordinateRoute);
importData(CoordinateModel, "coordinates");

//FavoriteRestaurant
app.use("/api/v1/favorite", favoriteRestaurantRoute);
importData(FavoriteRestaurantModel, "favoriteRestaurants");

//Country
app.use("/api/v1/country", countryRoute);
importData(CountryModel, "country");

//Notification
app.use("/api/v1/notification", notificationRoute);
importData(NotificationModel, "notifications");

//Bank
app.use("/api/v1/bank", bankRoute);

//Payment
app.use("/api/v1/payment", paymentRoute);

app.all("*", (req, res, next) => {
  ///Stop all middleware and run immdiatelty to below
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleErrorGlobal);

export default app;
