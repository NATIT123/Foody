class AuthService {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  restrictTo() {
    return this.authRepo.restrictTo();
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

  logOut() {
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

  getMe() {
    return this.authRepo.getMe();
  }

  deleteMe() {
    return this.authRepo.deleteMe();
  }
}

export default AuthService;
