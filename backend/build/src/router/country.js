import { Router } from "express";
var router = Router();
import { addCountry, getAllCountrys, updateCountryById, getCountryById, deleteCountryById } from "../controllers/countryController.js";
router.get("/getAllCountry", getAllCountrys);
router.post("/addCountry", addCountry);
router["delete"]("/deleteCountry/:id", deleteCountryById);
router.patch("/updateCountry/:id", updateCountryById);
router.get("/getCountry/:id", getCountryById);
export default router;