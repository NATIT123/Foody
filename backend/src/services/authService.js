class AuthService {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  restrictTo = (...roles) => {
    return this.authRepo.restrictTo(...roles);
  };

  protect() {
    return this.authRepo.protect();
  }

  login() {
    return this.authRepo.login();
  }

  signUp() {
    return this.authRepo.signUp();
  }

  logOut() {
    return this.authRepo.logOut();
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

  getMe() {
    return this.authRepo.getMe();
  }

  deleteMe() {
    return this.authRepo.deleteMe();
  }

  updateMe() {
    return this.authRepo.updateMe();
  }

  processNewToken() {
    return this.authRepo.processNewToken();
  }
  checkPassword() {
    return this.authRepo.checkPassword();
  }
}

export default AuthService;
