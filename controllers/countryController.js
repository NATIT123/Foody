import CountryRepo from "../repo/countryRepo.js";
import CountryService from "../services/countryService.js";

import CountryModel from "../models/CountryModel.js";

const countryRepo = new CountryRepo(CountryModel);
const countryService = new CountryService(countryRepo);

export const addCountry = countryService.addCountry();

export const getAllCountrys = countryService.getAll();

export const getCountryById = countryService.getCountryById();

export const updateCountryById = countryService.updateCountryById();

export const deleteCountryById = countryService.deleteCountryById();
