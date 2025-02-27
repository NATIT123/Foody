import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import nodemailer from "nodemailer";
import pug from "pug";
import path from "node:path";
import { htmlToText } from "html-to-text";
import { fileURLToPath } from "node:url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var Email = /*#__PURE__*/function () {
  function Email(user, url) {
    _classCallCheck(this, Email);
    this.to = user.email;
    this.firstName = user.fullname.split(" ")[0];
    this.url = url;
    this.from = "FoodyServices <".concat(process.env.EMAIL_FROM, ">");
  }
  return _createClass(Email, [{
    key: "newTransport",
    value: function newTransport() {
      if (process.env.NODE_ENV === "production") {
        // Sendgrid
        return nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
      }
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: "Gmail",
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }

    // Send the actual email
  }, {
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(template, subject) {
        var html, mailOptions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // 1) Render HTML based on a pug template
              html = pug.renderFile("".concat(__dirname, "/../views/email/").concat(template, ".pug"), {
                firstName: this.firstName,
                url: this.url,
                subject: subject
              }); // 2) Define email options
              mailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html: html,
                text: htmlToText(html)
              }; // 3) Create a transport and send email
              _context.next = 4;
              return this.newTransport().sendMail(mailOptions);
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "sendWelcome",
    value: function () {
      var _sendWelcome = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.send("welcome", "Welcome to the Foody!");
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function sendWelcome() {
        return _sendWelcome.apply(this, arguments);
      }
      return sendWelcome;
    }()
  }, {
    key: "sendPasswordReset",
    value: function () {
      var _sendPasswordReset = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.send("passwordReset", "Your password reset token (valid for only 10 minutes)");
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function sendPasswordReset() {
        return _sendPasswordReset.apply(this, arguments);
      }
      return sendPasswordReset;
    }()
  }]);
}();
export { Email as default };