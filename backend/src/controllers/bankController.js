import BankRepository from "../repo/bankRepo.js";
import BankService from "../services/bankService.js";
import BankModel from "../models/bankModel.js";

const bankRepo = new BankRepository(BankModel);
const bankService = new BankService(bankRepo);

export const getAllBanks = bankService.getAllBanks();
