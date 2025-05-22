import vnpay from "../utils/vnpay.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
class BankRepository {
  constructor(bankModel) {
    this.bankModel = bankModel;
  }
  getAllBanks() {
    return catchAsync(async (req, res, next) => {
      try {
        const banks = await vnpay.getBankList();
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          data: banks,
        });
      } catch (error) {
        console.error("Error fetching bank list:", error);
        return next(new AppError("Server error", 500));
      }
    });
  }
}

export default BankRepository;
