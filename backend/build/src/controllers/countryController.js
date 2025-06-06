import CountryRepo from "../repo/countryRepo.js";
import CountryService from "../services/countryService.js";
import CountryModel from "../models/CountryModel.js";
var countryRepo = new CountryRepo(CountryModel);
var countryService = new CountryService(countryRepo);
export var addCountry = countryService.addCountry();
export var getAllCountrys = countryService.getAll();
export var getCountryById = countryService.getCountryById();
export var updateCountryById = countryService.updateCountryById();
export var deleteCountryById = countryService.deleteCountryById();