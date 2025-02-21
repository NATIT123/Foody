import Email from "../services/mailService";

exports.sendWelcomeEmail = async (req, res, next) => {
  try {
    const url = `${req.protocol}://${req.get("host")}/`; // Hoặc URL tùy chỉnh

    await new Email(req.body.user, url).sendWelcome();

    res.status(200).json({ message: "Email chào mừng đã được gửi" });
  } catch (error) {
    next(error);
  }
};

exports.sendPasswordResetEmail = async (req, res, next) => {
  try {
    const url = `${req.protocol}://${req.get("host")}/resetPassword/${
      req.body.resetToken
    }`;

    await new Email(req.body.user, url).sendPasswordReset();

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (error) {
    next(error);
  }
};
