import { Router } from "express";
import Order from "../models/orderModel.js";
import PaymentTransaction from "../models/paymentTransactionModel.js";
import vnpay from "../utils/vnpay.js";
import {
  ProductCode,
  VnpLocale,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  IpnUnknownError,
  InpOrderAlreadyConfirmed,
  IpnSuccess,
} from "vnpay";
import AppError from "../utils/appError.js";
import { getMe, protect } from "../controllers/authController.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
const router = Router();
router.use(protect);
router.post(
  "/payment-url",
  getMe,
  catchAsync(async (req, res, next) => {
    try {
      const {
        amountInput,
        contentPayment,
        bankSelect,
        orderItems,
        fullName,
        address,
        phoneNumber,
      } = req.body;

      const order = await Order.create({
        userId: req.params.id,
        totalAmount: amountInput,
        status: "pending",
        fullName,
        address,
        phoneNumber,
        orderItems,
      });
      const data = {
        vnp_Amount: amountInput,
        vnp_IpAddr: "127.0.0.1",
        vnp_OrderInfo: contentPayment,
        vnp_ReturnUrl:
          process.env.VNPAY_RETURN_URL ??
          "http://localhost:3001/payment-result",
        vnp_TxnRef: `${order._id}-${Date.now()}`,
        vnp_BankCode: bankSelect ?? undefined,
        vnp_Locale: VnpLocale.VN,
        vnp_OrderType: ProductCode.Other,
      };

      const url = vnpay.buildPaymentUrl(data);
      await PaymentTransaction.create({
        orderId: order._id,
        vnp_TxnRef: data.vnp_TxnRef,
        vnp_Amount: amountInput,
        vnp_TransactionStatus: "pending",
        vnp_BankCode: data.vnp_BankCode || null,
      });

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        url,
      });
    } catch (error) {
      console.log(error);
      return next(new AppError("Server error", 500));
    }
  })
);

router.get(
  "/vnpay-return",
  catchAsync(async (req, res, next) => {
    try {
      const result = vnpay.verifyReturnUrl(req.query);
      const transaction = await PaymentTransaction.findOne({
        vnp_TxnRef: result.vnp_TxnRef,
      });

      if (result.vnp_ResponseCode === "00") {
        transaction.vnp_TransactionStatus = "success";
        transaction.vnp_PayDate = result.vnp_PayDate;
        await transaction.save();

        await Order.findByIdAndUpdate(transaction.orderId, { status: "paid" });
      } else {
        transaction.vnp_TransactionStatus = "fail";
        await transaction.save();
      }

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
      });
    } catch (err) {
      console.error(err);
      return next(new AppError("Server error", 500));
    }
  })
);

router.get(
  "/vnpay-ipn",
  catchAsync(async (req, res, next) => {
    try {
      const verify = vnpay.verifyIpnCall(req.query);
      console.log("🧾 IPN VERIFY RESULT:", verify);

      if (!verify.isVerified) {
        console.log("❌ IPN checksum failed");
        return next(new AppError(IpnFailChecksum.Message, 500));
      }
      const transaction = await PaymentTransaction.findOne({
        vnp_TxnRef: verify.vnp_TxnRef,
      });
      if (!transaction) {
        console.log("❌ Không tìm thấy giao dịch", verify.vnp_TxnRef);
        return next(new AppError(IpnOrderNotFound.Message, 500));
      }

      if (transaction.vnp_Amount !== verify.vnp_Amount) {
        console.log(
          "❌ Sai số tiền",
          transaction.vnp_Amount,
          verify.vnp_Amount
        );
        return next(new AppError(IpnInvalidAmount.Message, 500));
      }

      if (transaction.vnp_TransactionStatus === "success") {
        return res.status(customResourceResponse.success.statusCode).json({
          message: InpOrderAlreadyConfirmed.Message,
          status: "success",
        });
      }
      transaction.vnp_TransactionStatus = "success";
      transaction.vnp_PayDate = verify.vnp_PayDate;
      await transaction.save();

      await Order.findByIdAndUpdate(transaction.orderId, { status: "paid" });

      res.status(customResourceResponse.success.statusCode).json({
        message: IpnSuccess.Message,
        status: "success",
      });
    } catch (err) {
      console.error("💥 IPN ERROR:", err);
      return next(new AppError(IpnUnknownError.Message, 500));
    }
  })
);
router.get(
  "/history",
  getMe,
  catchAsync(async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.params.id })
        .where({
          status: { $ne: "pending" },
        })
        .populate("orderItems.productId", "name price")
        .populate("orderItems.restaurantId", "name")
        .sort({ createdAt: -1 });
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        data: orders,
      });
    } catch (error) {
      console.error(err);
      return next(new AppError("Server error", 500));
    }
  })
);

router.post(
  "/place-order",
  catchAsync(async (req, res, next) => {
    try {
      const { amountInput, fullName, address, phoneNumber, orderItems } =
        req.body;

      await Order.create({
        userId: req.params.id,
        totalAmount: amountInput,
        status: "pending",
        fullName,
        address,
        phoneNumber,
        orderItems,
      });

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return next(new AppError("Server error", 500));
    }
  })
);
export default router;
