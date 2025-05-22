class BankService {
  constructor(bankRepo) {
    this.bankRepo = bankRepo;
  }

  getAllBanks() {
    return this.bankRepo.getAllBanks();
  }
}

export default BankService;
