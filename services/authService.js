import customResourceResponse from "../utils/constant.js";

class AuthService {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  restricTo() {
    return this.authRepo.restricTo();
  }

  isLoggedIn() {
    return this.authRepo.isLoggedIn();
  }

  protect() {
    return this.authRepo.protect();
  }

  login() {
    return this.authRepo.login();
  }

  signUp() {
    return this.authRepo.signUp();
  }

  logout() {
    return this.authRepo.logout();
  }

  forgotPassword() {
    return this.authRepo.forgotPassword();
  }

  resetPassword() {
    return this.authRepo.resetPassword();
  }

  changePassword() {
    return this.authRepo.changePassword();
  }

  updateUser() {
    return this.authRepo.updateUser();
  }
}

export default AuthService;
